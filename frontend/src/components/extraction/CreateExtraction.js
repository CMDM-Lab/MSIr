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
import image1 from "../roi/draw tutorials.png"
import { useCookies } from "react-cookie"

const CreateExtraction = () =>{
    const [cookies, setCookie] = useCookies([]);
    const MySwal = withReactContent(Swal)

    const {datasetId} = useParams()
    const history = useHistory()  

    const [regs, setRegs] = useState([])
    const [rois, setRois] = useState([])

    const [regId, setRegId] = useState()
    const [roiId, setRoiId] = useState()
    //const [norm, setNorm] = useState('none')
    const [norm,] = useState('none')

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

    //const onChangeNorm = (e) => {
    //    setNorm(e.target.value)
    //}
    const  c_start=document.cookie.indexOf("draw_tutorial");
    const drawmask = () =>{

      if (c_start == -1 ){
        history.push(`/datasets/${datasetId}/image/roi`)
        Swal.fire({
          // title: 'Instructions!',
          text: 'Follow the instructions to draw!',
          iconHtml: '🧑🏼‍🏫',
          imageUrl: image1,
          imageWidth: 400,
          imageHeight: 1070,
          confirmButtonColor: '#000000',
          imageAlt: 'Instruction image',
        }).then(()=>{
          setCookie("draw_tutorial", "1", {
            path: "/",
            maxAge: 60*60*24,
          })})
      }
      else{
        history.push(`/datasets/${datasetId}/image/roi`)
      }
    }
    const handleSubmit = async (e) => {
      try {
        if (!regId || !roiId){
          MySwal.fire({
            icon: 'error',
            iconColor: '#000000',
            title: 'Error',
            text: 'Please select one registration and one ROI.',
            confirmButtonColor: '#000000',
          })
          return
        }
        const res = await extractionService.create({datasetId, histologyroiId: roiId, registrationId: regId, normalization: norm})
        const data = res.data
        if (res.status >= 200 && res.status <300){
          MySwal.fire({
            icon: 'success',
            iconColor: '#000000',
            title: 'Success',
            text: data.message,
            confirmButtonColor: '#000000',
          }).then(()=>{
            let timerInterval
            Swal.fire({
              title: 'Wait for Extraction!',
              // html: 'I will close in <b></b> milliseconds.',
              timer: 2000,
              timerProgressBar: true,
              didOpen: () => {
                Swal.showLoading()
                // const b = Swal.getHtmlContainer().querySelector('b')
                // timerInterval = setInterval(() => {
                //   b.textContent = Swal.getTimerLeft()
                // }, 100)
              },
              willClose: () => {
                clearInterval(timerInterval)
              }
            }).then((result) => {
              /* Read more about handling dismissals below */
              if (result.dismiss === Swal.DismissReason.timer) {
                console.log('I was closed by the timer')
                window.location.href = `/datasets/${datasetId}?step=2`;
              }
            })
            // history.push(`/datasets/${datasetId}`)
          })
        } else{
          handleResponse(res,MySwal,history)
        }
      } catch (error) {
        console.log(error)
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
                    Create an Extraction
                </li>
              </ol>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-2 col-sm-2" />
            <div className="col-lg-8 col-sm-10">
            <h3>New Extraction</h3>
              <p>You should select one registration result and one region of interest (ROI) to acquire the spectral indices</p>
              <br/>
              <div className="form-group row">
                <label className="col-3 col-form-label">Select Registration Result*</label>
                <div className="col-9">
                    <ImagePicker 
                      images={regs.map((reg) => ({src: configData.API_URL+`/upload/${datasetId}/${reg.result_file}`, value: reg.id}))}
                      onPick={onPickReg}
                    />
                </div>
              </div>
              <br/>
              <br/>
              <div className="form-group row">
                <label className="col-3 col-form-label">Select the ROI for Extraction*
                <p>( Draw the ROI first )</p>
                <br/>
                  {/* <button onClick={()=>{
                        history.push(`/datasets/${datasetId}/image/roi`)
                        Swal.fire({
                          // title: 'Instructions!',
                          text: 'Follow the instructions to draw!',
                          imageUrl: image,
                          imageWidth: 400,
                          imageHeight: 1200,
                          imageAlt: 'Instruction image',
                        })
                        }} className='btn btn-outline-success col-lg-8 col-8'>✚ ROI
                  </button> */}
                  <button onClick={drawmask} className='btn btn-outline-dark col-lg-8 col-8'>✚ ROI</button>
                  </label>
                <div className="col-9">
                    <br/>
                    <ImagePicker 
                      images={rois.map((roi) => ({src: configData.API_URL+`/upload/${datasetId}/${roi.blend_img_file}`, value: roi.id}))}
                      onPick={onPickROI}
                    />
                    <br/>
                    <br/>
                    <br/>
                </div>
              </div>
              {/*<div className="form-group row">
                <label className="col-3 col-form-label">Data Normalization Type</label>
                <div className="col-9">
                    <select value={norm} onChange={onChangeNorm}>
                        <option value="none">No Data Normalization</option>
                        <option value="tic">TIC Normalization</option>
                    </select>
                </div>
              </div>
            */}
              <div className="form-group row py-2">
                <div className="col-lg-3 col-3" />
                <button onClick={handleSubmit} className='btn btn-dark col-lg-2 col-1'>Submit</button>
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