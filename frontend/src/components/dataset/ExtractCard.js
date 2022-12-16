import React from "react";
import configData from '../../config.json'
import running from '../../stylesheet/running.png';


const ExtractCard = ({extractData}) =>{

    return (
        <div className='card mb-3'>
                    <div className='row no-gutters'>
                        <div className='col-6'>
                            {extractData?.histologyroi?.blend_img_file?(
                                <img className='card-img-top' src={configData.API_URL+`/upload/${extractData.datasetId}/${extractData.histologyroi.blend_img_file}`} alt='A histology with ROI label'/>
                            ):(
                                <img className='card-img-top' src={running} alt='Job running'/>
                            )}
                                  
                        </div>
                        <div className='col-6'>
                            <div className='card-body'>
                                {/* <h5><b>Status: </b>{extractData.status}</h5> */}
                                <h5 className='card-title'>
                                    ID: {extractData.id}
                                </h5>
                                <br/>
                                <h6><b>Registration ID:</b> {extractData.registrationId}</h6>
                                <br/>
                                {/* <h6><b>ROI ID: </b>{extractData.histologyroiId}</h6>
                                <br/> */}
                                {/*<p>Normalization: {extractData.normalization}</p>*/}
                                <h6><b>Extraction Result:&ensp;</b></h6>
                                {
                                    extractData.extract_file? 
                                    <a href={configData.API_URL+`/upload/${extractData.datasetId}/${extractData.extract_file}`}>
                                        <button className='btn btn-dark btn-sm'>Download</button>
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