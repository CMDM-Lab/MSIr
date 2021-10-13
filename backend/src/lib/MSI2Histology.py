import numpy as np
from scipy.sparse import save_npz
import cv2,os, requests, argparse, sys
from itk import elastix_registration_method
from dotenv import load_dotenv
from Reg_functions import ImzmlFileReader, sort_cnt_by_area, \
    generate_msi_mask, tic_normalization, getorient, get_elastix_transform_matrix, get_inital_transform_matrix, \
    processing_intensity_reg, elastix_parameter_object

def process_command():
    parser = argparse.ArgumentParser()
    parser.add_argument('-ID','--RegistrationID',type=int,required=True,help='The Registration ID : int')
    return parser.parse_args()

if __name__ == '__main__':
    try:
        ##### parameter setting #####
        args = process_command()
        RegID=args.RegistrationID

        #load env file
        load_dotenv(dotenv_path="./backend/.env")
        api_key=os.getenv("API_KEY")
        api_url=os.getenv('API_URL')
        dir_hist=os.getenv('DIR_HIST')
        dir_msi = os.getenv('DIR_MSI')

        #Get registration parameters
        get_data={"id":RegID,"key":api_key}
        res = requests.post(api_url+"/registrations/get_parameter", json=get_data)
        res = res.json()
        # set parameter
        perform_type = res['perform_type']
        transform_type =  res['transform_type']
        histology_file = res['image']['file']
        histology_id = res['image']['id']
        msi_id = res['msi']['id']
        msi_file= res['msi']['imzml_file']
        bin_size = res['msi']['bin_size']
        userId = res['userId']
        datasetId = res['datasetId']
        dr_method = res['DR_method']
        n_dim = int(res['n_dim'])
        hist_resolution = float(res['image']['resolution'])
        msi_resolution = float(res['msi']['pixel_size'])
        if (res['roi']):
            cnt_hist = res['roi']['points']
            mask_id = res['roi']['id']
        else:
            cnt_hist = None
            mask_id = None
        #set output file name
        process_file = os.path.join(dir_msi,str(datasetId),os.path.basename(msi_file).split('.')[0]+'.npz')
        transform_matrix_file = os.path.join(dir_hist,str(datasetId),f'transform_matrix_{RegID}.txt')
        result_file = os.path.join(dir_hist,str(datasetId),f'result_img_{RegID}.png')
        # read histology image and mask
        hist_ori = cv2.imread(os.path.join(dir_hist, str(datasetId), histology_file))
        if cnt_hist:
            from Reg_functions import draw_mask
            cnt_hist = np.round(np.array(cnt_hist)*[hist_ori.shape[1],hist_ori.shape[0]]).astype(int)
            hist_mask = draw_mask([cnt_hist],hist_ori.shape[:2], [0])
            hist_proc = hist_ori*np.expand_dims(hist_mask,axis=2)
        else:
            from Reg_functions import he_preprocessing
            hist_proc, hist_mask = he_preprocessing(hist_ori)
            cnt_hist, _ = cv2.findContours(hist_mask,cv2.RETR_EXTERNAL,cv2.CHAIN_APPROX_SIMPLE)
            cnt_hist = sort_cnt_by_area(cnt_hist)[0]
            # send new roi
            res_mask = requests.post(api_url+"/roi/new", json={
                "histologyImageId": histology_id,
                "roi_type":"Mask", 
                "points":(cnt_hist.astype(np.float32)/np.array([hist_ori.shape[1],hist_ori.shape[0]])).tolist() , 
                "userId":userId,
                "datasetId":datasetId})
            res_mask = res_mask.json()
            mask_id = res_mask['id']
        #generate histology represent image
        hist_proc = cv2.cvtColor(hist_proc,cv2.COLOR_BGR2GRAY)

        # read msi data
        msi_data,msi_size,_,mzs=ImzmlFileReader(os.path.join(dir_msi,str(datasetId),msi_file),bin_size=bin_size)
        # save MSI data in sparse matrix
        save_npz(process_file,msi_data)
        # TIC normaliztion
        msi_data= tic_normalization(msi_data)

        #Generate MSI mask
        msi_mask = generate_msi_mask(msi_data,cnt_hist,msi_size).astype(np.uint8)
        #clean border pixel
        msi_mask[0,:]=0;msi_mask[-1,:]=0;msi_mask[:,0]=0;msi_mask[:,-1]=0
        # detect contour and draw largest contour
        cnt_msi,_ = cv2.findContours(msi_mask,cv2.RETR_EXTERNAL,cv2.CHAIN_APPROX_SIMPLE)
        cnt_msi = sort_cnt_by_area(cnt_msi)[0]
        cv2.drawContours(msi_mask,[cnt_msi],0,1,-1)
        msi_list = []
        msi_list.append(msi_mask)

        #contour based data processing stop here
        if perform_type != 'contour':
            #data processing and dimensional reduction
            msi_dr = processing_intensity_reg(msi_data, msi_mask, mzs, msi_size, bin_size, dr_method, n_dim)
            
            # add msi_dr to msi_list
            # add msi represent image to msi_list
            # MSI list include msi_mask、msi_dr、msi_repr
            if n_dim == 1:
                msi_list.append(cv2.applyColorMap(msi_dr,cv2.COLORMAP_VIRIDIS))
                msi_list.append(msi_dr*msi_mask)
            else:
                msi_list.append(msi_dr)
                msi_list.append(cv2.cvtColor(msi_dr,cv2.COLOR_BGR2GRAY)*msi_mask)

        #detect the relation between MSI and H&E to solve the big angle rotation(90,180,270) and the flip situation
        if hist_resolution>0 and msi_resolution > 0:
            scale_ratio = msi_resolution/hist_resolution
            print('use resolution')
        else:
            scale_ratio = cv2.minEnclosingCircle(cnt_hist)[-1]/cv2.minEnclosingCircle(cnt_msi)[-1]
        if perform_type != 'contour':
            rotate_stat=getorient(hist_proc,msi_list[2],scale_ratio)
        else:
            rotate_stat=getorient(hist_proc,msi_list[0],scale_ratio)
        #Calculate initial registration matrix
        M_scale = np.array([[scale_ratio,0,0],[0,scale_ratio,0],[0,0,1.0]],dtype=np.float32)
        M_init = get_inital_transform_matrix(rotate_stat,msi_size)
        #simple registration (scale, big angle rotation, and flip)
        #rotation
        for i in range(len(msi_list)):
            if rotate_stat//2==1 or rotate_stat//2==3:
                msi_list[i]=cv2.warpAffine(msi_list[i],M=M_init[:2],dsize=(int(round(msi_size[0]*scale_ratio)),int(round(msi_size[1]*scale_ratio))),flags=cv2.INTER_NEAREST)
            else:
                msi_list[i]=cv2.warpAffine(msi_list[i],M=M_init[:2],dsize=(int(round(msi_size[1]*scale_ratio)),int(round(msi_size[0]*scale_ratio))),flags=cv2.INTER_NEAREST)

        # scale
        for i in range(len(msi_list)):
            msi_list[i] = cv2.warpAffine(msi_list[i],M=M_scale[:2],dsize=(msi_list[i].shape[1],msi_list[i].shape[0]),flags=cv2.INTER_NEAREST)

        #Automatic registration through intensity-based registration using Elastix
        parameter_object = elastix_parameter_object()
        if perform_type == 'contour':
            _, result_transform_parameters = elastix_registration_method(
                hist_proc.astype(np.float32), msi_list[0].astype(np.float32),
                parameter_object=parameter_object,number_of_threads=4,log_to_console=False)
                #log_to_file=True,log_file_name='log.txt',output_directory='.')
        else:
            _, result_transform_parameters = elastix_registration_method(
                hist_proc.astype(np.float32), msi_list[2].astype(np.float32),
                parameter_object=parameter_object,number_of_threads=4,log_to_console=False,)
                #log_to_file=True,log_file_name='log.txt',output_directory='.')

        #Convert elastix transform parameter to transform matrix
        M_elastix = get_elastix_transform_matrix(result_transform_parameters)

        #save transform matrix parameter
        np.savetxt(transform_matrix_file,np.vstack([M_init, M_scale, M_elastix]))

        #transform MSI_list and generate result image
        if perform_type != 'contour':
            msi_transform = msi_list[1]
        else:
            msi_transform = msi_list[0]*255
            msi_transform = cv2.cvtColor(msi_transform,cv2.COLOR_GRAY2BGR)
        #already perform reflection and big angle rotation in above 
        msi_transform = cv2.warpAffine(msi_transform,M=M_elastix[:2],dsize=(hist_ori.shape[1],hist_ori.shape[0]),flags=cv2.INTER_NEAREST)
        img_result = cv2.addWeighted(hist_ori,0.45,msi_transform,0.55,0)
        cv2.imwrite(result_file,img_result)

        # send result back to DB and server
        return_data = {
            "id":RegID,
            "key":api_key,
            "status":"SUCCESS",
            "transform_matrix_file":os.path.basename(transform_matrix_file),
            "result_file":os.path.basename(result_file),
            "min_mz":mzs[0],
            "max_mz":mzs[-1],
            "msi_h":msi_size[0],
            "msi_w": msi_size[1],
            "processed_data_file": os.path.basename(process_file),
            "mask_id": mask_id
            }
        requests.post(api_url+"/registrations/set_parameter", json=return_data)

    except Exception as e:
        import traceback
        error_class = e.__class__.__name__
        detail = e.args[0]
        cl, exc, tb = sys.exc_info()
        lastCallStack = traceback.extract_tb(tb)[-1]
        fileName, lineNum, funcName = lastCallStack[:3]
        errMsg = "File \"{}\", line {}, in {}: [{}] {}".format(fileName, lineNum, funcName, error_class, detail)
        return_data = {
            "taskId":RegID,
            "key":api_key,
            "task": 'R',
            "status":"ERROR",
            "message":errMsg
            }
        requests.post(api_url+"/jobs/error", json=return_data)
        pass
