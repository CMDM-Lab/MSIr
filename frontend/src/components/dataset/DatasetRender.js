import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { useHistory } from 'react-router-dom'
import Banner from '../public/Banner'
import datasetService from '../../services/datasets_service'
import registrationService from '../../services/registration_service'
import extractionService from '../../services/extraction_service'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

import {Circle} from "rc-progress"
import Uploady, { useItemProgressListener, useItemFinishListener} from "@rpldy/uploady";
import UploadButton from "@rpldy/upload-button";
import configData from '../../config.json'
import authHeader from '../../services/auth-header'
import RegisterCard from './RegisterCard'
import ExtractCard from './ExtractCard'
import { handleResponse } from '../../utils/handleResponse'

const UploadProgress = ({setState}) => {
    const [progress, setProgess] = useState(0);
    const history = useHistory()
  
    const progressData = useItemProgressListener();
    useItemFinishListener((item)=>{
        setState({res:item.uploadResponse, status: item.uploadStatus})
        history.go(0)
    })
  
    if (progressData && progressData.completed > progress) {
      setProgess(() => progressData.completed);
    }

    if (progressData &&progress==100){
        return <></>
    }

    return (
        progressData && (
          <Circle
            style={{ height: "50px", marginLeft: "20px" }}
            strokeWidth={2}
            strokeColor={progress === 100 ? "#00a626" : "#2db7f5"}
            percent={progress}
          />
        )
      );
};

const DatasetRender = () => {
    const MySwal = withReactContent(Swal)

    const {datasetId} = useParams()
    //const {user} = useAuthState()
    const history = useHistory()
    
    const [dataset, setDataset] = useState() 
    const [registrations,setRegistrations] = useState([])
    const [extractions,setExtractions] = useState([])
    const [hist, setHist] = useState()
    const [msi, setMsi] = useState()

    const getData = async()=>{
        try {
            const res_dataset = await datasetService.show({datasetId})
            const {data} = res_dataset
            if (res_dataset.status >= 200 && res_dataset.status <300){
                setDataset(data.dataset)
                setHist(data.histologyImage)
                setMsi(data.msi)
            } else{
                if (res_dataset.status===404){
                    MySwal.fire({
                        icon: 'error',
                        title: `${res_dataset.data.message}`,
                    }).then(()=>{
                        history.goBack()
                    })
                }else{
                    handleResponse(res_dataset, MySwal, history)
                }
                
            }
            const res_regist = await registrationService.all({datasetId})
            if (res_regist.status >= 200 && res_regist.status <300){
                setRegistrations([...res_regist.data.data])
            } else{
                handleResponse(res_regist, MySwal, history)
            }
            const res_extract = await extractionService.all({datasetId})
            if (res_extract.status >= 200 && res_extract.status <300){
                setExtractions([...res_extract.data.data])
            } else{
                handleResponse(res_extract, MySwal, history)
            }
            } catch (error) {
            console.log(error)
        }
    }

    useEffect(()=>{
        getData()
    },[])

    return (
    <>
    <Banner title={dataset?`Dataset: ${dataset.name}`: 'Dataset'} />
    <section className="challange_area">
      <div className="container-fluid">
        <div className="row">
          <div className="col-lg-1 col-1" />
          <div className="col-lg-6 col-10" style={{paddingLeft: 0}}>
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <a href='/'>Home</a>
              </li>
              <li className="breadcrumb-item">
                <a href='/datasets'>Datasets</a>
              </li>
              <li className="breadcrumb-item">
                <a>{dataset? `Dataset ID: ${dataset.id}` : null}</a>
              </li>
              </ol></div></div>
        <div className="row p_b_100">
            <div className="col-lg-1 col-1" />
            <div className='col-lg-5 col-sm-12 dataset_info border-end'>
                <h3>
                    Dataset details <span/>
                    <div className='btn-group col-lg-3 col-3'>
                        <a className='btn btn-secondary text-left' style={{'color':'white'}} href={`/datasets/${datasetId}/edit`}>
                            Edit
                        </a>
                    </div>
                </h3>
                <ul>
                    <li>Name: {dataset? dataset.name : null}</li>
                    <li>Description: {dataset? dataset.description : null}</li>
                </ul>
                <h3>
                    MSI data <span/>
                    <div className='btn-group col-lg-3 col-3'>
                        <a className='btn btn-secondary text-left' style={{'color':'white'}} href={msi?`/datasets/${datasetId}/msi/edit`:`/datasets/${datasetId}/msi/new`}>
                            {msi?'Edit':'Select File & Upload'}
                        </a>
                    </div>
                </h3>
                <ul>
                    <li>imzML: {msi? msi.imzml_file:null}</li>
                    <li>ibd: {msi? msi.ibd_file:null}</li>
                </ul>
                <h3>
                    Histological Image <span/>
                    <div className='btn-group'>
                        <Uploady
                        multiple = {false}
                        destination={{ url: configData.API_URL+`/histology/new?datasetId=${datasetId}` , headers:authHeader()}}
                        accept=".png,.tif,.jpg,.jpeg"
                        fileFilter={(file)=>{return file.size < configData.MAX_BTYE_HISTOLOGY_FILE}}
                        sendWithFormData = {true}
                        >
                            <UploadButton className='btn btn-outline-secondary col-lg-2 col-2'>{hist?'Remove & Re-upload':'Select File & Upload'}</UploadButton> 
                            <UploadProgress setState={setHist} />
                        </Uploady>
                        <span/>
                        {hist? <button onClick={()=>{history.push(`/datasets/${datasetId}/image/roi`)}} className='btn btn-outline-primary  col-lg-2 col-2'>Create ROI</button>:null}
                    </div>
                </h3>
                <br />
                {hist?
                <div className='images card-columns'>
                    <div className='card'>
                        <img src={configData.API_URL+`/upload/${datasetId}/${hist.file}`} className='card-img-top viewer'/>
                        <div className='card-body'><h5 className='card-title'>{hist.file}</h5></div>
                    </div>
                </div>
                :null}
            </div>
            <div className='col-lg-3 col-sm-12 border-end'>
                <h3>Registrations</h3>
                <div className='btn-group'>
                    <a className='btn btn-info text-left' style={{'color':'white'}} href={`/datasets/${datasetId}/registrations/new`}>
                        New Registration
                    </a>
                    <a className='btn btn-secondary text-left' style={{'color':'white'}} href={`/datasets/${datasetId}/registrations`}>
                        All Registrations
                    </a>
                </div>
                {registrations.length>0?(
                    registrations.map((registration)=>{
                        return <RegisterCard registerData={registration} />
                    })
                ):(<p>No Registration Result</p>)}
            </div>
            <div className='col-lg-3 col-sm-12'>
                <h3>Data Extractions</h3>
                <div className='btn-group'>
                    <a className='btn btn-info text-left' style={{'color':'white'}} href={`/datasets/${datasetId}/extractions/new`}>
                        New Extraction
                    </a>
                    <a className='btn btn-secondary text-left' style={{'color':'white'}} href={`/datasets/${datasetId}/extractions`}>
                        <i className='fad fa-th-list fa-lg'></i>
                        All Extractions
                    </a>
                </div>
                {extractions.length>0?(
                 extractions.map((extract,idx)=>{
                    return<ExtractCard extractData={extract}/>
                    }
                 )
                ):(<p>No Extraction</p>)}
            </div>
        </div>
      </div>
    </section>
    </>
    )
}

export default DatasetRender