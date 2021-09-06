import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom"
import ReactImageAnnotate from "react-image-annotate"
import configData from "../../config.json";
import Banner from "../public/Banner";
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import {handleResponse} from "../../utils/handleResponse"
import roi_service from "../../services/roi_service";

const HistologyROI = () =>{

    const MySwal = withReactContent(Swal)

    const {datasetId} = useParams()
    const history = useHistory()
    const [histology, setHistology] = useState()
    const [rois, setRois] = useState([{type:'polygon', locked:true,cls:"Mask",color: "#f00",id:5,points:[[0.2,0.5],[0.2,0.8],[0.3,0.8]]}])

    const getData = async () => {
        const res = await roi_service.all({datasetId})
        const data = res.data
        if (res.status >= 200 && res.status <300){
            setRois(data.rois)
            setHistology(data.histology)
          } else{
            handleResponse(res,MySwal,history)
          }
    }

    useEffect(()=>{
        //getData()
    },[])

    const handleSave = async (output)=>{
        try {
            console.log(output.images[0].regions)
            const outputRois = output.images[0].regions
            const newRois = outputRois.filter(roi=>typeof(roi.id)==='string')
            const outputRoisId = outputRois.map((roi)=>{
                return roi.id
            })
            const oriRoisId = rois.map((roi)=>{
                return roi.id
            })
            const deleteRoisId = outputRoisId.filter((idx)=>oriRoisId.includes(idx))
            const res_new = await roi_service.newRois({datasetId,rois:newRois, histology:histology})
            const res_delete = await roi_service.remove({roiIds: deleteRoisId})

            history.push(`/datasets/${datasetId}`)
        } catch (error) {
            console.log(error)
        }
    }


    return (
        <>
        <Banner subtitle = {"Draw mask of tissue region or region of interest (ROI)."} />
        <section className="challange_area">
            <ReactImageAnnotate
                selectedImage={configData.API_URL+'/upload/4/test_slide[2709].jpg'}
                taskDescription="# Draw mask of tissue region or region of interest (ROI)."
                images={[{ src: configData.API_URL+'/upload/4/test_slide[2709].jpg', name: "Image 1", regions:rois }]}
                showTags={false}
                regionClsList={["Mask", "ROI"]}
                enabledTools={["create-polygon", "select"]}
                onExit = {handleSave}
            />
        </section>
        </>
    ) 
}

export default HistologyROI