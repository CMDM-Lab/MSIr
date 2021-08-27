import React, { useEffect,useState } from "react"
import { useParams } from 'react-router'

const ProjectEdit = () => {
    const [name,setName] = useState('')
    const [description, setDescription] = useState('')
    const {projectId} = useParams()

    const onChangeName = (e)=>{
        const value = e.target.value;
        setName(value)
    }

    const onChangeDescription = (e)=>{
        const value = e.target.value;
        setDescription(value)
    }

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
                        <li className="breadcrumb-item">
                            <a href={`/projects/${projectId}`}>{}Project Name</a>
                        </li>
                        <li className="breadcrumb-item active">
                            <a>Edit this project</a>
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