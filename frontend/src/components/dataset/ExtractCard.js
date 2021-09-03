import React from "react";
import url from '../../config/url'
import running from '../../stylesheet/running.png';

const ExtractCard = ({extractData}) =>{

    return (
        <div className='card mb-3'>
                    <div className='row no-gutters'>
                        <div className='col-6'>
                            {extractData.roi.blend_img_file?(
                                <img className='card-img-top' src={url.API_URL+`/upload/${extractData.datasetId}/${extractData.roi.blend_img_file}`}/>
                            ):(
                                <img className='card-img-top' src={running}/>
                            )}
                                  
                        </div>
                        <div className='col-6'>
                            <div className='card-body'>
                                <a href={`/datasets/${extractData.datasetId}/extrations/${extractData.id}`}>
                                    <h5 className='card-title'>
                                        ID: {extractData.id}
                                    </h5>
                                </a>
                                <p>ROI ID: {extractData.histologyroiId}</p>
                                <p>Registration ID: {extractData.registerationId}</p>
                                <p>Normalization: {extractData.normalization}</p>
                                <p>Status: {extractData.status}</p>
                                {
                                    extractData.extract_file? 
                                    <a href={url.API_URL+`/upload/${extractData.datasetId}/${extractData.extract_file}`}>
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