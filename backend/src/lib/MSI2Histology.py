import numpy as np
from scipy.sparse import csc_matrix,csr_matrix,vstack, save_npz
from scipy.sparse.linalg import norm
import cv2,os,time, requests, argparse, json, sys, umap, itk
from dotenv import load_dotenv
from Reg_functions import *
from ms_peak_picker import pick_peaks

def get_elastix_transform_matrix (transform_parameters):
    '''
    Convert elastix transform parameter to transform matrix

    transform_parameter : elastixParameterObject
    '''
    T_final = np.array([[1,0,0],[0,1,0],[0,0,1]]).astype(np.float32)

    for idx in range(transform_parameters.GetNumberOfParameterMaps()):
        parameter_map = transform_parameters.GetParameterMap(idx)
        center = np.asarray(parameter_map['CenterOfRotationPoint']).astype(np.float32)
        T = np.asarray(parameter_map['TransformParameters']).astype(np.float32)
        center = np.asarray([[1,0,center[0]], [0,1,center[1]],[0,0,1]]).astype(np.float32)
        center_inv = np.linalg.inv(center)
        if parameter_map['Transform'][0] == "AffineTransform":
            M = np.array([[T[0],T[1],T[4]],[T[2],T[3],T[5]],[0,0,1]],dtype=np.float32)

        elif parameter_map['Transform'][0] == "SimilarityTransform":
            M = np.array(
                [
                    [T[0]*np.cos(T[1],dtype=np.float32),-np.sin(T[1],dtype=np.float32)*T[0],T[2]], 
                    [T[0]*np.sin(T[1],dtype=np.float32),T[0]*np.cos(T[1],dtype=np.float32),T[3]],
                    [0,0,1]
                ]
                ,dtype=np.float32)

        elif parameter_map['Transform'][0] == "TranslationTransform":
            M = np.array([[1.0,0,T[0]], [0,1.0,T[1]],[0,0,1]],dtype=np.float32)

        elif parameter_map['Transform'][0] == "EulerTransform":
            M = np.array(
                [
                    [np.cos(T[0],dtype=np.float32),-np.sin(T[0],dtype=np.float32),T[1]], 
                    [np.sin(T[0],dtype=np.float32),np.cos(T[0],dtype=np.float32),T[2]],
                    [0,0,1]
                ]
                ,dtype=np.float32)

        else:
            continue

        T_final = T_final @ center @ M @ center_inv
    
    T_final_inv = np.linalg.inv(T_final)

    return T_final_inv

def get_inital_transform_matrix (state, img_size):
    M_init=np.array([[1.0,0,0],[0,1.0,0],[0,0,1.0]],dtype=np.float32)
    if state//2==1:
        M_init[:2] = cv2.getRotationMatrix2D((0,0),90,1)
        M_init = M_init + np.array([[0,0,img_size[0]],[0,0,0],[0,0,0]])
    elif state//2==2:
        M_init[:2] = cv2.getRotationMatrix2D((0,0),180,1)
        M_init = M_init + np.array([[0,0,img_size[1]],[0,0,img_size[0]],[0,0,0]])    
    elif state//2==3:
        M_init[:2] = cv2.getRotationMatrix2D((0,0),-90,1)
        M_init = M_init + np.array([[0,0,0],[0,0,img_size[1]],[0,0,0]])
    if state%2==1:
        M_init = np.array([[-1,0,0],[0,1,0],[img_size[1],0,1]],dtype=np.float64) @ M_init

    return M_init

def process_command():
    parser = argparse.ArgumentParser()
    parser.add_argument('-ID','--RegistrationID',type=int,required=True,help='The Registration ID : int')
    return parser.parse_args()

if __name__ == '__main__':
    try:
        ##### parameter setting #####
        args = process_command()
        RegID=args.RegistrationID

        #get secrete key
        load_dotenv(dotenv_path=".env")
        secret_key=os.getenv("key")
        api_url=os.getenv('API_URL')
        dir_hist=os.getenv('DIR_HIST')
        dir_msi = os.getenv('DIR_MSI')

        #Get registration parameters
        get_data={"id":RegID,"key":secret_key}
        res = requests.post(api_url+"/registrations/get_parameter", json=get_data)
        res = res.json()

        # set parameter
        perform_type = res['data']['perform_type']
        transform_type =  res['data']['transform_type']
        histology_file = res['data']['image']['file']
        msi_file= res['data']['msi']['imzml_file']
        bin_size = res['data']['msi']['bin_size']
        cnt_he = res['data']['roi']

        #set output file name
        process_file = os.path.join(dir_msi,os.path.basename(msi_file)+'.npz')
        transform_matrix_file = os.path.join(dir_hist,f'transform_matrix_{RegID}.txt')
        result_file = os.path.join(dir_hist,f'result_img_{RegID}.png')

        # read histology image and mask
        hist_ori = cv2.imread(histology_file)
        if not cnt_he:
            cnt_he = np.round(np.array(cnt_he)*[hist_ori.shape[1],hist_ori.shape[0]]).astype(int)
            hist_mask = np.zeros(hist_ori.shape[:2],np.uint8)
            hist_mask = cv2.drawContours(hist_mask,[cnt_he],0,1,-1)
            hist_proc = hist_ori*hist_mask
        else:
            hist_proc, hist_mask = he_preprocessing(hist_ori)
            cnt_he,_=cv2.findContours(hist_mask,cv2.RETR_EXTERNAL,cv2.CHAIN_APPROX_SIMPLE)
            cnt_he = sort_cnt_by_area(cnt_he)[0]
            # send new roi
            requests.post(api_url+"/roi/new", json={
                "roi_type":"Mask", 
                "points":cnt_he.astype(np.float32)/np.array([hist_ori.shape[1],hist_ori.shape[0]]), 
                "userId":''})
        #generate histology represent image
        hist_proc = cv2.cvtColor(hist_proc,cv2.COLOR_BGR2GRAY)

        # read msi data
        msi_data,msi_size,_,mzs=ImzmlFileReader(msi_file,bin_size=bin_size)
        # save MSI data in sparse matrix
        save_npz(process_file,msi_data)

        # TIC normaliztion
        tic=np.array(msi_data.sum(axis=1))
        tic=np.nan_to_num(np.mean(tic)/tic,posinf=0)
        msi_data=msi_data.multiply(tic.reshape((-1,1))).tocsc()

        #MSI list include msi_mask、msi_dr、msi_repr
        msi_list = []
        #Generate MSI mask
        msi_mask = 
        msi_list.append(msi_mask)
        cnt_msi,_ = cv2.findContours(msi_mask,cv2.RETR_EXTERNAL,cv2.CHAIN_APPROX_SIMPLE)
        cnt_msi = sort_cnt_by_area(cnt_msi)[0]

        #contour based data processing stop here
        if perform_type != 'contour':
            #MSI get tissue region pixel and background pixel
            idx_tissue=np.where(msi_mask.reshape((-1,1))==1)[0]
            idx_bg=np.where(msi_mask.reshape((-1,1))==0)[0]
            #MSI stack ROI data and the mean of background data
            data_proc=vstack([msi_data[idx_tissue],np.array(msi_data[idx_bg].mean(axis=0)[0])]).tocsc()

            #Peak picking based on based on the tissue region signal
            intensity_mzs=np.array(data_proc[:-1].mean(axis=0))[0]
            peak_idx=pick_peaks(mzs, intensity_mzs, fit_type="quadratic",signal_to_noise_threshold=3) #"quadratic", "gaussian", "lorentzian", or "apex"
            peak_idx=np.array([peak_idx[i].index for i in range(len(peak_idx))])

            #Data binning based on peak picking result
            data_proc=binning(data_proc,mzs,peak_idx,0.02)

            #UMAP 
            DR_result=umap.UMAP(n_components=3,min_dist=0.001,metric='cosine',random_state=128,verbose=0).fit_transform(data_proc)

            #DR result into rgb image
            DR_result=data2bgr(DR_result)
            msi_dr=np.full((msi_size[0]*msi_size[1],3),DR_result[-1])
            msi_dr[idx_tissue]=DR_result[:-1]
            msi_dr=msi_dr.reshape((msi_size[0],msi_size[1],-1))
            #add msi_dr to msi_list
            msi_list.append(msi_dr)

            # add msi represent image to msi_list
            msi_list.append(cv2.cvtColor(msi_dr,cv2.COLOR_BGR2GRAY)*msi_mask)
        
        #detect the relation between MSI and H&E to solve the big angle rotation(90,180,270) and the flip situation
        scale_ratio=round(cv2.minEnclosingCircle(cnt_he)[-1]/cv2.minEnclosingCircle(cnt_he)[-1])
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
        parameter_object = itk.ParameterObject.New()
        parameter_map_affine = parameter_object.GetDefaultParameterMap('affine')
        parameter_map_affine['MaximumNumberOfIterations']=['500']
        parameter_map_affine['Transform']=['SimilarityTransform']
        parameter_map_affine['AutomaticTransformInitialization']=['true']
        parameter_map_affine['AutomaticTransformInitializationMethod']=['CenterOfGravity']
        parameter_object.AddParameterMap(parameter_map_affine)
        if perform_type == 'contour':
            _, result_transform_parameters = itk.elastix_registration_method(
                hist_proc.astype(np.float32), msi_list[0].astype(np.float32),
                parameter_object=parameter_object,number_of_threads=4,log_to_console=False)
        else:
            _, result_transform_parameters = itk.elastix_registration_method(
                hist_proc.astype(np.float32), msi_list[2].astype(np.float32),
                parameter_object=parameter_object,number_of_threads=4,log_to_console=False)

        #Convert elastix transform parameter to transform matrix
        M_elastix = get_elastix_transform_matrix(result_transform_parameters)
        
        #Calculate initial registration matrix
        M_scale = np.array([[scale_ratio,0,0],[0,scale_ratio,0],[0,0,1.0]],dtype=np.float32)
        M_init = get_inital_transform_matrix(rotate_stat,msi_size)
        M_init = M_scale @ M_init

        #save transform matrix parameter
        np.savetxt(transform_matrix_file,np.vstack([M_init,M_elastix]))

        #transform MSI_list and generate result image
        if perform_type != 'contour':
            msi_transform = msi_list[1]
        else:
            msi_transform = msi_list[0]
        msi_transform = cv2.warpAffine(msi_transform,M=M_init[:2],dsize=(hist_ori.shape[1],hist_ori.shape[0]),flags=cv2.INTER_NEAREST)
        msi_transform = cv2.warpAffine(msi_transform,M=M_elastix[:2],dsize=(hist_ori.shape[1],hist_ori.shape[0]),flags=cv2.INTER_NEAREST,borderMode=cv2.BORDER_REPLICATE)
        img_result = cv2.addWeighted(hist_ori,0.65,msi_transform,0.35,0)
        cv2.imwrite(result_file,img_result)

        # send result back to DB and server
        return_data = {
            "id":RegID,
            "key":secret_key,
            "status":"SUCCESS",
            "transform_matrix_file":transform_matrix_file,
            "result_file":result_file,
            "min_mz":mzs[0],
            "max_mz":mzs[-1],
            "msi_h":msi_size[0],
            "msi_w": msi_size[1],
            "process_file": process_file
            }
        r_post = requests.post(api_url+"/registrations/set_parameter", json=return_data)
        
    except:
        pass
