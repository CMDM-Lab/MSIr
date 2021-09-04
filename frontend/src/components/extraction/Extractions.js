import React, { useState, useEffect } from "react"
import { useParams, useHistory } from "react-router"
import Banner from "../public/Banner"
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import {handleResponse} from "../../utils/handleResponse"
import extractionService from "../../services/extraction_service"

const Extractions = () => {

  const MySwal = withReactContent(Swal)

  const {datasetId} = useParams()
  const history = useHistory()
  const [extractions, setExtractions] = useState([])
  
  const getData = async ()=>{
    try {
      const res = await extractionService.all({datasetId})
      const {data} = res.data
      console.log(data)
      if (res.status >= 200 && res.status <300){
        setExtractions(data)
      } else{
        handleResponse(res,MySwal,history)
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
        <Banner title = {'Extraction List'} />
        <section className="challange_area">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-1 col-3 ms-3" />
            <div className="col-lg-6 col-6" style={{paddingLeft: 0}}>
              <ol className="breadcrumb">
                <li className="breadcrumb-item"><a href="/">Home</a></li>
                <li className="breadcrumb-item"><a href="/datasets">Datasets</a></li>
                <li className="breadcrumb-item"><a href={`/datasets/${datasetId}`}>Dataset ID: {datasetId}</a></li>
                <li className="breadcrumb-item active"><a>Extractions</a></li>
              </ol>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-1 ms-3">
              <div className="challange_text_inner">
                <div className="l_title">
                  <h6>Quick menu</h6>
                  <div className="btn-group-vertical">
                    <a className="btn btn-primary" href={`/datasets/${datasetId}/extractions/new`}>New Extraction</a>
                    <a className="btn btn-secondary" href={`/datasets/${datasetId}`}>Back to Dataset</a>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-10">
              <p></p>
              <table className="table">
                <thead>
                  <tr>
                    <th>Extraction ID</th>
                    <th width="20%">ROI Image</th>
                    <th>Status</th>
                    <th width="20%">Operation</th>
                  </tr></thead>
                <tbody>
                  {/* for loop to show */}
                  <tr>
                    <td>
                      <div className="btn btn-success">ID: {}</div><br /><br />
                      <li>Registration Id: {}</li>
                      <li>Data Normalization Type: {}</li>
                    </td>
                    <td>
                        <img alt={''} className="img-fluid img-thumbnail" src={''} />
                    </td>
                    <td>{}</td>
                    <td>
                      <div className="btn-group">
                        <a href={''} className='col-lg-6 col-6'><button className="btn btn-outline-primary">
                            Download Result Data 
                          </button></a>
                        <button className="delete-object btn btn-outline-danger col-lg-6 col-6">Delete</button>
                      </div>
                    </td>
                  </tr>
                  {/* for loop to show end*/}
                </tbody></table>
            </div>
          </div>
        </div>
      </section>
      </>
    )
}

export default Extractions