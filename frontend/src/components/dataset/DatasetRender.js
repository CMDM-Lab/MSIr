import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { Link, useHistory } from 'react-router-dom'
import Banner from '../public/Banner'
import datasetService from '../../services/datasets_service'
import registrationService from '../../services/registration_service'
import extractionService from '../../services/extraction_service'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

import configData from '../../config.json'
import RegisterCard from './RegisterCard'
import ExtractCard from './ExtractCard'
import { handleResponse } from '../../utils/handleResponse'

const DatasetRender = () => {
    const MySwal = withReactContent(Swal)

    const { datasetId } = useParams()
    //const {user} = useAuthState()
    const history = useHistory()

    const [dataset, setDataset] = useState()
    const [registrations, setRegistrations] = useState([])
    const [extractions, setExtractions] = useState([])
    const [hist, setHist] = useState()
    const [msi, setMsi] = useState()

    const getData = async () => {
        try {
            const res_dataset = await datasetService.show({ datasetId })
            const { data } = res_dataset
            if (res_dataset.status >= 200 && res_dataset.status < 300) {
                setDataset(data.dataset)
                setHist(data.histologyImage)
                setMsi(data.msi)
            } else {
                if (res_dataset.status === 404) {
                    MySwal.fire({
                        icon: 'error',
                        title: `${res_dataset.data.message}`,
                    }).then(() => {
                        history.goBack()
                    })
                } else {
                    handleResponse(res_dataset, MySwal, history)
                }

            }
            const res_regist = await registrationService.all({ datasetId })
            if (res_regist.status >= 200 && res_regist.status < 300) {
                setRegistrations([...res_regist.data.data])
            } else {
                handleResponse(res_regist, MySwal, history)
            }
            const res_extract = await extractionService.all({ datasetId })
            if (res_extract.status >= 200 && res_extract.status < 300) {
                setExtractions([...res_extract.data.data])
            } else {
                handleResponse(res_extract, MySwal, history)
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getData()
    }, [])

    return (
        <>
            <Banner title={dataset ? `Dataset: ${dataset.name}` : 'Dataset'} />
            <section className="challange_area">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-lg-1 col-1" />
                        <div className="col-lg-6 col-10" style={{ paddingLeft: 0 }}>
                            <ol className="breadcrumb">
                                <li className="breadcrumb-item">
                                    <Link to='/'>Home</Link>
                                </li>
                                <li className="breadcrumb-item">
                                    <Link to='/datasets'>Datasets</Link>
                                </li>
                                <li className="breadcrumb-item">
                                    {dataset ? `Dataset ID:${dataset.id}` : null}
                                </li>
                            </ol></div></div>
                    <div className="row p_b_100">
                        <div className="col-lg-1 col-1" />
                        <div className='col-lg-5 col-sm-12 dataset_info border-end'>
                            <h3>
                                Dataset details <span />
                                <div className='btn-group col-lg-3 col-3'>
                                    <Link className='btn btn-secondary text-left' style={{ 'color': 'white' }} to={`/datasets/${datasetId}/edit`}>
                                        Edit
                                    </Link>
                                </div>
                            </h3>
                            <ul>
                                <li>Name: {dataset ? dataset.name : null}</li>
                                <li>Description: {dataset ? dataset.description : null}</li>
                            </ul>
                            <h3>
                                MSI data <span />
                                <div className='btn-group col-lg-3 col-3'>
                                    <Link className='btn btn-secondary text-left' style={{ 'color': 'white' }} to={msi ? `/datasets/${datasetId}/msi/edit` : `/datasets/${datasetId}/msi/new`}>
                                        {msi ? 'Edit' : 'Select File & Upload'}
                                    </Link>
                                </div>
                            </h3>
                            <ul>
                                <li>imzML: {msi ? msi.imzml_file : null}</li>
                                <li>ibd: {msi ? msi.ibd_file : null}</li>
                            </ul>
                            <h3>
                                Histological Image {hist ? null :
                                    <><span />
                                        <div className='btn-group'>
                                            <Link className='btn btn-secondary text-left' style={{ 'color': 'white' }} to={`/datasets/${datasetId}/image/new`}>
                                                {'Select File & Upload'}
                                            </Link>
                                            <span />
                                        </div></>}
                            </h3>
                            {hist ?
                                (
                                    <div className='btn-group col-lg-6 col-6'>
                                        <Link className='btn btn-secondary text-left' style={{ 'color': 'white' }} to={`/datasets/${datasetId}/image/edit`}>
                                            {'Edit'}
                                        </Link>
                                        <span />
                                        <button onClick={() => { history.push(`/datasets/${datasetId}/image/roi`) }} className='btn btn-outline-primary  col-lg-2 col-2'>Create ROI</button>
                                    </div>
                                ) : null
                            }
                            <br />
                            {hist ?
                                <div className='images card-columns'>
                                    <div className='card'>
                                        <img src={configData.API_URL + `/upload/${datasetId}/${hist.file}`} className='card-img-top viewer' alt='a uplaoded histology' />
                                        <div className='card-body'><h5 className='card-title'>{hist.file}</h5></div>
                                    </div>
                                </div>
                                : null}
                        </div>
                        <div className='col-lg-3 col-sm-12 border-end'>
                            <h3>Registrations</h3>
                            <div className='btn-group'>
                                <Link className='btn btn-info text-left' style={{ 'color': 'white' }} to={`/datasets/${datasetId}/registrations/new`}>
                                    New Registration
                                </Link>
                                <Link className='btn btn-secondary text-left' style={{ 'color': 'white' }} to={`/datasets/${datasetId}/registrations`}>
                                    All Registrations
                                </Link>
                            </div>
                            {registrations.length > 0 ? (
                                registrations.map((registration) => {
                                    return <RegisterCard registerData={registration} />
                                })
                            ) : (<p>No Registration Result</p>)}
                        </div>
                        <div className='col-lg-3 col-sm-12'>
                            <h3>Data Extractions</h3>
                            <div className='btn-group'>
                                <Link className='btn btn-info text-left' style={{ 'color': 'white' }} to={`/datasets/${datasetId}/extractions/new`}>
                                    New Extraction
                                </Link>
                                <Link className='btn btn-secondary text-left' style={{ 'color': 'white' }} to={`/datasets/${datasetId}/extractions`}>
                                    <i className='fad fa-th-list fa-lg'></i>
                                    All Extractions
                                </Link>
                            </div>
                            {extractions.length > 0 ? (
                                extractions.map((extract, idx) => {
                                    return <ExtractCard extractData={extract} />
                                }
                                )
                            ) : (<p>No Extraction</p>)}
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default DatasetRender