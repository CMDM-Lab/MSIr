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
        try{
        const res = await roi_service.all({datasetId})
        const data = res.data
        if (res.status >= 200 && res.status <300){
            const processRois = data.rois.map((roi)=>{
                return {
                    type: 'polygon',
                    locked: true,
                    cls: roi.roi_type,
                    color: roi.roi_type==='Mask'?'#f00':'#0f0',
                    id: roi.id,
                    points: roi.points,
                    visible: roi.roi_type==='Mask'?false:true,
                    editingLabels: false,
                }
            })
            setRois(processRois)
            const processHist = {id:data.histology.id, file:configData.API_URL+`/upload/${datasetId}/${data.histology.file}`}
            setHistology(processHist)
          } else{
            handleResponse(res,MySwal,history)
          } 
        } catch (error) {
            MySwal.fire({
                icon: 'error',
                title: 'Please upload a histology image first!',
              })
        }
    }

    useEffect(()=>{
        getData()
    },[])

    const handleSave = async (output)=>{
        try {
            const outputRois = output.images[0].regions
            console.log(outputRois)
            const newRois = outputRois.filter(roi=>typeof roi.id ==='string')
            const outputRoisId = outputRois.map((roi)=>{
                return roi.id
            })
            const oriRoisId = rois.map((roi)=>{
                return roi.id
            })
            const deleteRoisId = oriRoisId.filter((idx)=>!outputRoisId.includes(idx))
            if (newRois.length>0){
                roi_service.newRois({datasetId,rois:newRois, histology:histology})
            }
            if (deleteRoisId.length>0){
                roi_service.remove({roiIds: deleteRoisId})
            }
            let timerInterval
            Swal.fire({
            //   title: 'Wait for Registration!',
              // html: 'I will close in <b></b> milliseconds.',
              timer: 1000,
              timerProgressBar: true,
              allowOutsideClick: false,
              didOpen: () => {
                Swal.showLoading()
                // const b = Swal.getHtmlContainer().querySelector('b')
                // timerInterval = setInterval(() => {
                //   b.textContent = Swal.getTimerLeft()
                // }, 100)
              },
              willClose: () => {
                clearInterval(timerInterval)
              }
            }).then((result) => {
              /* Read more about handling dismissals below */
              if (result.dismiss === Swal.DismissReason.timer) {
                console.log('I was closed by the timer');
                history.goBack()
              }
            })
        } catch (error) {
            console.log(error)
        }
    }


    return (
        <>
        <Banner title = {`Draw mask or ROI`} />
        <section className="challange_area"> 
            {
                histology?(
                    <ReactImageAnnotate
                        selectedImage={histology.file}
                        taskDescription="# Draw masks of tissue region or regions of interest (ROIs)"
                        images={[{ src: histology.file, name: "Histology Image", regions:rois }]}
                        showTags={false}
                        regionClsList={["Mask", "ROI"]}
                        enabledTools={["create-polygon", "select"]}
                        hidePrev={true}
                        hideNext={true}
                        hideClone={true}
                        hideSettings={true}
                        hideFullScreen={true}
                        onExit = {handleSave}
                    />
                ):(
                    <p>Page Loading</p>
                )
            }
            
        </section>
        </>
    ) 
}

export default HistologyROI