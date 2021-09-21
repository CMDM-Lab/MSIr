import React, { useState, useEffect } from "react"
import { useParams, useHistory } from "react-router-dom"
import Banner from "../public/Banner"
import ImagePicker from 'react-image-picker'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import {handleResponse} from "../../utils/handleResponse"
import configData from "../../config.json"
import registrationService from "../../services/registration_service"
import roi_service from "../../services/roi_service"
import extractionService from "../../services/extraction_service"

const CreateExtraction = () =>{
    
    const MySwal = withReactContent(Swal)

    const {datasetId} = useParams()
    const history = useHistory()  

    const [regs, setRegs] = useState([])
    const [rois, setRois] = useState([])

    const [regId, setRegId] = useState()
    const [roiId, setRoiId] = useState()
    const [norm, setNorm] = useState('none')

    const getData = async () => {
      try {
        const res_reg = await registrationService.all({datasetId})
        if (res_reg.status >= 200 && res_reg.status <300){
          setRegs(res_reg.data.data)
        } else{
          handleResponse(res_reg,MySwal,history)
        }
        const res_roi = await roi_service.allroi({datasetId})
        if (res_roi.status >= 200 && res_roi.status <300){
          setRois(res_roi.data.data)
        } else{
          handleResponse(res_roi,MySwal,history)
        }
      } catch (error) {
        console.log(error)
      }
    }

    useEffect(()=>{
      getData()
    },[])

    const onPickROI = (img) => {
      setRoiId(img.value)
    }

    const onPickReg = (img) => {
      setRegId(img.value)
    }

    const onChangeNorm = (e) => {
        setNorm(e.target.value)
    }

    const handleSubmit = async (e) => {
      try {
        if (!regId || !roiId){
          MySwal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Please select a registration and a ROI.'
          })
          return
        }
        const res = await extractionService.create({datasetId, histologyroiId: roiId, registrationId: regId, normalization: norm})
        const {data} = res.data
        if (res.status >= 200 && res.status <300){
          MySwal.fire({
            icon: 'success',
            title: 'Success',
            text: data.message
          }).then(()=>{
            history.push(`/datasets/${datasetId}/registrations`)
          })
        } else{
          handleResponse(res,MySwal,history)
        }
      } catch (error) {
        console.log()
      }

    }


    return (
    <>
    <Banner title={'Create an Extraction'} />
    <section className="challange_area">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-2 col-sm-3" />
            <div className="col-lg-8 col-sm-6" style={{paddingLeft: 0}}>
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                    <a href='/'>Home</a>
                </li>
                <li className="breadcrumb-item">
                    <a href='/datasets'>Datasets</a>
                </li>
                <li className="breadcrumb-item">
                    <a href={`/datasets/${datasetId}`}>Dataset ID: {datasetId}</a>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                    <a>Create an Extraction</a>
                </li>
              </ol>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-2 col-sm-2" />
            <div className="col-lg-8 col-sm-10">
              <h3>New Extraction</h3>
              <div className="form-group row">
                <label className="col-3 col-form-label">Select Registration Result</label>
                <div className="col-9">
                    <ImagePicker 
                      images={regs.map((reg) => ({src: configData.API_URL+`/upload/${datasetId}/${reg.result_file}`, value: reg.id}))}
                      onPick={onPickReg}
                    />
                </div>
              </div>
              <div className="form-group row">
                <label className="col-3 col-form-label">Select the ROI for Extraction</label>
                <div className="col-9">
                    <small className="form-text text-muted">
                            If there are not satisfying ROI, you can manually draw.
                    </small><br />
                    <ImagePicker 
                      images={rois.map((roi) => ({src: configData.API_URL+`/upload/${datasetId}/${roi.blend_img_file}`, value: roi.id}))}
                      onPick={onPickROI}
                    />
                </div>
              </div>
              <div className="form-group row">
                <label className="col-3 col-form-label">Data Normalization Type</label>
                <div className="col-9">
                    <select value={norm} onChange={onChangeNorm}>
                        <option value="none">No Data Normalization</option>
                        <option value="tic">TIC Normalization</option>
                    </select>
                </div>
              </div>
              <div className="form-group row py-2">
                <div className="col-lg-3 col-3" />
                <button onClick={handleSubmit} className='btn btn-primary col-lg-2 col-1'>Submit</button>
                {/*<button onClick={handleReset} className='btn btn-secondary col-lg-2 col-1'>Reset</button>*/}
              </div>
            </div>
          </div>
        </div>
      </section>
      </>
    )
}

export default CreateExtraction