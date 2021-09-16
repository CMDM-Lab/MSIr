from Reg_functions import ImzmlFileReader
import numpy as np
#from scipy.sparse import csc_matrix,csr_matrix
import pandas as pd
from dotenv import load_dotenv
import cv2, os, requests, argparse, json, sys

def process_command():
    parser = argparse.ArgumentParser()
    parser.add_argument('-ID','--ExtractionID',type=int,required=True,help='The Extraction ID : int')
    return parser.parse_args()

if __name__ == '__main__':
    try:
        ##### parameter setting #####
        args = process_command()
        ExtractID=args.ExtractionID

        #get secrete key
        load_dotenv(dotenv_path=".env")
        api_key=os.getenv("API_KEY")
        api_url=os.getenv('API_URL')
        dir_hist=os.getenv('DIR_HIST')

        #Get registration parameters
        get_data={"id":ExtractID,"key":api_key}
        res = requests.post(api_url+"/extraction/get_parameter", json=get_data)
        res = res.json()

        # set parameter
        normalization =  res['data']['normalization']
        imzml_file = res['data']['msi']['imzml']
        points = res['data']['roi']['points']
        blend_img_file = res['data']['roi']['blend_img_file']
        bin_size = res['data']['msi']['bin_size']
        datasetId = res['data']['roi']['datasetId']
        transform_file = res['data']['registration']['transform_matrix_file']

        #set output file name
        output_file = os.path.join(dir_hist,datasetId,f'extraction_{ExtractID}.csv')

        # read msi data
        msi_data,msi_size,msi_index,mzs=ImzmlFileReader(imzml_file,bin_size=bin_size)
        msi_index = np.array(msi_index)
        #TIC Normalization
        if normalization == 'tic':
            msi_data =msi_data
        # read blend_img_file
        img_blend = cv2.imread(os.path.join(dir_hist,datasetId,blend_img_file),cv2.IMREAD_GRAYSCALE)
        points = np.array(points)*np.array([img_blend.shape[1],img_blend.shape[0]])
        roi = np.zeros(img_blend.shape)
        cv2.drawContours(roi,[points],0,255,-1)
        #read matrix file
        M = np.loadtxt(os.path.join(dir_hist,datasetId,transform_file))
        #transform msi_index
        msi_index = cv2.warpAffine(msi_index,M[:2],roi.shape,flags=cv2.INTER_NEAREST)
        msi_index = cv2.warpAffine(msi_index,M[3:5],roi.shape,flags=cv2.INTER_NEAREST)
        msi_index = cv2.warpAffine(msi_index,M[6:8],roi.shape,flags=cv2.INTER_NEAREST)
        #calculate the idx in roi
        total_count=np.unique(msi_index,return_counts=True)
        roi_count = np.unique(msi_index[np.where(roi==255)],return_counts=True)
        # calculate ratio (the number of index in roi / total number of index)
        roi_ratio = roi_count[1]/total_count[1][np.intersect1d(total_count[0],roi_count[0],return_indices=True)[1]]
        #If index with ratio >=0.5 (accept)
        roi_idx=roi_count[0][np.where(roi_ratio >= 0.5)[0]]
        #Extract data of roi index
        extract_data = msi_data[roi_idx-1]
        #into DataFram
        result = pd.DataFrame.sparse.from_spmatrix(data=extract_data, index=roi_idx, columns=mzs)
        #save to csv
        result.to_csv(output_file)

        return_data = {
            "id":ExtractID,
            "key":api_key,
            "status":"SUCCESS",
            "result_file": output_file
            }
        r_post = requests.post(api_url+"/roi/set_parameter", json=return_data)
            
    except Exception as e:
        import traceback
        error_class = e.__class__.__name__
        detail = e.args[0]
        cl, exc, tb = sys.exc_info()
        lastCallStack = traceback.extract_tb(tb)[-1]
        fileName, lineNum, funcName = lastCallStack[:3]
        errMsg = "File \"{}\", line {}, in {}: [{}] {}".format(fileName, lineNum, funcName, error_class, detail)
        return_data = {
            "taskId":ExtractID,
            "key":api_key,
            "task": 'extraction',
            "status":"ERROR",
            "message":errMsg
            }
        r_post = requests.post(api_url+"/jobs/error", json=return_data)
        pass