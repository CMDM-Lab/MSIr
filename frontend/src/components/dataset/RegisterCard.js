import React from "react";
import { Link } from "react-router-dom";
import configData from '../../config.json'
import running from '../../stylesheet/running.png';

const RegisterCard = ({ registerData }) => {

    return (
        <div className='card mb-3'>
            {
                registerData.result_file ? (
                    <div className='row no-gutters'>
                        <div className='col-6'>
                            <img className='card-img-top' src={configData.API_URL + `/upload/${registerData.datasetId}/${registerData.result_file}`} alt='The blended result between a histology and the registered MSI visualization ' />
                        </div>
                        <div className='col-6'>
                            <div className='card-body'>
                                <Link to={`/datasets/${registerData.datasetId}/registrations/${registerData.id}`}>
                                    <h5 className='card-title'>
                                        ID: {registerData.id}
                                    </h5>
                                </Link>
                                <p><b>Registration Type</b>: {registerData.perform_type}</p>
                                {
                                    registerData.perform_type === 'intensity' ? (
                                        <p><b>Dimensional Reduction</b>: {registerData.DR_method}</p>
                                    ) : null
                                }
                            </div>
                        </div>
                    </div>

                ) : (
                    <div className='row no-gutters'>
                        <div className='col-6'>
                            <Link to={`/datasets/${registerData.datasetId}/registrations/${registerData.id}`}>
                                <div>
                                    <img className='card-img-top' src={running} alt='Job running' />
                                </div>
                            </Link>
                        </div>
                        <div className='col-6'>
                            <div className='card-body'>
                                <Link to={`/datasets/${registerData.datasetId}/registrations/${registerData.id}`}>
                                    <h5 className='card-title'>ID: {registerData.id}</h5>

                                </Link>
                                <p><b>Registration Type</b>: {registerData.perform_type}</p>
                                {
                                    registerData.perform_type === 'intensity' ? (
                                        <p><b>Dimensional Reduction</b>: {registerData.DR_method}</p>
                                    ) : null
                                }
                                <p><b>Status</b>: {registerData.status}</p>

                            </div>
                        </div>
                    </div>
                )
            }
        </div>
    )

}

export default RegisterCard