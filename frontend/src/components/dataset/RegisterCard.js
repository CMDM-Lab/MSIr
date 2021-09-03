import React from "react";
import url from '../../config/url'
import running from '../../stylesheet/running.png';

const RegisterCard = ({registerData}) =>{

    return (
        <div className='card mb-3'>
            {
                registerData.result_file?(
                    <div className='row no-gutters'>
                        <div className='col-6'>
                            <img className='card-img-top' src={url.API_URL+`/upload/${registerData.datasetId}/${registerData.result_file}`}/>
                        </div>
                        <div className='col-6'>
                            <div className='card-body'>
                                <a href={`/datasets/${registerData.datasetId}/registrations/${registerData.id}`}>
                                    <h5 className='card-title'>
                                        ID: {registerData.id}
                                    </h5>
                                </a>
                                <p>Registration Type: {registerData.perform_type}</p>
                            </div>
                        </div>
                    </div>
                    
                ):(
                    <div className='row no-gutters'>
                        <div className='col-6'>
                            <a href={`/datasets/${registerData.datasetId}/registrations/${registerData.id}`}>
                                <div>
                                    <img className='card-img-top' src={running}/>
                                </div>
                            </a>
                        </div>
                        <div className='col-6'>
                            <div className='card-body'>
                                <a href={`/datasets/${registerData.datasetId}/registrations/${registerData.id}`}>
                                    <h5 className='card-title'>ID: {registerData.id}</h5>
                                   
                                </a>
                                <p>Registration Type: {registerData.perform_type}</p>
                                <p>Status: {registerData.status}</p>
                                
                            </div>
                        </div>
                    </div>
                )
            }
        </div>
    )
    
}

export default RegisterCard