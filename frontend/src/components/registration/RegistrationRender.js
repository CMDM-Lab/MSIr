import React, { useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router'
import Banner from '../public/Banner'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import {handleResponse} from "../../utils/handleResponse"
import registrationService from '../../services/registration_service'
import url from '../../config/url'
import running from '../../stylesheet/running.png'

const RegistrationRender = () => {

  const MySwal = withReactContent(Swal)
  const history = useHistory()
  const {datasetId, regId} = useParams()
  const [registration ,setRegistration] = useState({id:1,perform_type:'intensity',roi:{blend_img_file:'test_slide[2709].jpg'},result_file:'test_slide[2709].jpg',transform_matrix_file:'as',status:'running'})

  const getData = async () =>{
    try{
      const res = await registrationService.show({registrationId: regId})
      const {data} = res.data
        console.log(data)
        if (res.status >= 200 && res.status <300){
          setRegistration(data)
        } else{
          handleResponse(res,MySwal,history)
        }
    }catch(error){
      console.log(error) 
    }
  }

  useEffect(()=>{
    getData()
  },[])

  const handleDelete = async () =>{
    if (registration.status==='running'){
        await MySwal.fire({
            icon: 'error',
            title: 'Registration is running',
            text: 'Please retry after a while!',
          })
        return
    }
    MySwal.fire({
        icon: 'info',
        title: 'Are you sure to delete this?',
        text: 'Please confirm to delete this:',
        showCancelButton: true,
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
      }).then(async (result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
            try {
                const res = await registrationService.remove({registrationId:registration.id})
                if (res.status >= 200 && res.status <300){
                    history.go(0)
                } else{
                    handleResponse(res, MySwal, history)
                }
            } catch (error) {
                console.log(error)
            }
        }   
    })
}

    return (
    <>
    <Banner title={'Registration Result'} />
    <section className="challange_area">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-2 col-3" />
            <div className="col-lg-8 col-8" style={{paddingLeft: 0}}>
              <ol className="breadcrumb">
                <li className="breadcrumb-item"><a href="/">Home</a></li>
                <li className="breadcrumb-item"><a href="/datasets">Datasets</a></li>
                <li className="breadcrumb-item"><a href={`/datasets/${datasetId}`}>Dataset ID: {datasetId}</a></li>
                <li className="breadcrumb-item"><a href={`/datasets/${datasetId}/registrations`}>Registrations</a></li>
                <li className="breadcrumb-item active"><a>Registration ID: {regId}</a></li>
              </ol>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-2 col-md-2">
              <div className="challange_text_inner">
                <div className="l_title">
                  <h6>Quick menu</h6>
                  <div className="btn-group-vertical">
                    <a className="btn btn-primary" href={`/datasets/${datasetId}/registrations/new`}>New Registration</a>
                    <a className="btn btn-secondary" href={`/datasets/${datasetId}/registrations`}>Registration List</a>
                    <a className="btn btn-secondary" href={`/datasets/${datasetId}`}>Back to Dataset</a>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-md-9">
              {
                registration? registration.status==='finish'?
                <img className="img-fluid img-thumbnail" src={url.API_URL+`/upload/${datasetId}/${registration.result_file}`} />:
                <img className="img-fluid img-thumbnail" src={running} />:null
              }
              
              <br />
            </div>
            <div className="col-lg-6 col-md-12 coregistration_info">
              <h2>Detail information</h2>
              <table className="table">
                <tbody>
                  <tr>
                    <td width='40%'>Dataset ID:</td>
                    <td width='60%'>{datasetId}<br /></td>
                  </tr>
                  <tr>
                    <td>Status</td>
                    <td>{registration.status}</td>
                  </tr>
                  <tr>
                    <td>Registration type:</td>
                    <td>{registration.perform_type}</td>
                  </tr><tr>
                    <td>Mask image:</td>
                    <td><a href={url.API_URL+`/upload/${datasetId}/${registration.roi.blend_img_file}`}><button className="btn btn-outline-primary">View</button></a></td>
                  </tr>
                  
                  </tbody></table>
              <h3>Operations</h3>
              <table className="table">
                <tbody>
                  <tr>
                    <td width='40%'>Transform Matrix:</td>
                    <td width='60%'>
                      <a className='col-lg-6 col-6' href={url.API_URL+`/upload/${datasetId}/${registration.transform_matrix_file}`}>
                        <button className="btn btn-outline-primary">
                          Download
                        </button>
                      </a><br/>
                    </td>
                  </tr>
                  <tr>
                    <td>Delete:</td>
                    <td>
                      <button className="btn btn-outline-danger" onClick={handleDelete}>
                          DELETE
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
      </>
    )
}

export default RegistrationRender