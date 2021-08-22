import { HistologyImage, HistologyROI } from "../db/db";

const newROI = (req, res) => {
    const data = req.body
    try {
        const roi = HistologyROI.create({
            userId: req.userId,
            roi_type: data.roi_type,
            points: data.points,
            histologyImageId: data.histologyImageId 
        })
        res.json({message:'ROI was created successfully!'})
        // run draw roi script

        
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ message: error.message });
    }

}

const show = (req, res) => {
    
}

const all = (req, res) => {
    const data = req.body
    try {
        const rois = HistologyROI.findAll({
            where:{
                histologyImageId: data.histologyImageId
            }
        })
        if (rois){
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

const allmask = (req, res) => {
    const data = req.body
    try {
        const masks = HistologyROI.findAll({
            where:{
                roi_type: 'mask',
                histologyImageId: data.histologyImageId
            }
        })
        if (masks){
            if (masks[0].userId !== req.userId){
                return res.status(401).json({
                    message: "Unauthorized!"
                });
            }
        }
        return res.json({data:masks})
        
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ message: error.message });
    }

}

const allROI = (req, res) => {
    const data = req.body
    try {
        const rois = HistologyROI.findAll({
            where:{
                roi_type: 'ROI',
                histologyImageId: data.histologyImageId
            }
        })
        if (rois){
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
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ message: error.message }); 
    }
    
}

export default  {newROI, show, all, allmask, allROI, getParameter, setParameter}