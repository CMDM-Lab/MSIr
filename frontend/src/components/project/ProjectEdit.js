import React, { useEffect,useState } from "react"
import { useParams } from 'react-router'

const ProjectEdit = () => {
    const [name,setName] = useState('')
    const [axisSize, setAxisSize] = useState(-1)
    const [msiFiles, setMsiFiles] = useState([])
    const [histFile, setHistFile] = useState()
    const [msiId, setMsiId] = useState(null)
    const [histId, setHistId] = useState(null)

    const onChangeName = (e)=>{
        const value = e.target.value;
        setName(value)
    }

    const onChangeAxis = (e)=>{
        const value = e.target.value;
        setAxisSize(value)
    }

    const onChangeMsiFiles = (e)=>{
        if (e.target.files.length==2){
            setMsiFiles([...e.target.files])
        }

        
    }
    const onChangeHistFile = (e)=>{
        setHistFile(e.target.files[0])
    }

    const onUploadMsiFiles = (e)=>{
        e.preventDefault()
        let formData = new FormData();

        for (const key of Object.keys(msiFiles)) {
            formData.append('msiFiles', msiFiles[key])
        }
        /*axios post接後端回傳response*/
        /*axios.post("http://localhost:8000/endpoint/multi-images-upload", formData, {
        }).then(response => {
            console.log((response.data))
        })*/
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
                <label className="col-3 col-form-label">Upload MSI files*</label>
                <div className="col-6">
                    <input className='col-lg-10 col-10' type='file' name='msiFiles' onChange={onChangeMsiFiles} multiple accept=".imzML,.idb"/>
                    <div className='btn btn-outline-secondary  col-lg-2 col-2'>
                        <button onClick={onUploadMsiFiles}>Upload</button>
                    </div> 
                </div>
                <div className="col-lg-5 col-3" />
                <small className="form-text text-muted col-7">In imzML data format, *.imzML and *.ibd files should be uploaded simultaneously </small>
                {/*<div className="col-lg-5 col-3" />
                <small className="form-text text-muted col-7">In Analyze 7.5 data format, *.img, *.hdr, and *.t2m files should be uploaded </small>
                */}
            </div>
            <div className="form-group row py-2">
                <div className="col-lg-2 col-3" />
                <label className="col-3 col-form-label">Upload Histology image file*</label>
                <div className="col-6">
                    <input className='col-lg-10 col-10' type='file' name='HistFile' onChange={onChangeHistFile} accept=".png,.jpg,.jpeg,.tif,.tiff"/>
                    <div className='btn btn-outline-secondary col-lg-2 col-2'>
                        <button  onClick={onUploadHistFile}>Upload</button>
                    </div> 
                    <small className="form-text text-muted">Only accept PNG, JPEG, TIFF image file formats</small>
                </div>
            </div>
            <div className="form-group row py-2">
                <div className="col-lg-2 col-3" />
                <label className="col-3 col-form-label">Pixel size of MSI</label>
                <div className="col-6">
                    <input 
                    type='number'
                    name='axisSize'
                    value={axisSize}
                    className='form-control input100'
                    placeholder='Type Pixel Size of MSI'
                    id="xAxisSize"
                    onChange={onChangeAxis}
                    />
                    <small className="form-text text-muted">Please fill the pixel resolution of MSI in x-axis.</small>
                </div>
            </div>
            
            <div className="form-group row py-2">
                <div className="col-lg-5 col-3" />
                <button onClick={handleSubmit} className='btn btn-primary col-lg-1 col-1'>Save</button>
                {/*<button onClick={handleReset} className='btn btn-secondary col-lg-1 col-1'>Reset</button>*/}
            </div>
        </div>
      </section>
    )
}

export default ProjectEdit