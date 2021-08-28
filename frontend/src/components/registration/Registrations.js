import React from "react"
import { useParams } from "react-router"
import Banner from "../public/Banner"

const Registrations = () => {

    const {projectId} = useParams()

    return (
      <>
      <Banner title={'Registration List'} />
        <section className="challange_area">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-2 col-3 ms-3" />
            <div className="col-lg-6 col-6" style={{paddingLeft: 0}}>
              <ol className="breadcrumb">
                <li className="breadcrumb-item"><a href="/">Home</a></li>
                <li className="breadcrumb-item"><a href="/projects">Projects</a></li>
                <li className="breadcrumb-item"><a href={`/projects/${projectId}`}>{''}Project Name</a></li>
                <li className="breadcrumb-item active"><a>Registrations</a></li>
              </ol>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-1 ms-3">
              <div className="challange_text_inner">
                <div className="l_title">
                  <h6>Quick menu</h6>
                  <div className="btn-group-vertical">
                    <a className="btn btn-primary" href={`/projects/${projectId}/registrations/new`}>New Registration</a>
                    <a className="btn btn-secondary" href={`/projects/${projectId}`}>Back to project</a>
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
                <tbody><tr>
                    <td>
                      <a className="btn btn-success" href={`/projects/${projectId}/registrations/`}>
                        ID: {}
                      </a><br />
                      <br />
                      <li>Registration type: {}</li>
                      <br />
                    </td>
                    <td>
                        <img alt={''} className="img-fluid img-thumbnail" src={''} />
                    </td>
                    <td>
                      <img alt={''} className="img-fluid img-thumbnail viewer" src={''} />
                    </td>
                    <td>{}</td>
                    <td>
                      <div className="btn-group">
                        <a href={''}><button className="btn btn-outline-primary">
                          <i className="fad fa-cloud-download" />
                            Download Transform Matrix 
                          </button></a>
                        <a className="delete-object btn btn-outline-danger" data-tippy-content="<i class='fad fa-file-minus fa-2x msi-icon'></i> Delete this image" data-id={1} data-object="registration" title="Delete this registration" href="/delete_registration"><svg className="svg-inline--fa fa-trash-alt fa-w-14 fa-2x" data-fa-transform="shrink-5" aria-hidden="true" focusable="false" data-prefix="fal" data-icon="trash-alt" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" data-fa-i2svg style={{transformOrigin: '0.4375em 0.5em'}}><g transform="translate(224 256)"><g transform="translate(0, 0)  scale(0.6875, 0.6875)  rotate(0 0 0)"><path fill="currentColor" d="M296 432h16a8 8 0 0 0 8-8V152a8 8 0 0 0-8-8h-16a8 8 0 0 0-8 8v272a8 8 0 0 0 8 8zm-160 0h16a8 8 0 0 0 8-8V152a8 8 0 0 0-8-8h-16a8 8 0 0 0-8 8v272a8 8 0 0 0 8 8zM440 64H336l-33.6-44.8A48 48 0 0 0 264 0h-80a48 48 0 0 0-38.4 19.2L112 64H8a8 8 0 0 0-8 8v16a8 8 0 0 0 8 8h24v368a48 48 0 0 0 48 48h288a48 48 0 0 0 48-48V96h24a8 8 0 0 0 8-8V72a8 8 0 0 0-8-8zM171.2 38.4A16.1 16.1 0 0 1 184 32h80a16.1 16.1 0 0 1 12.8 6.4L296 64H152zM384 464a16 16 0 0 1-16 16H80a16 16 0 0 1-16-16V96h320zm-168-32h16a8 8 0 0 0 8-8V152a8 8 0 0 0-8-8h-16a8 8 0 0 0-8 8v272a8 8 0 0 0 8 8z" transform="translate(-224 -256)" /></g></g></svg>{/* <i class="fal fa-trash-alt fa-2x" data-fa-transform="shrink-5"></i> Font Awesome fontawesome.com */}
                        </a></div>
                    </td>
                  </tr>
                </tbody></table>
            </div>
          </div>
        </div>
      </section>
      </>
    )
}

export default Registrations