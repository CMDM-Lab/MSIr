from pyimzml.ImzMLParser import ImzMLParser
import numpy as np
from scipy.sparse import csc_matrix
import scipy.ndimage as ndi
#from scipy.sparse.linalg import norm
from sklearn.cluster import KMeans
from sklearn.preprocessing import normalize
import cv2
from itertools import product

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
            if nn_peak_idx_low < 0:
                nn_peak_idx_low = 0

        if (idx+1)<len(target_peak_idx): # handle last idx
            nn_peak_idx_high=target_peak_idx[idx+1]-bin_idx  
        else: 
            nn_peak_idx_high=target_peak_idx[-1]+bin_idx
            if nn_peak_idx_high > len(mzs):
                nn_peak_idx_high = len(mzs)

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

def get_combinations_list(k):
    def ppowerset(iterable):
        for sl in product(*[[[], [i]] for i in iterable]):
            yield tuple(j for i in sl for j in i)

    result =[]
    for j in ppowerset(range(1,k+1)):
        result.append(j)
    result = sorted(result,key=lambda x:len(x))
    return result[1:-1]

def generate_msi_mask(msi_data, hist_cnt, shape):
    '''
    msi_data: csr sparse matrix
    hist_cnt: 2d array

    Through kmeans clustring with cosine distance (from k=2 to k=5), try to generate msi data mask of tissue region and use the similarity with hist_cnt as evaluation
    '''
    #unit norm
    data_norm=normalize(msi_data)
    #k-means clustering (k=2~5) stop when detected contour is similar with hist_cnt
    min_diff = 100
    better_mask = None
    for k in range(2,6):
        #kmeans result
        label = KMeans(n_clusters=k, random_state=112,verbose=0).fit_predict(data_norm).reshape(shape)+1
        #generate powerset of all value in label (exclude the all removed or all saved)
        comb_list = get_combinations_list(k)
        for subset in comb_list:
            label_tmp = label.copy()
            label_tmp[np.logical_or.reduce([label_tmp==i for i in subset])]=0
            label_tmp[label_tmp!=0]=1
            cnts, _ = cv2.findContours(np.uint8(label_tmp),cv2.RETR_EXTERNAL,cv2.CHAIN_APPROX_SIMPLE)
            cnts = sort_cnt_by_area(cnts)
            cnts_diff = cv2.matchShapes(hist_cnt,cnts,3, 0.0)
            if cnts_diff <= 0.16:    
                return label_tmp
            else:
                if min_diff > cnts_diff:
                    better_mask = label_tmp
                    min_diff = cnts_diff
    return better_mask

def tic_normalization (data):
    '''
    data: csc sparse matrix
    '''
    tic=np.array(data.sum(axis=1))
    tic=np.nan_to_num(np.mean(tic)/tic,posinf=0)
    data_proc=data.multiply(tic.reshape((-1,1))).tocsr()

    return data_proc

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
    """
    status: the result of getorient
    img_size: MSI data (n_rows, n_columns)
    """
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

def color_metric_edge_detection(img, sigma=0.33): 
    '''
    Complete version
    Abasi, Saeedeh, Mohammad A. Tehran, and Mark D. Fairchild. "Colour metrics for image edge detection." Color Research & Application 45.4 (2020): 632-643.
    The source code of skimage.feature.canny 
    Detect the edge from RGB image through color metric, Non-maximum suppression, and Edge Tracking by Hysteresis
    '''

    def hyab(p):
        value=np.abs(p[:,:,0])+(np.power(p[:,:,1],2)+np.power(p[:,:,2],2))**0.5
        return value

    def get_eroded_mask(img):
        eroded_mask = np.ones(img.shape, dtype=bool)
        eroded_mask[:1, :] = 0
        eroded_mask[-1:, :] = 0
        eroded_mask[:, :1] = 0
        eroded_mask[:, -1:] = 0
        return eroded_mask
    
    def _set_local_maxima(magnitude, pts, w_num, w_denum, row_slices,col_slices, out):
        """Get the magnitudes shifted left to make a matrix of the points to
        the right of pts. Similarly, shift left and down to get the points
        to the top right of pts.
        """
        r_0, r_1, r_2, r_3 = row_slices
        c_0, c_1, c_2, c_3 = col_slices
        c1 = magnitude[r_0, c_0][pts[r_1, c_1]]
        c2 = magnitude[r_2, c_2][pts[r_3, c_3]]
        m = magnitude[pts]
        w = w_num[pts] / w_denum[pts]
        c_plus = c2 * w + c1 * (1 - w) <= m
        c1 = magnitude[r_1, c_1][pts[r_0, c_0]]
        c2 = magnitude[r_3, c_3][pts[r_2, c_2]]
        c_minus = c2 * w + c1 * (1 - w) <= m
        out[pts] = c_plus & c_minus

        return out

    def _get_local_maxima(isobel, jsobel, magnitude, eroded_mask):
        """Edge thinning by non-maximum suppression.
        Finds the normal to the edge at each point, we can look at the signs of X and Y and the relative magnitude of X vs Y to sort the points into 4 categories: horizontal, vertical, diagonal and antidiagonal.
        Look in the normal and reverse directions to see if the values in either of those directions are greater than the point in question.
        Use interpolation (via _set_local_maxima) to get a mix of points instead of picking the one that's the closest to the normal.
        """
        abs_isobel = np.abs(isobel)
        abs_jsobel = np.abs(jsobel)

        eroded_mask = eroded_mask & (magnitude > 0)

        # Normals' orientations
        is_horizontal = eroded_mask & (abs_isobel >= abs_jsobel)
        is_vertical = eroded_mask & (abs_isobel <= abs_jsobel)
        is_up = (isobel >= 0)
        is_down = (isobel <= 0)
        is_right = (jsobel >= 0)
        is_left = (jsobel <= 0)
        #
        # --------- Find local maxima --------------
        #
        # Assign each point to have a normal of 0-45 degrees, 45-90 degrees,
        # 90-135 degrees and 135-180 degrees.
        #
        local_maxima = np.zeros(magnitude.shape, bool)
        # ----- 0 to 45 degrees ------
        # Mix diagonal and horizontal
        pts_plus = is_up & is_right
        pts_minus = is_down & is_left
        pts = ((pts_plus | pts_minus) & is_horizontal)
        # Get the magnitudes shifted left to make a matrix of the points to the right of pts. Similarly, shift left and down to get the points to the top right of pts.
        local_maxima = _set_local_maxima(
            magnitude, pts, abs_jsobel, abs_isobel,
            [slice(1, None), slice(-1), slice(1, None), slice(-1)],
            [slice(None), slice(None), slice(1, None), slice(-1)],
            local_maxima)
        # ----- 45 to 90 degrees ------
        # Mix diagonal and vertical
        #
        pts = ((pts_plus | pts_minus) & is_vertical)
        local_maxima = _set_local_maxima(
            magnitude, pts, abs_isobel, abs_jsobel,
            [slice(None), slice(None), slice(1, None), slice(-1)],
            [slice(1, None), slice(-1), slice(1, None), slice(-1)],
            local_maxima)
        # ----- 90 to 135 degrees ------
        # Mix anti-diagonal and vertical
        #
        pts_plus = is_down & is_right
        pts_minus = is_up & is_left
        pts = ((pts_plus | pts_minus) & is_vertical)
        local_maxima = _set_local_maxima(
            magnitude, pts, abs_isobel, abs_jsobel,
            [slice(None), slice(None), slice(-1), slice(1, None)],
            [slice(1, None), slice(-1), slice(1, None), slice(-1)],
            local_maxima)
        # ----- 135 to 180 degrees ------
        # Mix anti-diagonal and anti-horizontal
        #
        pts = ((pts_plus | pts_minus) & is_horizontal)
        local_maxima = _set_local_maxima(
            magnitude, pts, abs_jsobel, abs_isobel,
            [slice(-1), slice(1, None), slice(-1), slice(1, None)],
            [slice(None), slice(None), slice(1, None), slice(-1)],
            local_maxima)

        return local_maxima

    img_lab=cv2.cvtColor(img,cv2.COLOR_BGR2LAB)
    #color metric gradient magnitudes
    e17=cv2.filter2D(img_lab,cv2.CV_32F,np.array([[1,0,0],[0,0,0],[-1,0,0]]))
    e28=cv2.filter2D(img_lab,cv2.CV_32F,np.array([[0,1,0],[0,0,0],[0,-1,0]]))
    e39=cv2.filter2D(img_lab,cv2.CV_32F,np.array([[0,0,1],[0,0,0],[0,0,-1]]))
    e13=cv2.filter2D(img_lab,cv2.CV_32F,np.array([[1,0,-1],[0,0,0],[0,0,0]]))
    e46=cv2.filter2D(img_lab,cv2.CV_32F,np.array([[0,0,0],[1,0,-1],[0,0,0]]))
    e79=cv2.filter2D(img_lab,cv2.CV_32F,np.array([[0,0,0],[0,0,0],[1,0,-1]]))
    gx=hyab(e17)+2*hyab(e28)+hyab(e39)
    gy=hyab(e13)+2*hyab(e46)+hyab(e79)
    g=np.abs(gx)+np.abs(gy)
    
    #automatic determine low and high threshold
    #method 1
    v = np.mean(g)
    low_threshold  = int(max(0, (1.0 - sigma) * v))
    high_threshold = int(min(255, (1.0 + sigma) * v))
    #method 2
    '''from skimage.filters import threshold_multiotsu    
    low_threshold, high_threshold = threshold_multiotsu(g)'''
    
    eroded_mask = get_eroded_mask(g)
     # Non-maximum suppression
    local_maxima = _get_local_maxima(gx, gy, g, eroded_mask)

    # Double thresholding and edge traking
    low_mask = local_maxima & (g >= low_threshold)

    # Segment the low-mask, then only keep low-segments that have some high_mask component in them
    strel = np.ones((3, 3), bool)
    labels, count = ndi.label(low_mask, strel)
    if count == 0:
        return low_mask

    high_mask = local_maxima & (g >= high_threshold)
    nonzero_sums = np.unique(labels[high_mask])
    good_label = np.zeros((count + 1,), bool)
    good_label[nonzero_sums] = True
    output_mask = good_label[labels]

    return output_mask

'''Work but need to improve and develope'''
#Histology image preprocessing to segmentation of background and tissue through complete version color metric edge detection
def he_preprocessing(img): 
    img_cp=img.copy()
    h,w=img_cp.shape[:2]
    scale_size=max(round((h*w/300000)**0.5),1)
    if scale_size>1:
        #resize to smaller size
        img_cp=cv2.resize(img_cp,None,fx=1/scale_size,fy=1/scale_size,interpolation=cv2.INTER_CUBIC)
        
    #decolor to enhance 
    _,img_cp=cv2.decolor(img_cp)
    #colorful edge detection
    img_edge=color_metric_edge_detection(img_cp)
    #mask initial 
    mask=np.zeros(img_edge.shape[:2],np.uint8)
    #close operation to remove small hole
    img_edge=cv2.morphologyEx(np.uint8(img_edge),cv2.MORPH_CLOSE,
        cv2.getStructuringElement(cv2.MORPH_ELLIPSE,(15,15)),
        borderType=cv2.BORDER_REPLICATE)
        
    #coontour detect in binary img
    contours, _ = cv2.findContours(np.uint8(img_edge),cv2.RETR_EXTERNAL,cv2.CHAIN_APPROX_SIMPLE)
    contours=sorted(contours,key=lambda x: cv2.contourArea(x),reverse=True)
    #draw the largest contour 
    cv2.drawContours(mask,contours,0,1,-1)
    #draw other contour depend on area size 
    for i in range(1,len(contours)):
        if cv2.contourArea(contours[i])>0.15*img_edge.shape[0]*img_edge.shape[1] or cv2.contourArea(contours[i])>cv2.contourArea(contours[0])*0.5:
            cv2.drawContours(mask,contours,i,1,-1)
    if scale_size>1:
        #resize mask to original size 
        mask=cv2.resize(mask,(img.shape[1],img.shape[0]),interpolation=cv2.INTER_NEAREST)
    #remove the background region in original img 
    img_cp=img.copy()
    img_cp= img_cp*mask.reshape((mask.shape[0],mask.shape[1],1))
    
    return img_cp,mask