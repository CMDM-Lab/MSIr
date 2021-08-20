import { Extraction, Project } from "../db/db";
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
        res.status(500).send({ message: error.message }); 
    }
    
}

const deleteExtraction = (req, res) => {
    const data = req.body
    try {
        const extract = Extraction.findByPk(data.extractId)
        if (!extract){
            return res.status(404).send({message:'Extraction not found'})
        }
        if (extract.userId !== req.userId){
            return res.status(401).send({
                message: "Unauthorized!"
            });
        }
        fs.unlink(extract.extract_file, function (err) {
            if (err) throw err;
            // if no error, file has been deleted successfully
            console.log('File deleted!');
        });
        extract.destroy()
        res.send({message:'Delete Extraction successfully!'})
        
    } catch (error) {
        console.log(error.message)
        res.status(500).send({ message: error.message }); 
    }
    
}

const all = (req, res) => {
    const data = req.body
    try {
        const extracts = Extraction.findAll({
            where: {
                projectId: data.projectId,
            },
            //attributes: { exclude: ['userId',]}
        })
        if (extracts){
            if (extracts[0].userId !== req.userId){
                return res.status(401).send({
                    message: "Unauthorized!"
                });
            }
        }
        res.send({data: extracts})
    } catch (error) {
        console.log(error.message)
        res.status(500).send({ message: error.message }); 
    }
}

const show = (req, res) => {
    const data = req.body
    try {
        const extract = Extraction.findOne({
            where:{id:data.extractId},
            //attributes: { exclude: ['userId',]}
        })
        if (extract.userId !== req.userId){
            return res.status(401).send({
                message: "Unauthorized!"
            });
        }
        res.send({data:extract})
        
    } catch (error) {
        console.log(error.message)
        res.status(500).send({ message: error.message }); 
    }
    
}

const resultFile = (req, res) => {
    
}

export default {newExtraction, deleteExtraction, all, show, resultFile}