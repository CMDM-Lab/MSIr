import React from "react";
import url from '../../config/url'
import running from '../../stylesheet/running.png'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { useHistory } from "react-router";
import { handleResponse } from "../../utils/handleResponse";
import extractionService from "../../services/extraction_service";

const ExtractionItem = ({datasetId,extraction}) =>{

    const MySwal = withReactContent(Swal)
    const history = useHistory()

    const handleDelete = async () =>{
        if (extraction.status==='running'){
            await MySwal.fire({
                icon: 'error',
                title: 'Extraction is running',
                text: 'Please retry after a while!',
              })
            return
        }
        MySwal.fire({
            icon: 'info',
            title: 'Are you sure to delete this?',
            text: 'Please confirm to delete this:',
            showCancelButton: true,
            confirmButtonText: 'Confirm',
            cancelButtonText: 'Cancel',
          }).then(async (result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
                try {
                    const res = await extractionService.remove({extractionId:extraction.id})
                    if (res.status >= 200 && res.status <300){
                        history.go(0)
                    } else{
                        handleResponse(res, MySwal, history)
                    }
                } catch (error) {
                    console.log(error)
                }
            }   
        })
    }

    return (
        <tr>
            <td>
                <div className="btn btn-success">ID: {extraction.id}</div><br /><br />
                <p>Data Normalization Type: {extraction.normaliztion}</p>
                
            </td>
            <td>
                <a href={`/datasets/${datasetId}/registrations/${extraction.registrationId}`}><p>Registration ID: {extraction.registrationId}</p></a>
                <img className="img-fluid img-thumbnail" src={url.API_URL+`/upload/${datasetId}/${extraction.registration.result_file}`}/>
            </td>
            <td>
                <img className="img-fluid img-thumbnail" src={url.API_URL+`/upload/${datasetId}/${extraction.roi.blend_img_file}`}  />
            </td>
            <td>{extraction.status}</td>
            <td>
                <div className="btn-group ">
                    {
                        extraction.status === 'finish'?
                            (<>
                                <a href={url.API_URL+`/upload/${datasetId}/${extraction.extract_file}`} className='col-lg-6 col-6'>
                                    <button className="btn btn-outline-primary">
                                        Download Result 
                                    </button>
                                </a>
                                <button className="delete-object btn btn-outline-danger col-lg-6 col-6" onClick={handleDelete}>Delete</button>
                            </>
                            ):null
                    }
                    
                </div>
            </td>
        </tr>
    )
}

export default ExtractionItem