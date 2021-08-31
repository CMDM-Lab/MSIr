import React from "react"
import { Button } from "bootstrap"
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import datasetService from "../../services/datasets_service"
import { useHistory } from "react-router-dom"

const DatasetItem = ({data})=>{

    const MySwal = withReactContent(Swal)
    const history = useHistory()
    const handleDelete = async () =>{
        try {
            const res = await datasetService.remove({datasetId: data.id})
            if (res.status >= 200 && res.status <300){
                MySwal.fire({
                    icon: 'success',
                    title: `${res.data.message}`,
                }).then(
                    window.location.reload()
                )
            } else{
                switch(res.status){
                    case 404:
                    case 401:
                        MySwal.fire({
                            icon: 'error',
                            title: `${res.data.message}`,
                        })
                        break
                    case 403:
                        MySwal.fire({
                            icon: 'error',
                            title: `${res.data.message}`,
                        }).then(()=>{
                            history.push('/users/sign_in')
                        })
                        break
                    case 500:
                        MySwal.fire({
                            icon: 'error',
                            title: `${res.data.message}`,
                            text: `Please retry after a while. (${res.data.message})`,
                          })
                        break
                }
            }
        } catch (error) {
            console.log(error)
        }
    }

    if (!data){
        return (
            <>
                <tr>
                    <td colSpan={3}>
                      <b>No datasets.</b>
                      <i className="fad fa-arrow-right" />
                      <a href=''></a>
                    </td>
                </tr>
            </>
        )
    }

    return (
        <>
            <tr>
                <td style={{width: '60%'}}>
                    <a href={`/datasets/${data.id}`}><h4>Name: {data.name}</h4></a>
                    <p>Description: {data.description}</p>
                    {/*<table className="table" style={{fontSize: '1em'}}>
                        <tbody>
                            <tr>
                                <td colSpan={3}>Pixel size</td>
                            </tr>
                            <tr>
                                <td colSpan={2} style={{width: '70%'}}>X-axis:</td>
                                <td>{}</td>
                            </tr>
                            <tr>
                                <td colSpan={2} style={{width: '70%'}}>Y-axis:</td>
                                <td>{}</td>
                            </tr>
                        </tbody></table>*/}
                </td>
                {/*<td className="dataset_info">
                    <table className="table" style={{fontSize: '1em'}}>
                        <tbody><tr>
                            <td style={{width: '70%'}}>Normalization:</td>
                            <td>{}</td>
                          </tr>
                        </tbody></table>
                    </td>*/}
                <td style={{width: '40%'}}>
                    <button className='btn btn-outline-primary' style={{width:'30%', height:'80%'}} onClick={()=>history.push(`/datasets/${data.id}`)}>Display</button>
                    <button className='btn btn-outline-secondary' style={{width:'30%', height:'80%'}} onClick={()=>history.push(`/datasets/${data.id}/edit`)}>Edit</button>
                    <button className='delete-object btn btn-outline-danger' style={{width:'30%', height:'80%'}} onClick={handleDelete}>Delete</button>
                    {/*<table className="table" style={{fontSize: '1em'}}>
                        <tbody>
                            <tr><td style={{width: '20%'}}>
                                
                            </td></tr>
                            <tr><td style={{width: '20%'}}>
                                
                            </td></tr>
                            <tr><td style={{width: '20%'}}>
                                
                            </td></tr>
                </tbody></table>*/}
                </td>
            </tr>
        </>
    )
}
export default DatasetItem