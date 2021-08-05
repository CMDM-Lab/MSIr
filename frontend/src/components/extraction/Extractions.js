import React from "react"

const Extractions = () => {

    return (
        <section className="challange_area">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-1 col-3 ms-3" />
            <div className="col-lg-6 col-6" style={{paddingLeft: 0}}>
              <ol className="breadcrumb">
                <li className="breadcrumb-item"><a href="/">Home</a></li>
                <li className="breadcrumb-item"><a href="/projects">Projects</a></li>
                <li className="breadcrumb-item"><a href={''}>{''}</a></li>
                <li className="breadcrumb-item active"><a href="/registrations">Extractions</a></li>
              </ol>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-1 ms-3">
              <div className="challange_text_inner">
                <div className="l_title">
                  <h6>Quick menu</h6>
                  <div className="btn-group-vertical">
                    <a className="btn btn-primary" href={''}>New Extraction</a>
                    <a className="btn btn-secondary" href={''}>Back to project</a>
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
                <tbody><tr>
                    <td>
                      <a className="btn btn-success" href="/registrations/1">
                        ID: {}
                      </a><br />
                      <br />
                      Registration Id: {}
                      Data Normalization Type: {}
                      <br />
                    </td>
                    <td>
                        <img alt={''} className="img-fluid img-thumbnail" src={''} />
                    </td>
                    <td>{}</td>
                    <td>
                      <div className="btn-group">
                        <a href={''}><button className="btn btn-outline-primary">
                            Download Extraction Data 
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
    )
}

export default Extractions