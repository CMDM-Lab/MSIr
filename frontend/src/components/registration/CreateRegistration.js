import React, { useEffect, useState } from "react"
import { useParams, useHistory } from "react-router-dom"
import Banner from "../public/Banner"
import ImagePicker from 'react-image-picker'
import 'react-image-picker/dist/index.css'
import configData from "../../config.json"
import not_select from '../../stylesheet/not_select_mask.svg'
import roi_service from "../../services/roi_service"
import registrationService from "../../services/registration_service"
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import {handleResponse} from "../../utils/handleResponse"
import image1 from "../roi/draw tutorials.png"
import { useCookies } from "react-cookie"

const CreateRegistration = () =>{
    const [cookies, setCookie] = useCookies([]);
    const MySwal = withReactContent(Swal)

    const {datasetId} = useParams()
    const history = useHistory()

    const [maskId, setMaskId] = useState()

    const [regType, setRegType] = useState('intensity')
    const [masks, setMasks] = useState([{id:null, blend_img_file:not_select}])
    const [DR, setDR] = useState('UMAP')
    const [nDim, setNDim] = useState(3)

    const getMask = async () =>{
      try {
        const res = await roi_service.allmask({datasetId})
        const {data} = res.data
        console.log(data)
        if (res.status >= 200 && res.status <300){
          // var newMasks = masks
          // newMasks = newMasks.concat(data)
          // console.log(newMasks)
          // setMasks(newMasks)
          setMasks(data)
        } else{
          handleResponse(res,MySwal,history)
        }
      } catch (error) {
        console.log(error) 
      }  
    }

    useEffect(()=>{
      getMask()
    },[])

    const onChangeRegType = (e) => {
        setRegType(e.target.value)
    }
    const onChangeDR = (e) => {
        setDR(e.target.value)
    }
    const onChangeNDim = (e) => {
      setNDim(e.target.value)
    }
    const onPick = (img) => {
        setMaskId(img.value)
    }
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
          imageAlt: 'Instruction image',
          confirmButtonColor: '#000000',
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
        const res = await registrationService.create({
          perform_type: regType,
          DR_method: DR,
          n_dim: nDim,
          datasetId: Number(datasetId),
          histologyroiId: maskId
        })
        const data = res.data
        if (res.status >= 200 && res.status <300){
          MySwal.fire({
            icon: 'success',
            iconColor: '#000000',
            title: 'Success',
            confirmButtonColor: '#000000',
            text: data.message
          }).then(()=>{
            let timerInterval
            Swal.fire({
              title: 'Wait for Registration!',
              // html: 'I will close in <b></b> milliseconds.',
              timer: 20000,
              timerProgressBar: true,
              allowOutsideClick: false,
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
                console.log('I was closed by the timer');
                window.location.href = `/datasets/${datasetId}?step=1`;
              }
            })
            // history.push(`/datasets/${datasetId}/registrations`)
            // history.push(`/datasets/${datasetId}`)
          })
        } else{
          handleResponse(res,MySwal,history)
        }
      } catch (error) {
        console.log('error')
        console.log(error) 
      }
    }


    return (
    <>
    <Banner title = {"Create a new Registration"} />
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
                <li className="breadcrumb-item active">
                    Create a Registration
                </li>
              </ol>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-2 col-sm-2" />
            <div className="col-lg-8 col-sm-10">
              <h3>New Registration</h3>
              <div className="form-group row">
                <label className="col-3 col-form-label">Registration type</label>
                <div className="col-9">
                    <select value={regType} onChange={onChangeRegType}>
                        <option value="intensity">Intensity-based method</option>
                        <option value="contour">Contour-based method</option>
                    </select>
                </div>
              </div>
              {
                regType === 'intensity'?(
                  <div className="form-group row">
                    <label className="col-3 col-form-label">Dimensional Reduction</label>
                    <div className="col-9">
                      <select value={DR} onChange={onChangeDR}>
                          <option value="UMPA">UMAP</option>
                          <option value="PCA">PCA</option>
                      </select>
                    </div>
                  </div>
                ):null
              }
              {
                DR === 'UMAP' & regType === 'intensity'?(
                  <div className="form-group row">
                    <label className="col-3 col-form-label">Embedding Dimension</label>
                    <div className="col-9">
                      <select value={nDim} onChange={onChangeNDim}>
                          <option value={1}>1</option>
                          <option value={3}>3</option>
                      </select>
                    </div>
                  </div>
                ):null
              }
              <div className="form-group row">
                <label className="col-3 col-form-label">Select the mask of histology image (optional)
                    <br/>
                    <br/>
                    {/* <button onClick={()=>{
                      history.push(`/datasets/${datasetId}/image/roi`)
                      Swal.fire({
                        title: 'Instructions!',
                        text: 'Follow the instructions to draw.',
                        imageUrl: image1,
                        imageWidth: 400,
                        imageHeight: 1200,
                        imageAlt: 'Instruction image',
                      })
                      }} className='btn btn-outline-success col-lg-8 col-8'>✚ Mask
                    </button> */}
                <button onClick={drawmask} className='btn btn-outline-dark col-lg-8 col-8'>✚ Mask</button>
                </label>
                <div className="col-9">
                    <div className='col-lg-12 col-12'>
                    <small className="form-text text-muted">
                            Mask can be drawn manually or automatically.
                            <br/>
                            If there is not any mask to select, mask would be generated automatically.
                    </small>
                    </div>
                    <br/>
                    <div>{masks.map((mask) => (mask.label=='mask')) && 
                      <ImagePicker 
                      images={masks.map((mask) =>  ({src: configData.API_URL+`/upload/${datasetId}/${mask.blend_img_file}`, value: mask.id}))}
                      onPick={onPick}
                      />}   
                    </div>
                    {/* <ImagePicker 
                      images={masks.map((mask) => (mask.id===null?{src: mask.blend_img_file, value: mask.id}
                        :{src: configData.API_URL+`/upload/${datasetId}/${mask.blend_img_file}`, value: mask.id}))}
                      onPick={onPick}
                    /> */}
                </div>
              </div>
              <br/>
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

export default CreateRegistration