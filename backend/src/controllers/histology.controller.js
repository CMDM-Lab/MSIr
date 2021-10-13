import { Dataset, HistologyImage } from "../db/db";
import {uploadHistologyMiddleware} from '../middleware'
import path from 'path'
import fs from 'fs'
import dotenv from 'dotenv-defaults'

dotenv.config()

const DIR_HIST = process.env.DIR_HIST

const newHistologyImg = async (req, res) => {
    
    const {datasetId} = req.query
    const dataset = await Dataset.findByPk(Number(datasetId))
    if (req.userId !== dataset.userId){
        return res.status(403).json({
            message: "Access is denied!"
        });
    }
    
    try {
        await uploadHistologyMiddleware(req,res)

        let histologyImage = await HistologyImage.findOne({
            where:{
                datasetId: datasetId
            }
        })

        if (histologyImage){
            if (req.file.filename !== histologyImage.file){
                
                fs.unlink(path.join(DIR_HIST,String(datasetId),histologyImage.file), function (err) {
                    if (err) throw err;
                    console.log('histology image file deleted!');
                });
                histologyImage.file = req.file.filename
                histologyImage.save()
            }
        }else{
            histologyImage = await HistologyImage.create({
                file: req.file.filename,
                datasetId: datasetId,
                userId: req.userId
            })
        }
        
        return res.status(201).json({
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

const submit = async (req, res) => {

    const data = req.body

    try {

        const histologyImage = await HistologyImage.findByPk(data.histologyImageId)
        if (histologyImage.userId !== req.userId){
            return res.status(403).json({
                message: "Access is denied!"
            });
        }

        histologyImage.resolution = data.resolution
        histologyImage.save()

        res.json({message:'The histology image has been saved!'})

    } catch (error) {
        res.status(500).json({ message: error.message }); 
    }    
}

const information = async (req, res) => {

    const {datasetId} = req.query

    try {

        const histologyImage = await HistologyImage.findOne({
            where:{
                datasetId: datasetId
            }
        })
        
        if (histologyImage){
            if (histologyImage.userId !== req.userId){
                return res.status(403).json({
                    message: "Access is denied!"
                });
            }

            res.json({image:
                {histologyImageId:histologyImage.id,
                file: histologyImage.file, 
                resolution: histologyImage.resolution
            }})
        }else{
            res.json({image:{}})
        }
    } catch (error) {
        res.status(500).json({ message: error.message }); 
    }
}
    

export default {newHistologyImg, submit, information}