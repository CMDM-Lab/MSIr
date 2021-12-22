import React, { useEffect, useState } from "react";
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import Banner from "../public/Banner";
import {Line} from "rc-progress"
import Uploady, { useItemFinishListener, useItemProgressListener } from "@rpldy/uploady";
import UploadButton from "@rpldy/upload-button";
import { useHistory, useParams } from "react-router-dom";
import authHeader from "../../services/auth-header";
import configData from '../../config.json'
import histology_service from "../../services/histology_service";
import { handleResponse } from "../../utils/handleResponse";

const UploadProgress = ({setState}) => {
    const [progress, setProgess] = useState(0);
  
    const progressData = useItemProgressListener();
    useItemFinishListener((item)=>{
        setState({data:item.uploadResponse.data, status: item.uploadStatus})
    })
  
    if (progressData && progressData.completed > progress) {
      setProgess(() => progressData.completed);
    }

    if (progressData &&progress==100){
        return <></>
    }

    return (
        progressData && (
          <Line
            style={{ height: "10px", marginTop: "20px" }}
            strokeWidth={2}
            strokeColor={progress === 100 ? "#00a626" : "#2db7f5"}
            percent={progress}
          />
        )
      );
};

const EditImage = (props) => {

    const MySwal = withReactContent(Swal)
    const {datasetId} = useParams()
    const history = useHistory()

    const [resolution, setResolution] = useState(-1)
    const [imageRes, setImageRes] = useState()

    const getInformation = async () =>{
        const res = await histology_service.getInformation({datasetId})
        if (res.status >= 200 && res.status <300){
            setImageRes({data:res.data})
            setResolution(res.data.image.resolution)
        } else{
            handleResponse(res, MySwal, history)
        }
    }

    useEffect(()=>{
        getInformation()
    },[])

    const onChangeResolution = (e)=>{
        const value = e.target.value;
        setResolution(value)
    }

    const handleSubmit = async () => {
        try {
            console.log(imageRes)
            if (!imageRes){
                MySwal.fire('Error','Please upload a histology image first or wait for finishing uploading','error')
                return
            }
            /*axios post接後端回傳response*/
            const res = await histology_service.submit({
                histologyImageId: imageRes.data.image.histologyImageId,
                resolution:resolution
            })
            const {data} = res
            if (res.status >= 200 && res.status <300){
                MySwal.fire('Success',data.message,'success').then(()=>history.goBack())
            }else{
                handleResponse(res, MySwal, history)
            }
        } catch (error) {
            console.log(error)
            MySwal.fire({
              icon: 'error',
              title: `Error`,
              text: `Please retry after a while.`,
            })
        }
    }

    return (
    <>
    <Banner title={'Upload a histology image'} />
    <section className="challange_area">
        <div className="container-fluid">
            <div className="row">
                <div className="col-lg-2 col-3" />
                <div className="col-lg-10 col-9">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item">
                            <a href='/'>Home</a>
                        </li>
                        <li className="breadcrumb-item">
                            <a href='/datasets'>Datasets</a>
                        </li>
                        <li className="breadcrumb-item">
                            <a href={`/datasets/${datasetId}`}>ID: {datasetId}</a>
                        </li>
                        <li className="breadcrumb-item active">
                            <p>Upload a histology image</p>
                        </li>
                    </ol></div></div>
            <div className="form-group row py-2">
                <div className="col-lg-2 col-3" />
                <label className="col-3 col-form-label">Upload histology file*</label>
                <div className="col-6">
                    <Uploady
                        multiple = {false}
                        destination={{ url: configData.API_URL+`/histology/new?datasetId=${datasetId}` , headers:authHeader()}}
                        accept=".png,.tif,.jpg,.jpeg"
                        fileFilter={(file)=>{return file.size < configData.MAX_BTYE_HISTOLOGY_FILE}}
                        sendWithFormData = {true}
                        >
                            <UploadButton className='btn btn-outline-secondary col-lg-6 col-6'>{imageRes?'Remove & Re-upload':'Select File & Upload'}</UploadButton> 
                            {imageRes? <p>{imageRes.data.image.file} Upload Finish</p>:null} 
                            <UploadProgress setState={setImageRes} />
                        </Uploady>

                </div>
                <div className="col-lg-5 col-3" />
            </div>
            <div className="form-group row py-2">
                <div className="col-lg-2 col-3" />
                <label className="col-3 col-form-label">Spatial Resolution</label>
                <div className="col-6">
                    <input 
                    type='number'
                    name='resolution'
                    value={resolution}
                    className='form-control input50'
                    placeholder='Type Image Spatial Resolution'
                    id="resolution"
                    onChange={onChangeResolution}
                    step="0.0001"
                    />
                    <small className="form-text text-muted">Please fill the spatial resolution of the uploaded image.</small>
                </div>
            </div>
            
            <div className="form-group row py-2">
                <div className="col-lg-5 col-3" />
                <button onClick={handleSubmit} className='btn btn-primary col-lg-1 col-1'>Submit</button>
                {/*<button onClick={handleReset} className='btn btn-secondary col-lg-1 col-1'>Reset</button>*/}
            </div>
        </div>
      </section>
      </>
    )
}

export default EditImage