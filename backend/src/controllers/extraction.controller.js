import { Extraction, HistologyROI, MSI, Dataset, Registration, Job } from "../db/db";
import fs from 'fs'
import { finishJob } from "../utils/util";

const newExtraction = async (req, res) => {
    const data = req.body
    try {
        const dataset = await Dataset.findByPk(data.datasetId)
        const extract = await Extraction.create({
            normalization: data.normalization,
            datasetId: data.datasetId,
            msiId: dataset.msiId,
            histologyroiId: data.histologyroiId,
            registrationId: data.registrationId
        })

        res.json({message: "Extraction was created successfully!"})
        //run extraction script
        const job = await Job.create({
            task:'E',
            taskId: extract.id,
            status:'WAITING'
        })
        runJobs()

    } catch (error) {
        console.log(error.message)
        res.status(500).json({ message: error.message }); 
    }
    
}

const deleteExtraction = async (req, res) => {
    const data = req.body
    try {
        const extract = await Extraction.findByPk(data.extractionId)
        if (!extract){
            return res.status(404).json({message:'Extraction not found'})
        }
        if (extract.userId !== req.userId){
            return res.status(403).json({
                message: "Access is denied!"
            });
        }
        fs.unlink(extract.extract_file, function (err) {
            if (err) throw err;
            // if no error, file has been deleted successfully
            console.log('File deleted!');
        });
        extract.destroy()
        res.json({message:'Delete Extraction successfully!'})
        
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ message: error.message }); 
    }
    
}

const all = async (req, res) => {
    const data = req.query
    try {
        const extracts = await Extraction.findAll({
            where: {
                datasetId: data.datasetId,
            },
            //attributes: { exclude: ['userId',]}
        })
        if (extracts.length===0){
            return res.json({data:[]})
        }else{
            if (extracts[0].userId !== req.userId){
                return res.status(403).json({
                    message: "Access is denied!"
                });
            }
        }
        res.json({data: extracts})
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ message: error.message }); 
    }
}

const show = async (req, res) => {
    const data = req.body
    try {
        const extract = await Extraction.findOne({
            where:{id:data.extractionId},
            //attributes: { exclude: ['userId',]}
        })
        if (extract.userId !== req.userId){
            return res.status(403).json({
                message: "Access is denied!"
            });
        }
        res.json({data:extract})
        
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ message: error.message }); 
    }
    
}

const getParameter = async (req, res) => {
    const data = req.body
    try {
        const extract = await Extraction.findByPk(data.extractionId)
        const msi = await MSI.findByPk(extract.msiId)
        const roi = await HistologyROI.findByPk(extract.histologyroiId)
        const registration = await Registration.findByPk(extract.registrationId)
        res.json({
            id: extract.id,
            normalization: extract.normalization,
            msi: msi,
            roi: roi,
            registration:registration
        })   
        extract.status = 'running'
        extract.save()
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ message: error.message }); 
    }
}

const setParameter = async (req, res) => {
    const data = req.body
    try {
        const extract = await Extraction.findByPk(data.extractionId)
        if (data.status == 'SUCCESS'){    
            extract.extract_file = data.extract_file
            extract.status = 'finished'
            extract.save()
            finishJob('E',extract.id)
        }else{
            //handle extract
            extract.status = 'error'
            extract.save()
        }
        
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ message: error.message }); 
    }
}

export default {newExtraction, deleteExtraction, all, show, getParameter, setParameter}