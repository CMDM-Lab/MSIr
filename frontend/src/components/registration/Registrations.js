import React, { useEffect, useState } from "react"
import { useParams, useHistory } from "react-router"
import registrationService from "../../services/registration_service"
import Banner from "../public/Banner"
import RegistrationItem from "./RegistrationItem"
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { handleResponse } from "../../utils/handleResponse"
import { Link } from "react-router-dom"

const Registrations = () => {

  const MySwal = withReactContent(Swal)

  const { datasetId } = useParams()
  const history = useHistory()
  const [registrations, setRegistrations] = useState([])

  const getData = async () => {
    try {
      const res = await registrationService.all({ datasetId })
      const { data } = res.data
      console.log(data)
      if (res.status >= 200 && res.status < 300) {
        setRegistrations(data)
      } else {
        handleResponse(res, MySwal, history)
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
      <Banner title={'Registration List'} />
      <section className="challange_area">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-1 col-1 ms-3" />
            <div className="col-lg-6 col-6" style={{ paddingLeft: 0 }}>
              <ol className="breadcrumb">
                <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                <li className="breadcrumb-item"><Link to="/datasets">Datasets</Link></li>
                <li className="breadcrumb-item"><Link to={`/datasets/${datasetId}`}>Dataset ID: {datasetId}</Link></li>
                <li className="breadcrumb-item active">Registrations</li>
              </ol>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-1 ms-3">
              <div className="challange_text_inner">
                <div className="l_title">
                  <h6>Quick menu</h6>
                  <div className="btn-group-vertical">
                    <Link className="btn btn-primary" to={`/datasets/${datasetId}/registrations/new`}>New Registration</Link>
                    <Link className="btn btn-secondary" to={`/datasets/${datasetId}`}>Back to dataset</Link>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-10">
              <table className="table">
                <thead>
                  <tr>
                    <th width="20%">Registration ID</th>
                    <th width="25%">Histology Image with Mask</th>
                    <th width="25%">Evaluation Image</th>
                    <th >Status</th>
                    <th width="25%">Operation</th>
                  </tr></thead>
                <tbody>
                  {registrations.length > 0 ? registrations.map((registration) => {
                    return <RegistrationItem registration={registration} datasetId={datasetId} />
                  }) : <tr>
                    <td>
                      <p>No Registration</p>
                    </td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                  </tr>}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default Registrations