import React, { useState } from "react";

const CreateProject = (props) => {

    const [name,setName] = useState('')
    const [xAxisSize, setXAxisSize] = useState()
    const [yAxisSize, setYAxisSize] = useState()

    const onChangeName = (e)=>{
        const value = e.target.value;
        setName(value)
    }

    const onChangeXAxis = (e)=>{
        const value = e.target.value;
        setXAxisSize(value)
    }

    const onChangeYAxis = (e)=>{
        const value = e.target.value;
        setYAxisSize(value)
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
                    <input type='file'/>    
                </div>
                <div className="col-lg-5 col-3" />
                <small className="form-text text-muted col-7">In imzML data format, *.imzML and *.ibd files should be uploaded </small>
                <div className="col-lg-5 col-3" />
                <small className="form-text text-muted col-7">In Analyze 7.5 data format, *.img, *.hdr, and *.t2m files should be uploaded </small>
            </div>
            <div className="form-group row py-2">
                <div className="col-lg-2 col-3" />
                <label className="col-3 col-form-label">Pixel size of MSI in x-axis</label>
                <div className="col-6">
                    <input 
                    type='number'
                    name='xAxisSize'
                    value={xAxisSize}
                    className='form-control input100'
                    placeholder='Type Pixel Size of MSI in X-axis'
                    id="xAxisSize"
                    onChange={onChangeXAxis}
                    />
                    <small className="form-text text-muted">Please fill the pixel resolution of MSI in x-axis.</small>
                </div>
            </div>
            <div className="form-group row py-2">
                <div className="col-lg-2 col-3" />
                <label className="col-3 col-form-label">Pixel size of MSI in y-axis</label>
                <div className="col-6">
                    <input 
                    type='number'
                    name='yAxisSize'
                    value={yAxisSize}
                    className='form-control input100'
                    placeholder='Type Pixel Size of MSI in Y-axis'
                    id="yAxisSize"
                    onChange={onChangeYAxis}
                    />
                    <small className="form-text text-muted">Please fill the pixel resolution of MSI in y-axis.</small>
                </div>
            </div>
            <div className="form-group row py-2">
                <div className="col-lg-2 col-3" />
                <label className="col-3 col-form-label">Upload Histology image file*</label>
                <div className="col-6">
                    <input type='file'/>
                    <small className="form-text text-muted"></small>
                </div>
            </div>
            <div className="form-group row py-2">
                <div className="col-lg-5 col-3" />
                <button onClick={''} className='btn btn-primary col-lg-1 col-1'>Submit</button>
                <button onClick={''} className='btn btn-secondary col-lg-1 col-1'>Reset</button>
            </div>
        </div>
      </section>
    )
}

export default CreateProject