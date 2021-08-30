import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { useHistory } from 'react-router-dom'
import { useAuthState } from '../../services/auth_service'
import Banner from '../public/Banner'
import datasetService from '../../services/datasets_service'
import registrationService from '../../services/registration_service'
import extractionService from '../../services/extraction_service'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const DatasetRender = (props) => {
    const MySwal = withReactContent(Swal)

    const {datasetId} = useParams()
    const {user} = useAuthState()
    const history = useHistory()
    
    const [dataset, setDataset] = useState() 
    const [registrations,setRegistrations] = useState([])
    const [extractions,setExtractions] = useState([])

    const getData = async()=>{
        const res_dataset = await datasetService.show({datasetId})
        if (res_dataset.status >= 200 && res_dataset.status <300){
            setDataset(res_dataset.data.data)
        } else{
            switch(res_dataset.status){
                case 404:
                case 401:
                    MySwal.fire({
                        icon: 'error',
                        title: `${res_dataset.data.message}`,
                    }).then(()=>{
                        history.goBack()
                    })
                    break
                case 403:
                    MySwal.fire({
                        icon: 'error',
                        title: `${res_dataset.data.message}`,
                    }).then(()=>{
                        history.push('/users/sign_in')
                    })
                    break
                case 500:
                    MySwal.fire({
                        icon: 'error',
                        title: `${res_dataset.data.message}`,
                        text: `Please retry after a while. (${res_dataset.data.message})`,
                      }).then(()=>{
                        history.goBack()
                    })
                    break
            }
        }
        const res_regist = await registrationService.all({datasetId})
        if (res_regist.status >= 200 && res_regist.status <300){
            setRegistrations([...res_regist.data.data])
        } else{
            switch(res_regist.status){
                case 404:
                case 401:
                    MySwal.fire({
                        icon: 'error',
                        title: `${res_regist.data.message}`,
                    }).then(()=>{
                        history.goBack()
                    })
                    break
                case 403:
                    MySwal.fire({
                        icon: 'error',
                        title: `${res_regist.data.message}`,
                    }).then(()=>{
                        history.push('/users/sign_in')
                    })
                    break
                case 500:
                    MySwal.fire({
                        icon: 'error',
                        title: `${res_regist.data.message}`,
                        text: `Please retry after a while. (${res_regist.data.message})`,
                      }).then(()=>{
                        history.goBack()
                    })
                    break
            }
        }
        const res_extract = await extractionService.all({datasetId})
        if (res_extract.status >= 200 && res_extract.status <300){
            setExtractions([...res_extract.data.data])
        } else{
            switch(res_extract.status){
                case 404:
                case 401:
                    MySwal.fire({
                        icon: 'error',
                        title: `${res_extract.data.message}`,
                    }).then(()=>{
                        history.goBack()
                    })
                    break
                case 403:
                    MySwal.fire({
                        icon: 'error',
                        title: `${res_extract.data.message}`,
                    }).then(()=>{
                        history.push('/users/sign_in')
                    })
                    break
                case 500:
                    MySwal.fire({
                        icon: 'error',
                        title: `${res_extract.data.message}`,
                        text: `Please retry after a while. (${res_extract.data.message})`,
                      }).then(()=>{
                        history.goBack()
                    })
                    break
            }
        }

    }

    useEffect(()=>{
        getData()
    },[])

    return (
    <>
    <Banner title={'Dataset Name'} />
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
                <a>{dataset? dataset.name : null}</a>
              </li>
              </ol></div></div>
        <div className="row">
            <div className="col-lg-1 col-1" />
            <div className='col-lg-5 col-sm-12 dataset_info border-end'>
                <h3>
                    Dataset details
                    <div className='btn-group'>
                        <a className='btn btn-secondary text-left' style={{'color':'white'}} href={`/datasets/${datasetId}/edit`}>
                            Edit
                        </a>
                    </div>
                </h3>
                <ol>
                    <li>Dataset Name:{dataset? dataset.name : null}</li>
                    <li>Dataset Description:{dataset? dataset.description : null}</li>
                </ol>
                <h3>
                    MSI data
                    <div className='btn-group'>
                        <a className='btn btn-secondary text-left' style={{'color':'white'}} href=''>
                            Edit
                        </a>
                    </div>
                </h3>
                <ol>
                    <li>imzML:{}</li>
                    <li>ibd:{}</li>
                </ol>
                <h3>
                    Histological Image
                    <div className='btn-group'>
                        <a className='btn btn-secondary text-left' style={{'color':'white'}} href=''>
                            Edit
                        </a>
                    </div>
                </h3>
                <img></img>
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
                {registrations.length>0?(<div></div>):(<p>No Registration Result</p>)}
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
                {extractions.length>0?(<div></div>):(<p>No Extraction Result</p>)}
            </div>
        </div>
      </div>
    </section>
    </>
    )
}

export default DatasetRender