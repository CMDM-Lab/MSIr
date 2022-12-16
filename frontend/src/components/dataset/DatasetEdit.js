import React, { useEffect,useState } from "react"
import { useParams } from 'react-router'
import { useHistory } from "react-router-dom"
import Banner from "../public/Banner"
import datasetService from "../../services/datasets_service"
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { handleResponse } from "../../utils/handleResponse"

const DatasetEdit = () => {
    const MySwal = withReactContent(Swal)

    const [name,setName] = useState('')
    const [description, setDescription] = useState('')
    const {datasetId} = useParams()
    const history = useHistory()

    const getData = async()=>{
        const res = await datasetService.show({datasetId})
        if (res.status >= 200 && res.status <300){
            setName(res.data.dataset.name)
            setDescription(res.data.dataset.description)
        } else{
            if (res.status===404){
                MySwal.fire({
                    icon: 'error',
                    iconColor: '#000000',
                    title: `${res.data.message}`,
                    confirmButtonColor: '#000000',
                }).then(()=>{
                    history.goBack()
                })
            }else{
               handleResponse(res,MySwal,history) 
            }
        }
    }

    useEffect( async ()=>{
        getData()
    },[])

    const onChangeName = (e)=>{
        const value = e.target.value;
        setName(value)
    }

    const onChangeDescription = (e)=>{
        const value = e.target.value;
        setDescription(value)
    }

    const handleSubmit = async () => {
        if (name.length<1){
            MySwal.fire({
                icon: 'error',
                iconColor: '#000000',
                title: 'Oops...',
                text: 'Please type a dataset name !',
                confirmButtonColor: '#000000',
            })
            return 
        }
        try {
            const res = await datasetService.edit({name, description, datasetId})
            if (res.status >= 200 && res.status <300){
                MySwal.fire({
                    icon: 'success',
                    iconColor: '#000000',
                    title: res.data.message,
                    confirmButtonText: 'OK',
                    confirmButtonColor: '#000000',
                  }).then(()=>{
                    history.goBack(); 
                  })
            }else{
                handleResponse(res, MySwal, history)
            }
        } catch (error) {
            MySwal.fire({
                icon: 'error',
                iconColor: '#000000',
                title: 'Oops...',
                text: error,
                confirmButtonColor: '#000000',
              })
        }
    }

    return (
    <>
    <Banner title = {'Edit this Dataset'} />
    <section className="challange_area">
        <div className="container-fluid">
            <div className="row">
                <div className="col-lg-2 col-3" />
                <div className="col-lg-10 col-9">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item">
                            <a href='/'>Home</a>
                        </li>
                        <li className="breadcrumb-item">
                            <a href='/datasets'>Datasets</a>
                        </li>
                        <li className="breadcrumb-item">
                            <a href={`/datasets/${datasetId}`}>Dataset ID: {datasetId}</a>
                        </li>
                        <li className="breadcrumb-item active">
                            Edit this dataset
                        </li>
                    </ol></div></div>
            <div className="form-group row py-2">
                <div className="col-lg-2 col-3" />
                <label className="col-3 col-form-label">Dataset name*</label>
                <div className="col-6">
                    <input 
                    type="text"
                    name='name'
                    value={name}
                    className='form-control input100'
                    placeholder='Type Dataset Name'
                    id="name"
                    onChange={onChangeName}
                    />
                </div></div>
            <div className="form-group row py-2">
                <div className="col-lg-2 col-3" />
                <label className="col-3 col-form-label">Dataset Description</label>
                <div className="col-6">
                    <input 
                    type='text'
                    name='description'
                    value={description}
                    className='form-control input100'
                    placeholder='Type Dataset Description'
                    id="description"
                    onChange={onChangeDescription}
                    />
                </div>
            </div>
            
            <div className="form-group row py-2">
                <div className="col-lg-5 col-3" />
                <button onClick={handleSubmit} className='btn btn-dark col-lg-1 col-1'>Save</button>
            </div>
        </div>
      </section>
      </>
    )
}

export default DatasetEdit