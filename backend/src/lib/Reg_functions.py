from pyimzml.ImzMLParser import ImzMLParser
import numpy as np
from scipy.sparse import csc_matrix
import cv2

def ImzmlFileReader(file_path,bin_size=0.01,mz_max=None,mz_min=None): #20210802
    precision=int(np.round(-np.log10(bin_size)))
    imzmldata=ImzMLParser(file_path)
    size=imzmldata.imzmldict['max count of pixels y'],imzmldata.imzmldict['max count of pixels x']
    #use sparse matrix to ndarray (better in large data size)
    mz_list,intensity_list,scan_list=[],[],[]
    for idx, (_,_,_) in enumerate(imzmldata.coordinates):
        mzs, intensities = imzmldata.getspectrum(idx)
        intensities=np.round(intensities,0)
        sort_idx=np.argsort(mzs)
        mz_list.append(mzs[sort_idx])
        intensity_list.append(intensities[sort_idx])
        scan_list.append(idx+1)
    # if assign mz_min and mz_max, get from mz_list
    if not mz_max and not mz_min:
        mz_min,mz_max=np.quantile(np.concatenate(mz_list,axis=None),[0,1])
        mz_min,mz_max=np.round([mz_min,mz_max],precision)
    #get continuous mz_set
    mz_set=np.round([mz_min+bin_size*i for i in range(0,int((mz_max-mz_min)/(bin_size))+2)],precision)
    r_tmp,c_tmp,int_tmp=[],[],[]
    for i in range(len(mz_list)):
        tmp=np.round((mz_list[i]-mz_min)/(bin_size)).astype(np.int64)
        tmp_index=np.unique(tmp)
        tmp=np.bincount(np.searchsorted(tmp_index, tmp), intensity_list[i])
        for j in range(len(tmp_index)):
            r_tmp.append(i)
            c_tmp.append(tmp_index[j])
            int_tmp.append(tmp[j])
    data=csc_matrix((int_tmp,(r_tmp,c_tmp)),shape=(len(mz_list),len(mz_set)))
    return data,size,scan_list,mz_set

def data2bgr(data):#convert value to RBG(0~255)
    out=np.zeros(data.shape)
    for i in range(data.shape[1]):
        max0,min0=np.nanmax(data[:,i]),np.nanmin(data[:,i])
        out[:,i]=np.round((data[:,i]-min0)/(max0-min0)*255.0)
        out[:,i]=np.nan_to_num(out[:,i],posinf=0,neginf=0)
    return out

def sort_cnt_by_area(cnt): #sort contour by the area
  cntsSorted = sorted(cnt, key=lambda x: cv2.contourArea(x))
  return cntsSorted

def binning(data,mzs,target_peak_idx,bin_size=0.02):
    bin_size=bin_size/2
    bin_idx=int(np.floor(bin_size/(mzs[1]-mzs[0])))
    out_data=[]
    for idx in range(len(target_peak_idx)):
        bin_low,bin_high=target_peak_idx[idx]-bin_idx,target_peak_idx[idx]+bin_idx
        if (idx-1)>=0: #handle when idx=0 
            nn_peak_idx_low=target_peak_idx[idx-1]+bin_idx  
        else:
            nn_peak_idx_low= target_peak_idx[0]-bin_idx

        if (idx+1)<len(target_peak_idx): # handle last idx
            nn_peak_idx_high=target_peak_idx[idx+1]-bin_idx  
        else: 
            nn_peak_idx_high=target_peak_idx[-1]+bin_idx

        if bin_low>nn_peak_idx_low and bin_high<nn_peak_idx_high: #neighbor peak not overlap
            tmp=data[:,bin_low:bin_high+1].tocsr().sum(axis=1)
        elif bin_low>nn_peak_idx_low and bin_high>=nn_peak_idx_high: # overlap with the bigger idx neighbor peak
            tmp=data[:,bin_low:(bin_high+nn_peak_idx_high)//2+1].tocsr().sum(axis=1)
        elif bin_low<=nn_peak_idx_low and bin_high<nn_peak_idx_high: # overlap with the smaller idx neighbor peak
            tmp=data[:,(bin_low+nn_peak_idx_low)//2:bin_high+1].tocsr().sum(axis=1)
        else: #  overlap with the both of neighbor peaks
            tmp=data[:,(bin_low+nn_peak_idx_low)//2:(bin_high+nn_peak_idx_high)//2+1].sum(axis=1)
        out_data.append(np.array(tmp).reshape(len(tmp)))
    return np.array(out_data).T

'''Need rewrite'''
def img_kmeans_segmentation(img_kmean): #Segmentation the reult of Kmeans with cosine distance 
    label_rm=[]
    label_keep=[]
    label_unknown=[]
    n_cluster=len(np.unique(img_kmean))
    n_r,n_c=img_kmean.shape[:2]
    img_kmean[np.where(img_kmean==0)]=n_cluster
    sample_border=np.unique([*img_kmean[0,:],*img_kmean[:,-1],*img_kmean[-1,:],*img_kmean[:,1],*img_kmean[1,:],*img_kmean[:,-2],*img_kmean[-2,:],*img_kmean[:,1]],return_counts=True)
    img_kmean[np.where(img_kmean==sample_border[0][np.argmax(sample_border[1])])]=0
    n_border=np.sum(sample_border[1])
    for i in range(len(sample_border[0])):
        if sample_border[1][i]/n_border < 0.1:
            label_keep.append(sample_border[0][i])
        else:
            label_rm.append(sample_border[0][i])
    n_sample=int(round(n_r*n_c/4*0.2))
    sample_center=np.random.choice(img_kmean[int(n_r/4):int(n_r/4*3),int(n_c/4):int(n_c/4*3)].flatten(),n_sample,replace=False)
    sample_center=np.unique(sample_center,return_counts=True)
       
    for i in range(len(sample_center[0])):
        if sample_center[1][i]>n_sample/len(sample_center[0]):
            label_keep.append(sample_center[0][i])
        else:
            label_unknown.append(sample_center[0][i])
    for i in range(len(label_rm)):
        if label_rm[i] not in label_keep:
            img_kmean[np.where(img_kmean==label_rm[i])]=0
    _,img_kmean=cv2.threshold(np.uint8(img_kmean),0,255,cv2.THRESH_BINARY)
    contours, _ = cv2.findContours(np.uint8(img_kmean),cv2.RETR_EXTERNAL,cv2.CHAIN_APPROX_SIMPLE)
    img_kmean=np.zeros((n_r,n_c),np.uint8)
    for i in range(len(contours)):
        if cv2.contourArea(contours[i])>=n_r*n_c*0.05:
            cv2.drawContours(img_kmean,contours,i,255,-1)
    return img_kmean

def getorient(he_img,msi_img,size_scale,cost_function='MI'):#get the orient between MSI and Histology image to solve the big-angle and flip situation
    #cost_function = 'SSD' or 'MI'
    def getCentroid(img):
        contours, _ = cv2.findContours(img,cv2.RETR_EXTERNAL,cv2.CHAIN_APPROX_SIMPLE)
        contours=sort_cnt_by_area(contours)
        M = cv2.moments(contours[0])
        cx,cy = int(M['m10']/M['m00']),int(M['m01']/M['m00'])
        return cx,cy

    def calc_MI(x, y, bins=32):
        def mutual_information(hgram):
            # Mutual information for joint histogram
            # Convert bins counts to probability values
            pxy = hgram / float(np.sum(hgram))
            px = np.sum(pxy, axis=1) # marginal for x over y
            py = np.sum(pxy, axis=0) # marginal for y over x
            px_py = px[:, None] * py[None, :] # Broadcast to multiply marginals
            # Now we can do the calculation using the pxy, px_py 2D arrays
            nzs = pxy > 0 # Only non-zero pxy values contribute to the sum
            return np.sum(pxy[nzs] * np.log(pxy[nzs] / px_py[nzs]))
        hist_2d, _, _ = np.histogram2d(x.ravel(),y.ravel(),bins)
        mi = mutual_information(hist_2d)
        return mi

    img_he=cv2.resize(he_img,None,fx=1/size_scale,fy=1/size_scale,interpolation=cv2.INTER_NEAREST)
    cx_he,cy_he = getCentroid(img_he)
    img_msi_0=msi_img.copy()
    img_msi_90=cv2.rotate(img_msi_0,cv2.ROTATE_90_CLOCKWISE)
    #padding
    h_diff_0,w_diff_0=img_he.shape[0]-img_msi_0.shape[0],img_he.shape[1]-img_msi_0.shape[1]
    h_diff_90,w_diff_90=img_he.shape[0]-img_msi_90.shape[0],img_he.shape[1]-img_msi_90.shape[1]
    if h_diff_0>0 and w_diff_0>0:       
        img_msi_0=cv2.copyMakeBorder(img_msi_0,0,h_diff_0,0,w_diff_0,cv2.BORDER_CONSTANT,value=0)
    elif h_diff_0<=0 and w_diff_0>0:    
        img_msi_0=cv2.copyMakeBorder(img_msi_0,0,0,0,w_diff_0,cv2.BORDER_CONSTANT,value=0)
    elif h_diff_0>0 and w_diff_0<=0:    
        img_msi_0=cv2.copyMakeBorder(img_msi_0,0,h_diff_0,0,0,cv2.BORDER_CONSTANT,value=0)
    if h_diff_90>0 and w_diff_90>0:     
        img_msi_90=cv2.copyMakeBorder(img_msi_90,0,h_diff_90,0,w_diff_90,cv2.BORDER_CONSTANT,value=0)
    elif h_diff_90<=0 and w_diff_90>0:  
        img_msi_90=cv2.copyMakeBorder(img_msi_90,0,0,0,w_diff_90,cv2.BORDER_CONSTANT,value=0)
    elif h_diff_90>0 and w_diff_90<=0:  
        img_msi_90=cv2.copyMakeBorder(img_msi_90,0,h_diff_90,0,0,cv2.BORDER_CONSTANT,value=0)
    #generate 180-rotate and flip
    img_msi_180=cv2.rotate(img_msi_0, cv2.ROTATE_180)
    img_msi_180_f=cv2.flip(img_msi_180,0)
    img_msi_0_f=cv2.flip(img_msi_0,0)
    img_msi_270=cv2.rotate(img_msi_90, cv2.ROTATE_180)
    img_msi_270_f=cv2.flip(img_msi_270,0)
    img_msi_90_f=cv2.flip(img_msi_90,0)
    #get centroid
    img_list=[img_msi_0,img_msi_0_f,img_msi_90,img_msi_90_f,img_msi_180,img_msi_180_f,img_msi_270,img_msi_270_f]
    cx,cy=[],[]
    for img in img_list:
        cx_tmp,cy_tmp=getCentroid(img)
        cx.append(cx_tmp)
        cy.append(cy_tmp)
    #translation and cut and calculate loss
    status=[]
    for i in range(len(img_list)):
        img_list[i] = cv2.warpAffine(img_list[i], np.float32([[1, 0, round(cx_he-cx[i])], [0, 1, round(cy_he-cy[i])]]), (img_he.shape[1], img_he.shape[0]))
        if cost_function=='SSD':
            loss=np.sum(cv2.absdiff(img_he,img_list[i]))
        else:
            loss=1-calc_MI(img_he, img_list[i], 32)
        status.append(loss)
    status=np.argmin(status)
    return status

def color_metric_edge_detection(img): #detect the edge from RGB image through color metric 
    '''
    Abasi, Saeedeh, Mohammad A. Tehran, and Mark D. Fairchild. "Colour metrics for image edge detection." Color Research & Application 45.4 (2020): 632-643.
    '''
    def hyab(p):
        value=np.abs(p[:,:,0])+(np.power(p[:,:,1],2)+np.power(p[:,:,2],2))**0.5
        return value
    
    img_lab=cv2.cvtColor(img,cv2.COLOR_BGR2LAB)
    e17=cv2.filter2D(img_lab,cv2.CV_32F,np.array([[1,0,0],[0,0,0],[-1,0,0]]))
    e28=cv2.filter2D(img_lab,cv2.CV_32F,np.array([[0,1,0],[0,0,0],[0,-1,0]]))
    e39=cv2.filter2D(img_lab,cv2.CV_32F,np.array([[0,0,1],[0,0,0],[0,0,-1]]))
    e13=cv2.filter2D(img_lab,cv2.CV_32F,np.array([[1,0,-1],[0,0,0],[0,0,0]]))
    e46=cv2.filter2D(img_lab,cv2.CV_32F,np.array([[0,0,0],[1,0,-1],[0,0,0]]))
    e79=cv2.filter2D(img_lab,cv2.CV_32F,np.array([[0,0,0],[0,0,0],[1,0,-1]]))
    gx=hyab(e17)+2*hyab(e28)+hyab(e39)
    gy=hyab(e13)+2*hyab(e46)+hyab(e79)
    g=np.abs(gx)+np.abs(gy)
    return g

'''need modify'''
def he_preprocessing(img): #Histology image preprocessing to segmentation of background and tissue
    img_cp=img.copy()
    h,w=img_cp.shape[:2]
    scale_size=max(round((h*w/300000)**0.5),1)
    if scale_size>1:
        #resize to smaller size
        img_cp=cv2.GaussianBlur(img_cp,(3,3),0)
        img_cp=cv2.resize(img_cp,None,fx=1/scale_size,fy=1/scale_size,interpolation=cv2.INTER_CUBIC)
        #decolor to enhance 
        _,img_cp=cv2.decolor(img_cp)
        #colorful edge detection
        img_edge=color_metric_edge_detection(img_cp)
        #rerange to 0~255
        v_max,v_min=np.max(img_edge),np.min(img_edge)
        img_edge=np.uint8((img_edge-v_min)/(v_max-v_min)*255)
        #mask initial 
        mask=np.zeros(img_edge.shape[:2],np.uint8)
        #binary colorful edge img and close hole 
        _,img_edge= cv2.threshold(img_edge,(np.mean(img_edge)*0.8+np.median(img_edge)*1.2)//2,255,cv2.THRESH_BINARY)#+cv2.THRESH_OTSU)
        #_,img_edge= cv2.threshold(img_edge,0,255,cv2.THRESH_BINARY+cv2.THRESH_OTSU)
        img_edge=cv2.morphologyEx(img_edge,cv2.MORPH_CLOSE,cv2.getStructuringElement(cv2.MORPH_ELLIPSE,(15,15)),borderType=cv2.BORDER_REPLICATE)
        #coontour detect in binary img
        contours, _ = cv2.findContours(img_edge,cv2.RETR_EXTERNAL,cv2.CHAIN_APPROX_SIMPLE)
        contours=sorted(contours,key=lambda x: cv2.contourArea(x),reverse=True)
        #draw the largest contour 
        cv2.drawContours(mask,contours,0,255,-1)
        #draw other contour depend on area size 
        for i in range(1,len(contours)):
            if cv2.contourArea(contours[i])>0.15*img_edge.shape[0]*img_edge.shape[1] or cv2.contourArea(contours[i])>cv2.contourArea(contours[0])*0.5:
                cv2.drawContours(mask,contours,i,255,-1)
        #resize mask to original size 
        mask=cv2.resize(mask,(img.shape[1],img.shape[0]),interpolation=cv2.INTER_NEAREST)
        #remove the background region in original img 
        img_cp=img.copy()
        img_cp[np.where(mask==0)]=0
    else:
        mask=np.zeros(img.shape[:2],np.uint8)
        img_cp = img_cp.reshape((-1, 3))
        mask=mask.reshape((-1,1))
        img_cp = np.float32(img_cp)
        ret, label, center = cv2.kmeans(img_cp, 2, None, (cv2.TERM_CRITERIA_EPS + cv2.TERM_CRITERIA_MAX_ITER, 10, 1.0), 10, cv2.KMEANS_RANDOM_CENTERS)
        if abs(center[0][0]-center[0][1]) > abs(center[1][0]-center[1][1]):
            mask[np.where(label == 0)[0]] = 255
        else:
            mask[np.where(label == 1)[0]] = 255
        img_cp = np.uint8(img_cp).reshape((img.shape))
        mask = mask.reshape((img.shape[:2]));mask=cv2.GaussianBlur(mask,(5,5),0)
        contours, _ = cv2.findContours(mask,cv2.RETR_EXTERNAL,cv2.CHAIN_APPROX_SIMPLE)
        mask=np.zeros(mask.shape,np.uint8)
        contours=sort_cnt_by_area(contours)
        cv2.drawContours(mask,contours,0,255,-1)
        img_cp[np.where(mask==0)]=0
    return img_cp,mask