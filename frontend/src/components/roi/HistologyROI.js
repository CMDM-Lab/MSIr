import React from "react";
import { useParams, useHistory } from "react-router-dom"
import ReactImageAnnotate from "react-image-annotate"
import url from "../../config/url";
import Banner from "../public/Banner";
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import {handleResponse} from "../../utils/handleResponse"

const HistologyROI = () =>{

    const MySwal = withReactContent(Swal)

    const {datasetId} = useParams()
    const history = useHistory()


    return (
        <>
        <Banner subtitle = {"Draw mask of tissue region or region of interest (ROI)."} />
        <section className="challange_area">
            <ReactImageAnnotate
                selectedImage={url.API_URL+'/upload/4/test_slide[2709].jpg'}
                taskDescription="# Draw mask of tissue region or region of interest (ROI)."
                images={[{ src: url.API_URL+'/upload/4/test_slide[2709].jpg', name: "Image 1" }]}
                regionClsList={["Mask", "ROI"]}
                enabledTools={["create-polygon", "select"]}
            />
        </section>
        </>
    ) 
}

export default HistologyROI