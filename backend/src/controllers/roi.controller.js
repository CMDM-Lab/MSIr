import { HistologyImage, HistologyROI } from "../db/db";
import path from 'path'

const newROI = async (req, res) => {
    const data = req.body
    try {
        const roi = await HistologyROI.create({
            userId: data.userId,
            roi_type: data.roi_type,
            points: data.points,
            histologyImageId: data.histologyImageId,
            datasetId: data.datasetId
        })
        res.json({message:'ROI was created successfully!'})
        // run draw roi script


    } catch (error) {
        console.log(error.message)
        res.status(500).json({ message: error.message });
    }

}

const newROIs = async (req,res)=>{
    const data = req.body
    try {
        console.log(data.rois)
        data.rois.forEach(async(roi)=>{
            const roi_tmp = await HistologyROI.create({
                userId: req.userId,
                roi_type: roi.cls?roi.cls:'ROI',
                points: roi.points,
                histologyImageId: data.histology.id,
                datasetId: data.datasetId
            }) 
        })
        
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ message: error.message });  
    }
}

const deletROIs = async (req, res) => {
    const data = req.body
    try {
        data.roiIds.forEach(async(idx)=>{
            const roi_tmp = await HistologyROI.findByPk(idx)
            if (roi_tmp.roi_type!='Mask'){
                roi_tmp.destroy()
            }
            
        })
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ message: error.message });
    }
}

const show = (req, res) => {
    
}

const all = async (req, res) => {
    const data = req.query
    try {
        const rois = await HistologyROI.findAll({
            where:{
                datasetId: data.datasetId
            }
        })
        if (rois.length>0){
            if (rois[0].userId !== req.userId){
                return res.status(403).json({
                    message: "Access is denied!"
                });
            }
        }
        const histology = await HistologyImage.findOne({
            where:{
                datasetId: data.datasetId
            }
        })
        return res.json({rois,histology:{id:histology.id, file:path.basename(histology.file)}})
        
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ message: error.message });
    }
}

const allmask = async (req, res) => {
    const data = req.query
    try {
        const masks = await HistologyROI.findAll({
            where:{
                roi_type: 'Mask',
                datasetId: data.datasetId
            },
            attributes:['id','blend_img_file','histologyImageId']
        })
        if (masks){
            if (masks[0].userId !== req.userId){
                return res.status(403).json({
                    message: "Access is denied!"
                });
            }
        }
        return res.json({data:masks})
        
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ message: error.message });
    }

}

const allROI = async (req, res) => {
    const data = req.query
    try {
        const rois = await HistologyROI.findAll({
            where:{
                roi_type: 'ROI',
                datasetId: data.datasetId
            }
        })
        if (rois.length>0){
            if (rois[0].userId !== req.userId){
                return res.status(401).json({
                    message: "Unauthorized!"
                });
            }
        }
        return res.json({data:rois})
        
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ message: error.message });
    }
}

const getParameter = async (req, res) => {
    const data = req.body
    try {
        const roi = await HistologyROI.findByPk(data.id)
        const image = await HistologyImage.findByPk(roi.histologyImageId)
        res.json({
            id: data.id,
            image_id:image.id,
            image_file: image.file,
            points: roi.points,
            roi_type: roi.roi_type,
            datasetId: roi.datasetId
        })

    } catch (error) {
        console.log(error.message)
        res.status(500).json({ message: error.message }); 
    }
    
}

const setParameter = async (req, res) => {
    const data = req.body
    try {
        const roi = await HistologyROI.findByPk(data.id)
        if (data.status == "SUCCESS"){    
            roi.blend_img_file = data.result_file
            roi.save()
        }
        res.status(200).json({status:'SUCCESS'})
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ message: error.message }); 
    }
    
}

export default  {newROI, show, all, allmask, allROI, getParameter, setParameter, newROIs, deletROIs}