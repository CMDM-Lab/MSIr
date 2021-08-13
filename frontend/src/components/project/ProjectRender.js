import React from 'react'
import { useParams } from 'react-router'
import { useAuthState } from '../../services/auth_service'

const ProjectRender = (props) => {

    //const {projectId} = useParams()
    const userDetails = useAuthState()

    const data_project = ''
    const data_registration =''
    const data_extraction = ''

    return (
    <section className="challange_area">
      <div className="container-fluid">
        <div className="row">
          <div className="col-lg-1 col-1" />
          <div className="col-lg-6 col-10" style={{paddingLeft: 0}}>
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <a href='/'>Home</a>
              </li>
              <li className="breadcrumb-item">
                <a href='/projects'>Projects</a>
              </li>
              <li className="breadcrumb-item">
                <a href={`/projects/${'as'}`}>{}</a>
              </li>
              </ol></div></div>
        <div className="row">
            <div className="col-lg-1 col-1" />
            <div className='col-lg-5 col-sm-12 project_info border-end'>
                <h3>
                    Project details {' '}
                    <div className='btn-group'>
                        <a className='btn btn-secondary text-left' style={{'color':'white'}} href=''>
                            Edit
                        </a>
                    </div>
                </h3>
                <ol>
                    <li>Pixel size:{} um</li>
                    <li>Normalization: {}</li>
                </ol>
                <h3>MSI data</h3>
                <ol>
                    <li>imzML:{}</li>
                    <li>ibd:{}</li>
                </ol>
                <h3>Histological Image</h3>
                <img></img>
            </div>
            <div className='col-lg-3 col-sm-12 border-end'>
                <h3>Registrations</h3>
                <div className='btn-group'>
                    <a className='btn btn-info text-left' style={{'color':'white'}} href=''>
                        New Registration
                    </a>
                    <a className='btn btn-secondary text-left' style={{'color':'white'}} href=''>
                        All Registrations
                    </a>
                </div>
                {data_registration?(<div></div>):(<p>No Registration Result</p>)}
            </div>
            <div className='col-lg-3 col-sm-12'>
                <h3>Data Extractions</h3>
                <div className='btn-group'>
                    <a className='btn btn-info text-left' style={{'color':'white'}} href=''>
                        New Extraction
                    </a>
                    <a className='btn btn-secondary text-left' style={{'color':'white'}} href=''>
                        <i className='fad fa-th-list fa-lg'></i>
                        All Extractions
                    </a>
                </div>
                {data_extraction?(<div></div>):(<p>No Extraction Result</p>)}
            </div>
        </div>
      </div>
    </section>
    )
}

export default ProjectRender