import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { useHistory, useLocation } from 'react-router-dom'
import Banner from '../public/Banner'
import datasetService from '../../services/datasets_service'
import registrationService from '../../services/registration_service'
import extractionService from '../../services/extraction_service'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import configData from '../../config.json'
import RegisterCard from './RegisterCard'
import ExtractCard from './ExtractCard'
import { handleResponse } from '../../utils/handleResponse'
import image from "../extraction/select.png"
import { makeStyles } from "@material-ui/core/styles";
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import qs from 'qs'
import { useCookies } from "react-cookie"

const tryParseInt = value => {
    const result = parseInt(value)
    return isNaN(result) ? value : result
}
  
const parseObjectValues = (obj = {}) => {
Object.keys(obj).forEach(k => {
    obj[k] = tryParseInt(obj[k])
})

return obj
}
  
const useQuery = () => {
    const location = useLocation()
    const history = useHistory()
    const value = parseObjectValues(
        qs.parse(location.search, { ignoreQueryPrefix: true }) || {}
    )

    return {
        value,
        set: params =>
        history.push({
            pathname: location.pathname,
            search: qs.stringify({ ...value, ...parseObjectValues(params) })
        })
    }
}

const useStyles = makeStyles((theme) => ({
    root: {
      width: "90%",
      "& .Mui-active MuiStepIcon-root": { color: "red" },
      "& .Mui-completed .MuiStepIcon-root": { color: "black" },
      "& .MuiSvgIcon-root.Mui-active": {
        color: "#642100",
      }
    },
    backButton: {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1)
    },
    instructions: {
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(1)
    }
  }));
function getSteps() {
return [
    "Upload Data",
    "Image Registration",
    "Spectral Indices Extraction"
];
}

const Step1 = () => {
    const [hist, setHist] = useState()
    const [msi, setMsi] = useState()
    const [dataset, setDataset] = useState()
    const {datasetId} = useParams();
    const MySwal = withReactContent(Swal);
    const history = useHistory();

    const getHistAndMsi = async() => {
        const res_dataset = await datasetService.show({datasetId})
        const {data} = res_dataset
        if (res_dataset.status >= 200 && res_dataset.status <300){
            setDataset(data.dataset)
            setHist(data.histologyImage)
            setMsi(data.msi)
        } else{
            if (res_dataset.status===404){
                MySwal.fire({
                    icon: 'error',
                    title: `${res_dataset.data.message}`,
                }).then(()=>{
                    history.goBack()
                })
            }else{
                handleResponse(res_dataset, MySwal, history)
            }
            
        }
    }

    useEffect(()=>{
        getHistAndMsi()
    },[]);
    return (
        <>
        <div className="row p_b_100">
            <div className="col-lg-4 col-4" />    
            <div className='col-lg-5 col-5'>
                <br/>
                <h3>Upload Data</h3>
                <p>Dataset should contain<br/>(1) MSI data (one .imzML file & one .ibd file) <br/>(2) Histological image (.png, .jpg, .jpeg are available)</p>
                <br/>
            </div>
                <div className="col-lg-4 col-4" />    
                <div className='col-lg-4 col-4'>
                <div class="card bg-light mb-3">
                    <br/>
                    <h3>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        (1) MSI data <span/>
                        <div className='btn-group col-lg-2 col-2'>
                            <a className='btn btn-dark text-left btn-sm' style={{'color':'white'}} href={msi?`/datasets/${datasetId}/msi/edit`:`/datasets/${datasetId}/msi/new`}>
                                {msi?'Edit':'Upload'}
                            </a>
                        </div>
                    </h3>
                    <br/>
                    <ul>
                        <h6>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;imzML: {msi? msi.imzml_file:null}</h6>
                        <h6>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;ibd: {msi? msi.ibd_file:null}</h6>
                    </ul>
                    <br/>
                    <br/> 
                    <h3>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        (2) Histological Image {hist? null:
                        <div className='btn-group col-lg-2 col-2'>
                            <a className='btn btn-dark text-left btn-sm' style={{'color':'white'}} href={`/datasets/${datasetId}/image/new`}>
                                {'Upload'}
                            </a>
                        </div>
                        }
                    {hist?
                    (
                        <div className='btn-group col-lg-2 col-2'>
                            <a className='btn btn-dark text-left btn-sm' style={{'color':'white'}} href={`/datasets/${datasetId}/image/edit`}>
                                {'Edit'}
                            </a>
                        </div>
                    ):null
                    }
                    </h3>
                    <br/>
                    <div className="row justify-content-center">
                        <div className='col-lg-5 col-5'>
                        {hist?
                            <div className='images card-columns'>
                                    <img src={configData.API_URL+`/upload/${datasetId}/${hist.file}`} className='card-img-top viewer' alt='a uplaoded histology'/>
                            </div>
                            :null}
                        <br/>
                        <div class="text-center">
                        <h6>{hist? hist.file:null}</h6>
                        </div>
                        <br/>
                        </div>
                    </div>
                </div> 
            </div>
        </div>  
        </>
    )
}

const Step2 = () => {
    const [registrations,setRegistrations] = useState([]);
    const {datasetId} = useParams();
    const MySwal = withReactContent(Swal);
    const history = useHistory();
    const getRegistration = async() => {
        const res_regist = await registrationService.all({datasetId})
        if (res_regist.status >= 200 && res_regist.status <300){
            setRegistrations([...res_regist.data.data])
        } else{
            handleResponse(res_regist, MySwal, history)
        };
    }
    useEffect(()=>{
        getRegistration()
    },[]);

    return(
        <>
        <div className="row p_b_100">
            <div className="col-lg-4 col-4" />
            <div className='col-lg-4 col-4'>
                <br/>
                <h3>Image Registration</h3>
                <p>Create a new registration</p>
                <br/>
                <div className='btn-group' role="group">
                    <a className='btn btn-outline-dark  btn-sm' href={`/datasets/${datasetId}/registrations/new`}>
                        New Registration
                    </a>
                    <a className='btn btn-outline-secondary  btn-sm' href={`/datasets/${datasetId}/registrations`}>
                        All Registrations
                    </a>
                </div>
                {registrations.length>0?(
                    registrations.map((registration)=>{
                        return <RegisterCard registerData={registration} />
                    })
                ):(<p></p>)}
            </div>
        </div>
        </>
    )
}

const Step3 = () => {
    const [extractions,setExtractions] = useState([]);
    const {datasetId} = useParams();
    const MySwal = withReactContent(Swal);
    const [cookies, setCookie] = useCookies([]);
    const history = useHistory();
    const getExtraction = async() => {
        const res_extract = await extractionService.all({datasetId})
        if (res_extract.status >= 200 && res_extract.status <300){
            setExtractions([...res_extract.data.data])
        } else{
            handleResponse(res_extract, MySwal, history)
        }
    }
    const  c = document.cookie.indexOf("extraction_tutorial");
    useEffect(()=>{
        getExtraction()
    },[]);
    return (
        <>
        <div className="row p_b_100">
            <div className="col-lg-4 col-4" />    
            <div className='col-lg-4 col-4'>
                <br/>
                <h3>Spectral indices Extraction</h3>
                <p>Create a new extraction</p>
                <br/>
                <div className='btn-group' role="group">
                {/* <button className='btn btn-outline-dark btn-sm' href={`/datasets/${datasetId}/extractions/new`} >
                    New Extraction
                </button> */}
                <button onClick={()=>{
                    if (c == -1 ){
                        history.push(`/datasets/${datasetId}/extractions/new`)
                        Swal.fire({
                          text: 'Select one registration result and one region of interest (ROI) to Extract!',
                          imageUrl: image,
                          imageWidth: 400,
                          imageHeight: 300,
                          confirmButtonColor: '#000000',
                        }).then(()=>{
                            setCookie("extraction_tutorial", "1", {
                              path: "/",
                              maxAge: 60*60*24,
                            })})
                      }
                    else{
                        history.push(`/datasets/${datasetId}/extractions/new`)
                      }
                        }} className='btn btn-outline-dark btn-sm'>New Extraction
                  </button>
                  <button onClick={()=>{
                        history.push(`/datasets/${datasetId}/extractions`)
                        }} className='btn btn-outline-dark btn-sm'>All Extraction
                  </button>
                </div>
                {extractions.length>0?(
                extractions.map((extract,idx)=>{
                    return<ExtractCard extractData={extract}/>
                    }
                )
                ):(<p></p>)}
            </div>
        </div>
        </>
    )
}

const StepFinish = () => {
    return (
        <>
        <div className="row p_b_100">
            <div className="col-lg-5 col-5" />    
            <div className='col-lg-5 col-5'>
                <br/>
                <h3>All steps completed !</h3>
            </div>
        </div>
        </>
    )
}

const DatasetRender = () => {
    const classes = useStyles();
    const steps = getSteps();
    const query = useQuery();
    if (query.value.step === null || query.value.step === undefined)
    {
        window.location.search = "?step=0";
    }
    
    const HandleNext = () => {
        query.set({step: Number(query.value.step) + 1});
    };

    const HandleBack = () => {
        query.set({step: Number(query.value.step) - 1});
    };

    const HandleReset = () => {
        query.set({step: 0});
    };
    const MySwal = withReactContent(Swal)

    const {datasetId} = useParams()
    //const {user} = useAuthState()
    const history = useHistory()
    const [dataset, setDataset] = useState()
    const getData = async() => {
        const res_dataset = await datasetService.show({datasetId})
        const {data} = res_dataset
        if (res_dataset.status >= 200 && res_dataset.status <300){
            setDataset(data.dataset)
        } else{
            if (res_dataset.status===404){
                MySwal.fire({
                    icon: 'error',
                    title: `${res_dataset.data.message}`,
                }).then(()=>{
                    history.goBack()
                })
            }else{
                handleResponse(res_dataset, MySwal, history)
            }
            
        }
    }
    useEffect(()=>{
        getData()
    },[]);

    const section1 = Step1();
    const section2 = Step2();
    const section3 = Step3();
    const section4 = StepFinish();
    let section = section1;
    // eslint-disable-next-line default-case
    switch (Number(query.value.step)) {
        case 1: 
            section = section2;
            break;
        case 2:
            section = section3;
            break;
        case 3:
            section = section4;
            break;
    }
    return (
        <>
        <Banner title={dataset?`Dataset: ${dataset.name}`: 'Dataset'} />
        <section className="challange_area">
        <div className="container-fluid">
            <div className="row">
            <div className="col-lg-2 col-2" />
            <div className="col-lg-6 col-10" style={{paddingLeft: 0}}>
                <ol className="breadcrumb">
                <li className="breadcrumb-item">
                    <a href='/'>Home</a>
                </li>
                <li className="breadcrumb-item">
                    <a href='/datasets'>Datasets</a>
                </li>
                <li className="breadcrumb-item">
                    {dataset? `Dataset ID:${dataset.id}` : null}
                </li>
                </ol></div></div>
            <div className="row">
                <div className="col-lg-2 col-2" />
                <div className='col-lg-10 col-10'>
                <div className={classes.root}>
                    <div style={{ width: "960px", overflow: "auto" }}>
                        <Stepper activeStep={query.value.step} alternativeLabel>
                        {steps.map((label) => (
                            <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                            </Step>
                        ))}
                        </Stepper>
                    </div>
                    <br/>
                    <br/>
                    <div>
                        {Number(query.value.step) === steps.length ? (
                        <div>
                            {/* <Typography className={classes.instructions}>
                            All steps completed
                            </Typography> */}
                            <Button color="inherit" onClick={HandleReset}>Reset</Button>
                        </div>
                        ) : (
                        <div>
                            <Typography className={classes.instructions}>
                            </Typography>
                            <div>
                            <Button
                                disabled={Number(query.value.step) === 0}
                                onClick={HandleBack}
                                className={classes.backButton}
                                color="inherit"
                            >
                                Back
                            </Button>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            <Button variant="contained" 
                            style={{
                                backgroundColor: "#000000",
                            }}
                            onClick={HandleNext}>
                                {Number(query.value.step) === steps.length - 1 ? "Finish" : "Next"}
                            </Button>
                            </div>
                        </div>
                        )}
                    </div>
                </div>
                </div>
            </div>
            {section}
        </div>
        </section>
        </>
    )
}

export default DatasetRender
