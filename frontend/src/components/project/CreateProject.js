import React, { useState } from "react";
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import Banner from "../public/Banner";

const CreateProject = (props) => {

    const MySwal = withReactContent(Swal)

    const [name,setName] = useState('')
    const [description, setDescription] = useState('')
    const [histFile, setHistFile] = useState()
    

    const onChangeName = (e)=>{
        const value = e.target.value;
        setName(value)
    }

    const onChangeDescription = (e)=>{
        const value = e.target.value;
        setDescription(value)
    }

    const onUploadHistFile = (e)=>{
        e.preventDefault()
        let formData = new FormData();

        formData.append('histFile', histFile)
        
        /*axios post接後端回傳response*/
        /*axios.post("http://localhost:8000/endpoint/multi-images-upload", formData, {
        }).then(response => {
            console.log((response.data))
        })*/
    }

    /*const handleReset = ()=>{
        setName('')
        setAxisSize(0)
        setMsiFiles([])
        setHistFile()
    }*/

    const handleSubmit = () => {

    }

    return (
    <>
    <Banner title = {"Create a new project"} />
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
                            <a href='/projects'>Projects</a>
                        </li>
                        <li className="breadcrumb-item active">
                            <a href='/projects/new'>Create a new project</a>
                        </li>
                    </ol></div></div>
            <div className="form-group row py-2">
                <div className="col-lg-2 col-3" />
                <label className="col-3 col-form-label">Project name*</label>
                <div className="col-6">
                    <input 
                    type="text"
                    name='name'
                    value={name}
                    className='form-control input100'
                    placeholder='Type Project Name'
                    id="name"
                    onChange={onChangeName}
                    />
                </div></div>
            <div className="form-group row py-2">
                <div className="col-lg-2 col-3" />
                <label className="col-3 col-form-label">Project Description</label>
                <div className="col-6">
                    <input 
                    type='text'
                    name='description'
                    value={description}
                    className='form-control input100'
                    placeholder='Type Project Description'
                    id="description"
                    onChange={onChangeDescription}
                    />
                </div>
            </div>
            {/*<div className="form-group row py-2">
                <div className="col-lg-2 col-3" />
                <label className="col-3 col-form-label">Upload Histology image file*</label>
                <div className="col-6">
                    <input className='col-lg-10 col-10' type='file' name='HistFile' onChange={onChangeHistFile} accept=".png,.jpg,.jpeg,.tif,.tiff"/>
                    <div className='btn btn-outline-secondary col-lg-2 col-2'>
                        <button onClick={onUploadHistFile}>Upload</button>
                    </div> 
                    <small className="form-text text-muted">Only accept PNG, JPEG, TIFF image file formats</small>
                </div>
            </div>*/}
            
            <div className="form-group row py-2">
                <div className="col-lg-5 col-3" />
                <button onClick={handleSubmit} className='btn btn-primary col-lg-1 col-1'>Submit</button>
                {/*<button onClick={handleReset} className='btn btn-secondary col-lg-1 col-1'>Reset</button>*/}
            </div>
        </div>
      </section>
      </>
    )
}

export default CreateProject