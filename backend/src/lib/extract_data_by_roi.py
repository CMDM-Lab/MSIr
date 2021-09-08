from operator import index
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
        normalization =  res['data']['normalization']
        imzml_file = res['data']['msi']['imzml']
        points = res['data']['roi']['points']
        bin_size = res['data']['msi']['bin_size']

        #set output file name
        output_file = os.path.join(dir_hist,f'extraction_{extract_id}.csv')

        
        pd.DataFrame.sparse.from_spmatrix(data='', index=[], columns=[])

        return_data = {
            "id":extract_id,
            "key":secret_key,
            "status":"SUCCESS",
            "result_file": output_file
            }
        r_post = requests.post(api_url+"/roi/set_parameter", json=return_data)
            
    except:
        pass