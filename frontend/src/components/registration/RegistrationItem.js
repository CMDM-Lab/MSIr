import React from "react";
import configData from '../../config.json'
import registrationService from "../../services/registration_service";
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { useHistory } from "react-router";
import { handleResponse } from "../../utils/handleResponse";
import running from '../../stylesheet/running.png';

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
        <tr key={registration.id}>
            <td>
                <a className="btn btn-success" href={`/datasets/${datasetId}/registrations/${registration.id}`}>
                    ID: {registration.id}
                </a><br />
                <br />
                <p><b>Registration type</b>: {registration.perform_type}</p>
                {
                    registration.perform_type === 'intensity'?
                    <p><b>Dimensional Reduction</b>: {registration.DR_method}</p>
                    :null
                }
                {
                    (registration.perform_type === 'intensity')&(registration.DR_method === 'UMAP')?
                    <p><b>Embedding Dimension</b>: {registration.n_dim}</p>
                    :null
                }
                <br />
            </td>
            <td>
                {
                    registration.histologyroi?
                    registration.histologyroi.blend_img_file?
                    <img className="img-fluid img-thumbnail" src={configData.API_URL+`/upload/${datasetId}/${registration.histologyroi.blend_img_file}`} alt='A histology with ROI label'/>:
                    <img className="img-fluid img-thumbnail" src={running} alt='Job running'/>
                    :<img className="img-fluid img-thumbnail" src={running} alt='Job running'/>
                    
                }
            </td>
            <td>
                {
                    registration.result_file?
                    <img className="img-fluid img-thumbnail viewer" src={configData.API_URL+`/upload/${datasetId}/${registration.result_file}`} alt='Registration result'/>
                    :<img className="img-fluid img-thumbnail" src={running} alt='Job running'/>
                }
                
            </td>
            <td>
                <p>{registration.status}</p>
            </td>
            <td>
                <div className="btn-group">
                    {
                        registration.status === 'finished'?(
                            <a className='col-lg-6 col-6' href={configData.API_URL+`/upload/${datasetId}/${registration.transform_matrix_file}`}>
                                <button className="btn btn-outline-primary">
                                    Transform Matrix 
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