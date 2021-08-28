import React, { useState } from "react"
import { useParams } from "react-router-dom"
import Banner from "../public/Banner"

const CreateExtraction = () =>{
    
    const [regId, setRegId] = useState()
    const [roiId, setRoiId] = useState()
    const [norm, setNorm] = useState('none')

    const {projectId} = useParams()

    const onChangeRegId = (e) => {
        setRegId(e.target.value)
    }

    const onChangeRoiId = (e) => {
        setRoiId(e.target.value)
    }

    const onChangeNorm = (e) => {
        setNorm(e.target.value)
    }

    const handleSubmit = (e) => {

    }

    const handleReset = (e) => {
        setRegId()
        setRoiId()
        setNorm('none')
    }

    return (
    <>
    <Banner title={'Create an Extraction'} />
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
                    <a href={`/projects/${projectId}`}>{}Project Name</a>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                    <a>Create an Extraction</a>
                </li>
              </ol>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-2 col-sm-2" />
            <div className="col-lg-8 col-sm-10">
              <h3>New Extraction</h3>
              <div className="form-group row">
                <label className="col-3 col-form-label">Select Registration Result</label>
                <div className="col-9">
                    <select value={regId} onChange={onChangeRegId}>
                        {}
                    </select>
                </div>
              </div>
              <div className="form-group row">
                <label className="col-3 col-form-label">Select the ROI for Extraction</label>
                <div className="col-9">
                    <small className="form-text text-muted">
                            If there are not satisfying ROI, you can manually draw.
                    </small><br />
                    <select value={roiId} onChange={onChangeRoiId}>    
                        {}
                    </select>
                </div>
              </div>
              <div className="form-group row">
                <label className="col-3 col-form-label">Data Normalization Type</label>
                <div className="col-9">
                    <select value={norm} onChange={onChangeNorm}>
                        <option value="none">No Data Normalization</option>
                        <option value="tic">TIC Normalization</option>
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
      </>
    )
}

export default CreateExtraction