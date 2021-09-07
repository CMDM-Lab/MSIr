from Reg_functions import ImzmlFileReader
import numpy as np
from scipy.sparse import csc_matrix,csr_matrix,vstack
import pandas as pd
from dotenv import load_dotenv
import cv2, os,time, requests, argparse, json, sys

def process_command():
    parser = argparse.ArgumentParser()
    parser.add_argument('-ID','--ExtractionID',type=int,required=True,help='The Extraction ID : int')
    return parser.parse_args()

if __name__ == '__main__':
    try:
        ##### parameter setting #####
        args = process_command()
        extract_id=args.ExtractionID

        #get secrete key
        load_dotenv(dotenv_path=".env")
        secret_key=os.getenv("key")
        api_url=os.getenv('API_URL')
        dir_hist=os.getenv('DIR_HIST')

        #Get registration parameters
        get_data={"id":extract_id,"key":secret_key}
        res = requests.post(api_url+"/extraction/get_parameter", json=get_data)
        res = res.json()

        # set parameter
        image_id =  res['data']['image_id']
        image_file = res['data']['image_file']
        points= res['data']['points']
        roi_type= res['data']['roi_type']

        #set output file name
        output_file = os.path.join(dir_hist,f'{roi_type}_{roi_id}.png')

        hist_ori = cv2.imread(image_file)
        points = np.round(np.array(points)*[hist_ori.shape[1],hist_ori.shape[0]]).astype(int)
        mask = np.zeros(hist_ori.shape,np.uint8)
        cv2.drawContours(mask,[points],0,(255,255,255),-1)
        blend_img = cv2.addWeighted(hist_ori,0.65,mask,0.35,0)
        if roi_type == 'ROI':
            thickness = int(max([np.round(np.log10(hist_ori.shape[0]*hist_ori[1])-2),1]))
            cv2.drawContours(blend_img,[points],0,(0,255,0),thickness)
        cv2.imwrite(output_file, blend_img)

        return_data = {
            "id":roi_id,
            "key":secret_key,
            "status":"SUCCESS",
            "result_file": output_file
            }
        r_post = requests.post(api_url+"/roi/set_parameter", json=return_data)
            
    except:
        pass