import React from 'react'
import { useParams } from 'react-router'

const RegistrationRender = () => {

  const {projectId} = useParams()

    return (
    <section className="challange_area">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-2 col-3" />
            <div className="col-lg-6 col-6" style={{paddingLeft: 0}}>
              <ol className="breadcrumb">
                <li className="breadcrumb-item"><a href="/">Home</a></li>
                <li className="breadcrumb-item"><a href="/projects">Projects</a></li>
                <li className="breadcrumb-item"><a href={`/projects/${projectId}`}>{''}Project Name</a></li>
                <li className="breadcrumb-item"><a href={`/projects/${projectId}/registrations`}>Registrations</a></li>
                <li className="breadcrumb-item active"><a>{/*RegistrationId*/}</a></li>
              </ol>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-2 col-md-2">
              <div className="challange_text_inner">
                <div className="l_title">
                  <h6>Quick menu</h6>
                  <div className="btn-group-vertical">
                    <a className="btn btn-primary" href={`/projects/${projectId}/registrations/new`}>New Registration</a>
                    <a className="btn btn-secondary" href={`/projects/${projectId}/registrations`}>Registration List</a>
                    <a className="btn btn-secondary" href={`/projects/${projectId}`}>Back to Project</a>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-md-9">
              <br />
              <button className="btn btn-outline-primary">
                <i className="fad fa-cloud-download" />
                Download
              </button>
            </div>
            <div className="col-lg-7 col-md-12 coregistration_info">
              <h2>Detail information</h2>
              <table className="table">
                <tbody><tr>
                    <td>Project:</td>
                    <td>{}<br /></td>
                  </tr>
                  <tr>
                    <td>Status</td>
                    <td>{}</td>
                  </tr>
                  <tr>
                    <td>Registration type:</td>
                    <td>{}</td>
                  </tr><tr>
                    <td>Mask image:</td>
                    <td>{}</td>
                  </tr>
                  <tr>
                    <td>Operation:</td>
                    <td>{}</td>
                  </tr>
                  </tbody></table>
            </div>
          </div>
        </div>
      </section>
    )
}

export default RegistrationRender