import numpy as np
from scipy.sparse import vstack, save_npz
import cv2,os, requests, argparse, json, sys, umap 
from itk import ParameterObject, elastix_registration_method
from dotenv import load_dotenv
from Reg_functions import ImzmlFileReader, data2bgr, sort_cnt_by_area, \
    binning, generate_msi_mask, tic_normalization, getorient, he_preprocessing, get_elastix_transform_matrix, get_inital_transform_matrix
from ms_peak_picker import pick_peaks

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
        cnt_hist = res['roi']
        userId = res['userId']
        datasetId = res['datasetId']

        #set output file name
        process_file = os.path.join(dir_msi,str(RegID),os.path.basename(msi_file).split('.')[0]+'.npz')
        transform_matrix_file = os.path.join(dir_hist,str(RegID),f'transform_matrix_{RegID}.txt')
        result_file = os.path.join(dir_hist,str(RegID),f'result_img_{RegID}.png')

        # read histology image and mask
        hist_ori = cv2.imread(os.path.join(dir_hist, str(RegID), histology_file))
        if cnt_hist:
            cnt_hist = np.round(np.array(cnt_hist)*[hist_ori.shape[1],hist_ori.shape[0]]).astype(int)
            hist_mask = np.zeros(hist_ori.shape[:2],np.uint8)
            hist_mask = cv2.drawContours(hist_mask,[cnt_hist],0,1,-1)
            hist_proc = hist_ori*hist_mask
        else:
            hist_proc, hist_mask = he_preprocessing(hist_ori)
            cnt_hist, _ = cv2.findContours(hist_mask,cv2.RETR_EXTERNAL,cv2.CHAIN_APPROX_SIMPLE)
            cnt_hist = sort_cnt_by_area(cnt_hist)[0]
            # send new roi
            requests.post(api_url+"/roi/new", json={
                "histologyImageId": histology_id,
                "roi_type":"Mask", 
                "points":(cnt_hist.astype(np.float32)/np.array([hist_ori.shape[1],hist_ori.shape[0]])).tolist() , 
                "userId":userId,
                "datasetId":datasetId})
        #generate histology represent image
        hist_proc = cv2.cvtColor(hist_proc,cv2.COLOR_BGR2GRAY)

        # read msi data
        msi_data,msi_size,_,mzs=ImzmlFileReader(os.path.join(dir_msi,str(RegID),msi_file),bin_size=bin_size)
        # save MSI data in sparse matrix
        save_npz(process_file,msi_data)

        # TIC normaliztion
        msi_data= tic_normalization(msi_data)

        #MSI list include msi_mask、msi_dr、msi_repr
        msi_list = []
        #Generate MSI mask
        msi_mask = generate_msi_mask(msi_data,cnt_hist,msi_size).astype(np.uint8)
        #clean border pixel
        msi_mask[0,:]=0;msi_mask[-1,:]=0;msi_mask[:,0]=0;msi_mask[:,-1]=0
        cnt_msi,_ = cv2.findContours(msi_mask,cv2.RETR_EXTERNAL,cv2.CHAIN_APPROX_SIMPLE)
        cnt_msi = sort_cnt_by_area(cnt_msi)[0]
        cv2.drawContours(msi_mask,[cnt_msi],0,1,-1)
        msi_list.append(msi_mask)

        #contour based data processing stop here
        if perform_type != 'contour':
            #MSI get tissue region pixel and background pixel
            idx_tissue=np.where(msi_mask.reshape((-1,1))==1)[0]
            idx_bg=np.where(msi_mask.reshape((-1,1))==0)[0]
            #MSI stack ROI data and the mean of background data
            data_proc=vstack([msi_data[idx_tissue],np.array(msi_data[idx_bg].mean(axis=0)[0])]).tocsc()

            #Peak picking based on based on the tissue region signal
            intensity_mzs=np.array(data_proc[:-1].mean(axis=0))[0]
            peak_idx=pick_peaks(mzs, intensity_mzs, fit_type="quadratic",signal_to_noise_threshold=5) #"quadratic", "gaussian", "lorentzian", or "apex"
            bin_tol = np.median([peak_idx[i].full_width_at_half_max for i in range(len(peak_idx))])*2
            peak_idx=np.array([peak_idx[i].index for i in range(len(peak_idx))])

            #Data binning based on peak picking result
            if bin_size == 0.01:
                data_proc=binning(data_proc,mzs,peak_idx,bin_tol)

            #UMAP 
            try:
                DR_result=umap.UMAP(n_components=3,min_dist=0.001,metric='cosine',random_state=128,verbose=0).fit_transform(data_proc)
            except:
                DR_result=umap.UMAP(n_components=3,min_dist=0.001,metric='cosine',random_state=11,verbose=0).fit_transform(data_proc)

            #DR result into rgb image
            DR_result=data2bgr(DR_result)
            msi_dr=np.full((msi_size[0]*msi_size[1],3),DR_result[-1])
            msi_dr[idx_tissue]=DR_result[:-1]
            msi_dr=np.uint8(msi_dr.reshape((msi_size[0],msi_size[1],-1)))
            #add msi_dr to msi_list
            msi_list.append(msi_dr)

            # add msi represent image to msi_list
            msi_list.append(cv2.cvtColor(msi_dr,cv2.COLOR_BGR2GRAY)*msi_mask)
        
        #detect the relation between MSI and H&E to solve the big angle rotation(90,180,270) and the flip situation
        scale_ratio=round(cv2.minEnclosingCircle(cnt_hist)[-1]/cv2.minEnclosingCircle(cnt_msi)[-1])
        rotate_stat=getorient(hist_proc,msi_list[0],scale_ratio)
        #simple registration (scale, big angle rotation, and flip)
        #rotation
        if rotate_stat//2==1:
            for i in range(len(msi_list)):
                msi_list[i]=cv2.rotate(msi_list[i], cv2.ROTATE_90_CLOCKWISE)
        elif rotate_stat//2==2:
            for i in range(len(msi_list)):
                msi_list[i]=cv2.rotate(msi_list[i], cv2.ROTATE_180)
        elif rotate_stat//2==3:
            for i in range(len(msi_list)):
                msi_list[i]=cv2.rotate(msi_list[i], cv2.ROTATE_90_COUNTERCLOCKWISE)
        #flip
        if rotate_stat%2==1:
            for i in range(len(msi_list)):
                msi_list[i]=cv2.flip(msi_list[i],0)
        # scale
        for i in range(len(msi_list)):
            msi_list[i]=cv2.resize(msi_list[i],None, fx=scale_ratio, fy=scale_ratio,interpolation=cv2.INTER_NEAREST)

        #Automatic registration through intensity-based registration using Elastix
        parameter_object = ParameterObject.New()
        parameter_map_affine = parameter_object.GetDefaultParameterMap('affine')
        parameter_map_affine['MaximumNumberOfIterations']=['500']
        parameter_map_affine['Transform']=['SimilarityTransform']
        parameter_map_affine['FinalBSplineInterpolationOrder']=['0']
        parameter_map_affine['AutomaticTransformInitialization']=['true']
        parameter_map_affine['AutomaticTransformInitializationMethod']=['CenterOfGravity']
        parameter_map_affine['MaximumStepLength'] = ['50','10','1']
        parameter_map_affine['RequiredRatioOfValidSamples'] =['0.15']
        parameter_object.AddParameterMap(parameter_map_affine)
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
        
        #Calculate initial registration matrix
        M_scale = np.array([[scale_ratio,0,0],[0,scale_ratio,0],[0,0,1.0]],dtype=np.float32)
        M_init = get_inital_transform_matrix(rotate_stat,msi_size)
        #M_init = M_scale @ M_init

        #save transform matrix parameter
        np.savetxt(transform_matrix_file,np.vstack([M_init, M_scale, M_elastix]))

        #transform MSI_list and generate result image
        if perform_type != 'contour':
            msi_transform = msi_list[1]
        else:
            msi_transform = msi_list[0]*255
        #already perform reflection and big angle rotation in above 
        #msi_transform = cv2.warpAffine(msi_transform,M=M_init[:2],dsize=(hist_ori.shape[1],hist_ori.shape[0]),flags=cv2.INTER_NEAREST)
        #msi_transform = cv2.warpAffine(msi_transform,M=M_scale[:2],dsize=(hist_ori.shape[1],hist_ori.shape[0]),flags=cv2.INTER_NEAREST)
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
            "processed_data_file": os.path.basename(process_file)
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
            "task": 'registration',
            "status":"ERROR",
            "message":errMsg
            }
        requests.post(api_url+"/jobs/error", json=return_data)
        pass
