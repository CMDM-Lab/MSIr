import { Extraction, HistologyROI, MSI, Project } from "../db/db";
import fs from 'fs'

const newExtraction = async (req, res) => {
    const data = req.body
    try {
        const project = await Project.findByPk(data.projectId)
        const extract = await Extraction.create({
            normalization: data.normalization,
            projectId: data.projectId,
            msiId: project.msiId
        })
        //run extraction script

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
            return res.status(401).json({
                message: "Unauthorized!"
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
    const data = req.body
    try {
        const extracts = await Extraction.findAll({
            where: {
                projectId: data.projectId,
            },
            //attributes: { exclude: ['userId',]}
        })
        if (extracts){
            if (extracts[0].userId !== req.userId){
                return res.status(401).json({
                    message: "Unauthorized!"
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
            return res.status(401).json({
                message: "Unauthorized!"
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
        res.json({
            id: extract.id,
            normalization: extract.normalization,
            msi: msi,
            roi: roi
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
        }else{
            //handle extract
            extract.status = 'error'
            extract.save()
        }
        
    } catch (error) {
        
    }
}

const resultFile = (req, res) => {
    
}

export default {newExtraction, deleteExtraction, all, show, getParameter, setParameter, resultFile}