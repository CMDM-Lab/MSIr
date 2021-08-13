import React, { useEffect, useState } from "react";
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const EditMSI = (props) => {

    const MySwal = withReactContent(Swal)

    const [axisSize, setAxisSize] = useState(-1)
    const [msiFiles, setMsiFiles] = useState([])
    const [binSize, setBinSize] = useState(0.01)
    const [msidata, setMsidata] = useState()
    const [progressInfo, setProgressInfo] = useState()
    const [message, setMessage] = useState('')

    useEffect(()=>{
        
    },[])

    const onChangeAxis = (e)=>{
        const value = e.target.value;
        setAxisSize(value)
    }

    const onChangeBinSize = (e)=>{
        const value = e.target.value;
        setBinSize(value)
    }

    const onChangeMsiFiles = (e)=>{
        const files = [...e.target.files]
        if (files.length==2){
            if (files.some(e=>/\.imzML/.test(e.name)) && files.some(e=>/\.ibd/.test(e.name))){
                setMsiFiles([...e.target.files])
            }
            else{
                MySwal.fire('Upload error file type','Please upload .imzML and .ibd simultaneously','error')
            }
        }
        else{
            MySwal.fire('Upload error number of files','Please upload .imzML and .ibd simultaneously','error')
        }

    }

    const onUploadMsiFiles = async (e)=>{
        e.preventDefault()
        let formData = new FormData();

        for (const key of Object.keys(msiFiles)) {
            formData.append('msiFiles', msiFiles[key])
        }
        let _progressInfo = {percentage: 0};
        /*for (let i = 0; i < msiFiles.length; i++) {
            _progressInfos.push({ percentage: 0, fileName: msiFiles[i].name });
        }*/
        setProgressInfo(_progressInfo)

        /*axios post接後端回傳response*/
        /*try{
           const response = await axios.post("http://localhost:8000/endpoint/multi-images-upload", formData, (event) => {
                _progressInfo.percentage = Math.round((100 * event.loaded) / event.total);
                setProgressInfo(_progressInfo)
            })
            setMsidata(response.data)
            console.log(response.data)
            setMessage("Uploaded the file successfully")
        }
        catch{
            setProgressInfo({percentage:0})
            setMessage("Upload the file unsuccessfully, please retry.")
        }   
        */
    }

    /*const handleReset = ()=>{
        setName('')
        setAxisSize(0)
        setMsiFiles([])
        setHistFile()
    }*/

    const handleSubmit = () => {
        if (!msidata){
            MySwal.fire('Error','Please upload MSI data first or wait for finishing uploading','error')
            return
        }
        /*axios post接後端回傳response*/
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
                            <a href='/projects'>Project name{}</a>
                        </li>
                        <li className="breadcrumb-item active">
                            <p>Upload MSI data</p>
                        </li>
                    </ol></div></div>
            <div className="form-group row py-2">
                <div className="col-lg-2 col-3" />
                <label className="col-3 col-form-label">Upload MSI files*</label>
                <div className="col-6">
                    <input className='col-lg-10 col-10' type='file' name='msiFiles' onChange={onChangeMsiFiles} multiple accept=".imzML,.ibd"/>
                    <div className='btn btn-outline-secondary  col-lg-2 col-2'>
                        <button onClick={onUploadMsiFiles} disabled={!msiFiles.some(e=>/\.imzML/.test(e.name)) || !msiFiles.some(e=>/\.ibd/.test(e.name))}>Upload</button>
                    </div> 
                </div>
                <div className="col-lg-5 col-3" />
                <small className="form-text text-muted col-7">In imzML data format, *.imzML and *.ibd files should be uploaded simultaneously </small>
                {/*<div className="col-lg-5 col-3" />
                <small className="form-text text-muted col-7">In Analyze 7.5 data format, *.img, *.hdr, and *.t2m files should be uploaded </small>
                */}
            </div>
            {progressInfo?
            (<div className="form-group row py-2">
                <div className="col-lg-2 col-3" />
                <label className="col-3 col-form-label">Upload progress</label>
                <div className="col-6">
                    <div
                        className="progress-bar progress-bar-info"
                        role="progressbar"
                        aria-valuenow={progressInfo.percentage}
                        aria-valuemin="0"
                        aria-valuemax="100"
                        style={{ width: progressInfo.percentage + "%" }}
                    >
                        {progressInfo.percentage}%
                    </div>
                    {message?
                    (<div className="alert alert-secondary" role="alert">{message}</div>):null
                    }
                </div>
            </div>):null}
            <div className="form-group row py-2">
                <div className="col-lg-2 col-3" />
                <label className="col-3 col-form-label">MSI datacube bin size*</label>
                <div className="col-6">
                    <select value={binSize} onChange={onChangeBinSize}>
                        <option value={0.01}>0.01 m/z</option>
                        <option value={0.1}>0.1 m/z</option>
                        <option value={1}>1 m/z</option>
                    </select>
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
                    className='form-control input50'
                    placeholder='Type Pixel Size of MSI'
                    id="xAxisSize"
                    onChange={onChangeAxis}
                    />
                    <small className="form-text text-muted">Please fill the pixel resolution of MSI in x-axis.</small>
                </div>
            </div>
            
            <div className="form-group row py-2">
                <div className="col-lg-5 col-3" />
                <button onClick={handleSubmit} className='btn btn-primary col-lg-1 col-1'>Submit</button>
                {/*<button onClick={handleReset} className='btn btn-secondary col-lg-1 col-1'>Reset</button>*/}
            </div>
        </div>
      </section>
    )
}

export default EditMSI