import React, { useState } from "react"
import { useParams } from "react-router-dom"

const CreateRegistration = () =>{
    
    const [maskId, setMaskId] = useState()
    const [regType, setRegType] = useState('intensity')

    const {projectId} = useParams()

    const onChangeRegType = (e) => {
        setRegType(e.target.value)
    }

    const onChangeMaskId = (e) => {
        setMaskId(e.target.value)
    }

    const handleSubmit = (e) => {

    }

    const handleReset = (e) => {
        setMaskId()
        setRegType('intensity')
    }

    return (
    <section className="challange_area">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-2 col-sm-3" />
            <div className="col-lg-8 col-sm-6" style={{paddingLeft: 0}}>
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                    <a href='/'>Home</a>
                </li>
                <li className="breadcrumb-item">
                    <a href='/projects'>Projects</a>
                </li>
                <li className="breadcrumb-item">
                    <a href={'/'/*`/projects/${projectId}`*/}>Projects</a>
                </li>
                <li className="breadcrumb-item active">
                    <div>Create a Registration</div>
                </li>
              </ol>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-2 col-sm-2" />
            <div className="col-lg-8 col-sm-10">
              <h3>New Registration</h3>
              <div className="form-group row">
                <label className="col-3 col-form-label">Registration type</label>
                <div className="col-9">
                    <select value={regType} onChange={onChangeRegType}>
                        <option value="intensity">Intensity-based method</option>
                        <option value="contour">Contour-based method</option>
                    </select>
                </div>
              </div>
              <div className="form-group row">
                <label className="col-3 col-form-label">Select the mask of histology image</label>
                <div className="col-9">
                    <small className="form-text text-muted">
                            If there is not any mask to select, mask would be generated automatically.
                            If there are not satisfying mask, you can manually draw.
                    </small>
                    <select value={maskId} onChange={onChangeMaskId}>    
                        {}
                    </select>
                </div>
              </div>
              <div className="form-group row py-2">
                <div className="col-lg-3 col-3" />
                <button onClick={handleSubmit} className='btn btn-primary col-lg-2 col-1'>Submit</button>
                <button onClick={handleReset} className='btn btn-secondary col-lg-2 col-1'>Reset</button>
              </div>
            </div>
          </div>
        </div>
      </section>
    )
}

export default CreateRegistration