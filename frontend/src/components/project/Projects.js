import React from 'react'
import ProjectInform from './ProjectInform'

const Projects = async (prop)=>{

  const userDetails = useAuthState()

  //const data = await

  return (
    <section className="challange_area">
      <div className="container-fluid">
        <div className="row">
          <div className="col-lg-2 col-2" />
          <div className="col-lg-6 col-10" style={{paddingLeft: 0}}>
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <a href='/'>Home</a>
              </li>
              <li className="breadcrumb-item">
                <a href='/projects'>Projects</a>
              </li></ol></div></div>
        <div className="row">
          <div className="col-lg-2">
            <div className="challange_text_inner">
              <div className="l_title">
                {/*<span className="fa-stack fa-2x">
                                    <i className="fad fa-square fa-stack-2x" data-fa-transform="rotate-60" style={{-faPrimaryColor: '#A268C6', -faSecondaryColor: '#A268C6'}} />
                                    <i className="fad fa-square fa-stack-2x fa-inverse" data-fa-transform="rotate-30 shrink-1 left-1" style={{-faPrimaryColor: '#72BBDE', -faSecondaryColor: '#72BBDE'}} />
                </span>*/}
                <h6>Quick menu</h6>
                <div className="btn-group-vertical">
                  <a className='btn btn-warning' onClick={}>Import an example</a>
                  <a className='btn btn-primary' href=''>New Project</a>
                  <a className='btn btn-danger' onClick={}>Delete All Projects</a>
                </div></div></div></div>
          <div className="col-lg-10">
            {}
            <table className="table object_list">
              <thead>
                <tr>
                  <th>Project name / Project info</th>
                  <th>Parameters for noise removal</th>
                  <th>Operations</th>
                </tr>
              </thead>
              <tbody>
                {}
              </tbody>
              </table></div></div></div></section>

    )
}