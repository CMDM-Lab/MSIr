import React, { useState } from "react";
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { Line } from "rc-progress"
import Uploady, { useItemFinishListener, useItemProgressListener } from "@rpldy/uploady";
import UploadButton from "@rpldy/upload-button";
import Banner from "../public/Banner";
import { Link, useHistory, useParams } from "react-router-dom";
import authHeader from "../../services/auth-header";
import configData from '../../config.json'
import msi_service from "../../services/msi_service";
import { handleResponse } from "../../utils/handleResponse";

const UploadProgress = ({ setState }) => {
    const [progress, setProgess] = useState(0);

    const progressData = useItemProgressListener();
    useItemFinishListener((item) => {
        console.log(item)
        setState({ data: item.uploadResponse.data, status: item.uploadStatus })
    })

    if (progressData && progressData.completed > progress) {
        setProgess(() => progressData.completed);
    }

    if (progressData && progress === 100) {
        return <></>
    }

    return (
        progressData && (
            <Line
                style={{ height: "10px", marginTop: "20px" }}
                strokeWidth={2}
                strokeColor={progress === 100 ? "#00a626" : "#2db7f5"}
                percent={progress}
            />
        )
    );
};

const UploadMSI = (props) => {

    const MySwal = withReactContent(Swal)
    const { datasetId } = useParams()
    const history = useHistory()

    const [axisSize, setAxisSize] = useState(-1)
    const [binSize, setBinSize] = useState(0.01)
    const [imzmlRes, setImzmlRes] = useState()
    const [ibdRes, setIbdRes] = useState()

    const onChangeAxis = (e) => {
        const value = e.target.value;
        setAxisSize(value)
    }

    const onChangeBinSize = (e) => {
        const value = e.target.value;
        setBinSize(value)
    }

    const handleSubmit = async () => {
        try {
            console.log(imzmlRes)
            console.log(ibdRes)
            if (!imzmlRes || !ibdRes) {
                MySwal.fire('Error', 'Please upload MSI data first or wait for finishing uploading', 'error')
                return
            }
            /*axios post接後端回傳response*/
            const res = await msi_service.submit({
                msiId: imzmlRes.data.msi.msiId,
                bin_size: binSize,
                pixel_size: axisSize,
                datasetId: datasetId
            })
            const { data } = res
            if (res.status >= 200 && res.status < 300) {
                MySwal.fire('Success', data.message, 'success').then(() => history.goBack())
            } else {
                handleResponse(res, MySwal, history)
            }
        } catch (error) {
            console.log(error)
            MySwal.fire({
                icon: 'error',
                title: `Error`,
                text: `Please retry after a while.`,
            })
        }
    }

    return (
        <>
            <Banner title={'Upload MSI data'} />
            <section className="challange_area">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-lg-2 col-3" />
                        <div className="col-lg-10 col-9">
                            <ol className="breadcrumb">
                                <li className="breadcrumb-item">
                                    <Link to='/'>Home</Link>
                                </li>
                                <li className="breadcrumb-item">
                                    <Link to='/datasets'>Datasets</Link>
                                </li>
                                <li className="breadcrumb-item">
                                    <Link to={`/datasets/${datasetId}`}>ID: {datasetId}</Link>
                                </li>
                                <li className="breadcrumb-item active">
                                    <p>Upload MSI data</p>
                                </li>
                            </ol></div></div>
                    <div className="form-group row py-2">
                        <div className="col-lg-2 col-3" />
                        <label className="col-3 col-form-label">Upload MSI file (*.imzML)*</label>
                        <div className="col-6">
                            <Uploady
                                multiple={false}
                                destination={{ url: configData.API_URL + `/msi/new?datasetId=${datasetId}`, headers: authHeader() }}
                                accept=".imzML"
                                fileFilter={(file) => { return file.size < configData.MAX_BYTE_IMZML_FILE }}
                                maxGroupSize={1}
                            >
                                <UploadButton className='btn btn-outline-secondary  col-lg-6 col-6'>{imzmlRes ? 'Remove & Re-upload' : 'Select Files & Upload'}</UploadButton>
                                {imzmlRes ? <p>{imzmlRes.data.msi.imzml_file} Upload Finish</p> : null}
                                <UploadProgress setState={setImzmlRes} />
                            </Uploady>

                        </div>
                        <div className="col-lg-5 col-3" />
                        {/*<small className="form-text text-muted col-7">In imzML data format, *.imzML and *.ibd files should be uploaded simultaneously </small>
                <div className="col-lg-5 col-3" />
                <small className="form-text text-muted col-7">In Analyze 7.5 data format, *.img, *.hdr, and *.t2m files should be uploaded </small>
                */}
                    </div>
                    <div className="form-group row py-2">
                        <div className="col-lg-2 col-3" />
                        <label className="col-3 col-form-label">Upload MSI file (*.ibd)*</label>
                        <div className="col-6">
                            <Uploady
                                multiple={false}
                                destination={{ url: configData.API_URL + `/msi/new?datasetId=${datasetId}`, headers: authHeader() }}
                                accept=".ibd"
                                fileFilter={(file) => { return file.size < configData.MAX_BTYE_IBD_FILE }}
                                maxGroupSize={1}
                            >
                                <UploadButton className='btn btn-outline-secondary  col-lg-6 col-6'>{ibdRes ? 'Remove & Re-upload' : 'Select Files & Upload'}</UploadButton>
                                {ibdRes ? <p>{ibdRes.data.msi.ibd_file} Upload Finish</p> : null}
                                <UploadProgress setState={setIbdRes} />
                            </Uploady>

                        </div>
                        <div className="col-lg-5 col-3" />
                        {/*<small className="form-text text-muted col-7">In imzML data format, *.imzML and *.ibd files should be uploaded simultaneously </small>
                <div className="col-lg-5 col-3" />
                <small className="form-text text-muted col-7">In Analyze 7.5 data format, *.img, *.hdr, and *.t2m files should be uploaded </small>
                */}
                    </div>
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
                        <label className="col-3 col-form-label">Spatial Resolution of MSI</label>
                        <div className="col-6">
                            <input
                                type='number'
                                name='axisSize'
                                value={axisSize}
                                className='form-control input50'
                                placeholder='Type Spatial Resolution of MSI'
                                id="xAxisSize"
                                onChange={onChangeAxis}
                            />
                            <small className="form-text text-muted">Please fill the spatial resolution of MSI.</small>
                        </div>
                    </div>

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

export default UploadMSI