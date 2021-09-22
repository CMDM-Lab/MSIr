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

const CreateRegistration = () =>{
    
    const MySwal = withReactContent(Swal)

    const {datasetId} = useParams()
    const history = useHistory()

    const [maskId, setMaskId] = useState()
    const [regType, setRegType] = useState('intensity')
    const [masks, setMasks] = useState([{id:null, blend_img_file:not_select}])

    const getMask = async () =>{
      try {
        const res = await roi_service.allmask({datasetId})
        const {data} = res.data
        console.log(data)
        if (res.status >= 200 && res.status <300){
          var newMasks = masks
          newMasks = newMasks.concat(data)
          console.log(newMasks)
          setMasks(newMasks)
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

    const onPick = (img) => {
        setMaskId(img.value)
    }

    const handleSubmit = async (e) => {
      try {
        const res = await registrationService.create({
          perform_type: regType,
          datasetId: Number(datasetId),
          histologyroiId: maskId
        })
        console.log(res)
        const data = res.data
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
                    <a>Create a Registration</a>
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
              <div className="form-group row">
                <label className="col-3 col-form-label">Select the mask of histology image</label>
                <div className="col-9">
                    <small className="form-text text-muted">
                            If there is not any mask to select, mask would be generated automatically.
                            If there are not satisfying mask, you can manually draw.
                    </small><br />
                    <ImagePicker 
                      images={masks.map((mask) => (mask.id===null?{src: mask.blend_img_file, value: mask.id}
                        :{src: configData.API_URL+`/upload/${datasetId}/${mask.blend_img_file}`, value: mask.id}))}
                      onPick={onPick}
                    />
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

export default CreateRegistration