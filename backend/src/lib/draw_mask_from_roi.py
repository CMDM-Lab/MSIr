import numpy as np
import cv2,os, requests, argparse, json, sys
from dotenv import load_dotenv

def process_command():
    parser = argparse.ArgumentParser()
    parser.add_argument('-ID','--RoiID',type=int,required=True,help='The ROI ID : int')
    return parser.parse_args()

if __name__ == '__main__':
    try:
        ##### parameter setting #####
        args = process_command()
        RoiID=args.RoiID

        #get secrete key
        load_dotenv(dotenv_path=".env")
        api_key=os.getenv("API_KEY")
        api_url=os.getenv('API_URL')
        dir_hist=os.getenv('DIR_HIST')

        #Get registration parameters
        get_data={"id":RoiID,"key":api_key}
        res = requests.post(api_url+"/roi/get_parameter", json=get_data)
        res = res.json()

        # set parameter
        image_id =  res['data']['image_id']
        image_file = res['data']['image_file']
        points= res['data']['points']
        roi_type= res['data']['roi_type']

        #set output file name
        output_file = os.path.join(dir_hist,f'{roi_type}_{RoiID}.png')

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
            "id":RoiID,
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
            "id":RoiID,
            "key":api_key,
            "status":"ERROR",
            "message":errMsg,
            }
        r_post = requests.post(api_url+"/roi/set_parameter", json=return_data)
        pass