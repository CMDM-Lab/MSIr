import React from "react";
import configData from '../../config.json'
import running from '../../stylesheet/running.png';

const ExtractCard = ({extractData}) =>{

    return (
        <div className='card mb-3'>
                    <div className='row no-gutters'>
                        <div className='col-6'>
                            {extractData?.histologyroi?.blend_img_file?(
                                <img className='card-img-top' src={configData.API_URL+`/upload/${extractData.datasetId}/${extractData.histologyroi.blend_img_file}`}/>
                            ):(
                                <img className='card-img-top' src={running}/>
                            )}
                                  
                        </div>
                        <div className='col-6'>
                            <div className='card-body'>
                                <h5 className='card-title'>
                                        ID: {extractData.id}
                                </h5>
                                <p>ROI ID: {extractData.histologyroiId}</p>
                                <p>Registration ID: {extractData.registrationId}</p>
                                {/*<p>Normalization: {extractData.normalization}</p>*/}
                                <p>Status: {extractData.status}</p>
                                {
                                    extractData.extract_file? 
                                    <a href={configData.API_URL+`/upload/${extractData.datasetId}/${extractData.extract_file}`}>
                                        <button className='btn btn-outline-primary'>Download</button>
                                    </a>
                                    :null
                                }
                                
                            </div>
                        </div>
                    </div>
        </div>
    )
    
}

export default ExtractCard