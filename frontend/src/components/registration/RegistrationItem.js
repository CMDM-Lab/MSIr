import React from "react";
import url from '../../config/url'
import registrationService from "../../services/registration_service";
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { useHistory } from "react-router";
import { handleResponse } from "../../utils/handleResponse";

const RegistrationItem = ({datasetId, registration})=>{

    const MySwal = withReactContent(Swal)
    const history = useHistory()

    const handleDelete = async () =>{
        if (registration.status==='running'){
            await MySwal.fire({
                icon: 'error',
                title: 'Registration is running',
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
                    const res = await registrationService.remove({registrationId:registration.id})
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
                <a className="btn btn-success" href={`/datasets/${datasetId}/registrations/${registration.id}`}>
                    ID: {registration.id}
                </a><br />
                <br />
                <li>Registration type: {registration.perform_type}</li>
                <br />
            </td>
            <td>
                <img className="img-fluid img-thumbnail" src={url.API_URL+`/upload/${datasetId}/${registration.roi.blend_img_file}`} />
            </td>
            <td>
                <img className="img-fluid img-thumbnail viewer" src={url.API_URL+`/upload/${datasetId}/${registration.result_file}`} />
            </td>
            <td>
                <p>{registration.status}</p>
            </td>
            <td>
                <div className="btn-group">
                    {
                        registration.status === 'finish'?(
                            <a className='col-lg-6 col-6' href={url.API_URL+`/upload/${datasetId}/${registration.transform_matrix_file}`}>
                                <button className="btn btn-outline-primary">
                                    Download Transform Matrix 
                                </button>
                            </a>
                        ):null
                    }
                    <button className="delete-object btn btn-outline-danger col-lg-6 col-6" onClick={handleDelete} disabled={registration.status === 'running'}>Delete</button>
                </div>
            </td>
        </tr>
    )
}

export default RegistrationItem