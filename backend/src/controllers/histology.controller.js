import { HistologyImage } from "../db/db";
import {uploadHistologyMiddleware} from '../middleware'
import path from 'path'
import fs from 'fs'

const DIR_HIST = process.env.DIR_HIST

const newHistologyImg = async (req, res) => {
    
    const data = req.body
    
    try {
        
        if (req.file == undefined) {
            return res.status(400).json({ message: "Please upload a file!" });
        }
        await uploadHistologyMiddleware(req,res)
        console.log(req.files);

        const histologyImage = await HistologyImage.create({
            file: path.join(DIR_HIST,req.files[0]),
            projectId: data.projectId,
            userId: data.userId
        })
        res.status(201).json({
            message: "Uploaded!",
            histologyImage: {
                histologyImageId: histologyImage.id,
                file: histologyImage.file
            }
        })
    }
    catch (err){
            console.log(err),
            res.status(500).json({
                message: 'Error',
                error: err
            });
    }
}

const update = async (req, res) => {

    const data = req.body
    
    try {
        if (req.file == undefined) {
            return res.status(400).json({ message: "Please upload a file!" });
        }
        const histologyImage = await HistologyImage.findByPk(data.histologyImageId)

        if (histologyImage.userId !== req.userId){
            return res.status(401).json({
                message: "Unauthorized!"
            });
        }
        
        //remove existed file
        fs.unlink(histologyImage.file, function (err) {
            if (err) throw err;
            console.log('imzML file deleted!');
        });
        
        await uploadHistologyMiddleware(req,res)
        console.log(req.files);

        histologyImage.file = path.join(DIR_HIST,req.files[0])
        await histologyImage.save()

        res.status(201).json({
            message: "Uploaded!",
            histologyImage: {
                histologyImageId: histologyImage.id,
                file: histologyImage.file
            }
        })
    }
    catch (err){
            console.log(err),
            res.status(500).json({
                message: 'Error',
                error: err
            });
    }
    
}

const show = (req, res) => {
    
}

export default {newHistologyImg, update, show}