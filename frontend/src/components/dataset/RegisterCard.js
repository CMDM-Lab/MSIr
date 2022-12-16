import React from "react";
import configData from '../../config.json'
import running from '../../stylesheet/running.png';

const RegisterCard = ({registerData}) =>{

    return (
        <div className='card mb-3'>
            {
                registerData.result_file?(
                    <div className='row no-gutters'>
                        <div className='col-6'>
                            <img className='card-img-top' src={configData.API_URL+`/upload/${registerData.datasetId}/${registerData.result_file}`} alt='The blended result between a histology and the registered MSI visualization '/>
                        </div>
                        <div className='col-6'>
                            <div className='card-body'>
                                {/* <a href={`/datasets/${registerData.datasetId}/registrations/${registerData.id}`}> */}
                                    <h5 className='card-title'>
                                        ID: {registerData.id}
                                    </h5>
                                {/* </a> */}
                                <br/>
                                <h6><b>Registration Type</b>: {registerData.perform_type}</h6>
                                <br/>
                                {
                                    registerData.perform_type === 'intensity'?(
                                    <h6><b>Dimensional Reduction</b>: {registerData.DR_method}</h6>
                                    ):null
                                }
                                <br/>
                                {/* <a href={`/datasets/${registerData.datasetId}/registrations/${registerData.id}`}>
                                        <button className='btn btn-outline-primary'>Detail</button>
                                </a>
                                <br/> */}
                                {/* <h6><b>Mask Image:&ensp;</b><br/>
                                {
                                    registerData?.histologyroi?.blend_img_file?
                                    <a className="btn btn-primary btn-sm" href={configData.API_URL+`/upload/${registerData.datasetId}/${registerData.histologyroi.blend_img_file}`}>
                                        Download
                                    </a>:
                                    <p>Generating!</p>
                                }
                                </h6>
                                <br/> */}
                                <h6><b>Transform Matrix:&ensp;</b></h6>
                                {
                                    registerData?.transform_matrix_file?
                                    <><a className='btn btn-dark btn-sm' href={configData.API_URL+`/upload/${registerData.datasetId}/${registerData.transform_matrix_file}`}>
                                        Download
                                    </a>
                                    <br/></>:<p>Generating!</p>
                                }
                            </div>
                        </div>
                        <br/>
                        <div class="text-center">
                        <p>See the Docs page for a description of transform matrix</p>
                        </div>
                    </div>
                    
                ):(
                    <div className='row no-gutters'>
                        <div className='col-6'>
                            <a href={`/datasets/${registerData.datasetId}/registrations/${registerData.id}`}>
                                <div>
                                    <img className='card-img-top' src={running} alt='Job running'/>
                                </div>
                            </a>
                        </div>
                        <div className='col-6'>
                            <div className='card-body'>
                                <h5><b>Status: </b>{registerData.status}</h5>
                                <br/>
                                {/* <a href={`/datasets/${registerData.datasetId}/registrations/${registerData.id}`}> */}
                                <h6 className='card-title'>ID: {registerData.id}</h6>
                                   
                                {/* </a> */}
                                <br/>
                                <h6><b>Registration Type</b>: {registerData.perform_type}</h6>
                                <br/>
                                {
                                    registerData.perform_type === 'intensity' ?(
                                    <h6><b>Dimensional Reduction</b>: {registerData.DR_method}</h6>
                                    ):null
                                }
                                <br/>
                                <h6><b>Status</b>: {registerData.status}</h6>
                                
                            </div>
                        </div>
                    </div>
                )
            }
        </div>
    )
    
}

export default RegisterCard