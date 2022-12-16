import React from "react"
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import datasetService from "../../services/datasets_service"
import { useHistory } from "react-router-dom"
import { handleResponse } from "../../utils/handleResponse"

const DatasetItem = ({data})=>{

    const MySwal = withReactContent(Swal)
    const history = useHistory()
    const handleDelete = async () =>{
        MySwal.fire({
            type: 'info',
            title: 'Are you sure to delete this?',
            text: 'Please confirm to delete this:',
            showCancelButton: true,
            confirmButtonText: 'Confirm',
            cancelButtonText: 'Cancel',
            confirmButtonColor: '#000000'
          }).then(async (result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
                try {
                    const res = await datasetService.remove({datasetId: data.id})
                    if (res.status >= 200 && res.status <300){
                        history.go(0)
                    } else{
                        handleResponse(res,MySwal,history)
                    }
                } catch (error) {
                    console.log(error)
                }
            }   
        })
    }

    if (!data){
        return (
            <>
                <tr>
                    <td colSpan={3}>
                      <b>No datasets.</b>
                      <i className="fad fa-arrow-right" />
                    </td>
                </tr>
            </>
        )
    }

    return (
        <>
            <tr>
                <td style={{width: '20%'}}>
                    {/* <a href={`/datasets/${data.id}`}> */}
                        <h5>{data.name}</h5>
                    {/* </a> */}
                </td>
                <td style={{width:'40%'}}>
                    <p>{data.description}</p> 
                </td>
                <td style={{width: '40%'}}>
                    <button className='btn btn-outline-dark' style={{width:'30%', height:'80%'}} onClick={()=>history.push(`/datasets/${data.id}`)}>Display</button>
                    <button className='btn btn-outline-dark' style={{width:'30%', height:'80%'}} onClick={()=>history.push(`/datasets/${data.id}/edit`)}>Edit</button>
                    <button className='delete-object btn btn-outline-dark' style={{width:'30%', height:'80%'}} onClick={handleDelete}>Delete</button>
                </td>
            </tr>
        </>
    )
}
export default DatasetItem