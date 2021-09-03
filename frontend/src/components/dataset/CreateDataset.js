import React, { useState } from "react";
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import Banner from "../public/Banner";
import { useAuthState } from "../../services/auth_service";
import datasetService from "../../services/datasets_service";
import { useHistory } from "react-router-dom";
import { handleResponse } from "../../utils/handleResponse";

const CreateDataset = (props) => {

    const MySwal = withReactContent(Swal)
    const history = useHistory()

    const [name,setName] = useState('')
    const [description, setDescription] = useState('')
    const { user } = useAuthState()

    const onChangeName = (e)=>{
        const value = e.target.value;
        setName(value)
    }

    const onChangeDescription = (e)=>{
        const value = e.target.value;
        setDescription(value)
    }

    const handleReset = ()=>{
        setName('')
        setDescription('')
    }

    const handleSubmit = async () => {

        if (name.length<1){
            MySwal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Please type a dataset name !',
            })
            return 
        }
        try {
            const res = await datasetService.create({name, description})
            if (res.status >= 200 && res.status <300){
                MySwal.fire({
                    icon: 'success',
                    title: res.data.message,
                    confirmButtonText: 'OK'
                  }).then(()=>{
                    history.push(`/datasets/${res.data.datasetId}`); 
                  })
            }else{
                handleResponse(res, MySwal, history)
            }
        } catch (error) {
            MySwal.fire({
                icon: 'error',
                title: 'Oops...',
                text: error,
              })
        }
    }

    return (
    <>
    <Banner title = {"Create a new dataset"} />
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
                        <li className="breadcrumb-item active">
                            <a href='/datasets/new'>Create a new dataset</a>
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
                <button onClick={handleSubmit} className='btn btn-primary col-lg-1 col-1'>Submit</button>
                <button onClick={handleReset} className='btn btn-secondary col-lg-1 col-1'>Reset</button>
            </div>
        </div>
      </section>
      </>
    )
}

export default CreateDataset