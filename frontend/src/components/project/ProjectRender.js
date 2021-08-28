import React from 'react'
import { useParams } from 'react-router'
import { useAuthState } from '../../services/auth_service'
import Banner from '../public/Banner'

const ProjectRender = (props) => {

    const {projectId} = useParams()
    const userDetails = useAuthState()
    

    const data_project = ''
    const data_registration =''
    const data_extraction = ''

    return (
    <>
    <Banner title={'Project Name'} />
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
                <a>{}Project Name</a>
              </li>
              </ol></div></div>
        <div className="row">
            <div className="col-lg-1 col-1" />
            <div className='col-lg-5 col-sm-12 project_info border-end'>
                <h3>
                    Project details {' '}{projectId}
                    <div className='btn-group'>
                        <a className='btn btn-secondary text-left' style={{'color':'white'}} href={`/projects/${projectId}/edit`}>
                            Edit
                        </a>
                    </div>
                </h3>
                <ol>
                    <li>Project Name:{}</li>
                    <li>Project Description:{}</li>
                </ol>
                <h3>
                    MSI data
                    <div className='btn-group'>
                        <a className='btn btn-secondary text-left' style={{'color':'white'}} href=''>
                            Edit
                        </a>
                    </div>
                </h3>
                <ol>
                    <li>imzML:{}</li>
                    <li>ibd:{}</li>
                </ol>
                <h3>
                    Histological Image
                    <div className='btn-group'>
                        <a className='btn btn-secondary text-left' style={{'color':'white'}} href=''>
                            Edit
                        </a>
                    </div>
                </h3>
                <img></img>
            </div>
            <div className='col-lg-3 col-sm-12 border-end'>
                <h3>Registrations</h3>
                <div className='btn-group'>
                    <a className='btn btn-info text-left' style={{'color':'white'}} href={`/projects/${projectId}/registrations/new`}>
                        New Registration
                    </a>
                    <a className='btn btn-secondary text-left' style={{'color':'white'}} href={`/projects/${projectId}/registrations`}>
                        All Registrations
                    </a>
                </div>
                {data_registration?(<div></div>):(<p>No Registration Result</p>)}
            </div>
            <div className='col-lg-3 col-sm-12'>
                <h3>Data Extractions</h3>
                <div className='btn-group'>
                    <a className='btn btn-info text-left' style={{'color':'white'}} href={`/projects/${projectId}/extractions/new`}>
                        New Extraction
                    </a>
                    <a className='btn btn-secondary text-left' style={{'color':'white'}} href={`/projects/${projectId}/extractions`}>
                        <i className='fad fa-th-list fa-lg'></i>
                        All Extractions
                    </a>
                </div>
                {data_extraction?(<div></div>):(<p>No Extraction Result</p>)}
            </div>
        </div>
      </div>
    </section>
    </>
    )
}

export default ProjectRender