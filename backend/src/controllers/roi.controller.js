import { HistologyROI } from "../db/db";

const newROI = (req, res) => {
    const data = req.body
    try {
        const roi = HistologyROI.create({
            userId: req.userId,
            roi_type: data.roi_type,
            points: data.points,
            histologyImageId: data.histologyImageId 
        })
        res.send({message:'ROI was created successfully!'})
        // run draw roi script

        
    } catch (error) {
        console.log(error.message)
        res.status(500).send({ message: error.message });
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
                return res.status(401).send({
                    message: "Unauthorized!"
                });
            }
        }
        return res.send({data:rois})
        
    } catch (error) {
        console.log(error.message)
        res.status(500).send({ message: error.message });
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
                return res.status(401).send({
                    message: "Unauthorized!"
                });
            }
        }
        return res.send({data:masks})
        
    } catch (error) {
        console.log(error.message)
        res.status(500).send({ message: error.message });
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
                return res.status(401).send({
                    message: "Unauthorized!"
                });
            }
        }
        return res.send({data:rois})
        
    } catch (error) {
        console.log(error.message)
        res.status(500).send({ message: error.message });
    }
}

export default  {newROI, show, all, allmask, allROI}