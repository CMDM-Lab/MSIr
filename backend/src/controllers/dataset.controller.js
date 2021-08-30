import { Dataset } from "../db/db";
import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv-defaults'

dotenv.config()

const histDir = process.env.DIR_HIST
const msiDir = process.env.DIR_MSI

const all = async (req, res) => {
    try {
        const datasets = await Dataset.findAll({
            where: {
                userId: req.userId
              },
            //attributes: ['id', 'name','description',]
        })
        if (datasets){
            if (datasets[0].userId !== req.userId){
                return res.status(401).json({
                    message: "Unauthorized!"
                });
            }
        }
        res.json({data:datasets})
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ message: error.message }); 
    }
}

const show = async (req, res) => {
    const data = req.query
    try {
        const dataset = await Dataset.findOne({
            where:{
                id:data.datasetId
            },
            //attributes: ['id', 'name','description',]
        })
        if (!dataset){
            return res.status(404).json({
                message: "Not Found"
            })
        }

        if (dataset.userId !== req.userId){
            return res.status(401).json({
                message: "Unauthorized!"
            });
        }
        res.json({data:dataset})
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ message: error.message }); 
    }
}

const example = (req, res) => {
    
}

const edit = async (req, res) => {
    const data = req.body
    try {
        const dataset = await Dataset.findByPk(data.datasetId)
        if (!dataset){
            return res.status(404).json({message:'Dataset not found'})
        }
        if (dataset.userId !== req.userId){
            return res.status(401).json({
                message: "Unauthorized!"
            });
        }
        dataset.name = data.name
        dataset.description = data.description
        await dataset.save()
        res.json({message: "Dataset was updated successfully!"})

    } catch (error) {
        console.log(error.message)
        res.status(500).json({ message: error.message });
    }
    
}

const newDataset = async (req, res) => {
    const data = req.body
    try {
        const dataset = await Dataset.create({
            name:data.name,
            description:data.description,
            userId:req.userId
        })
        console.log(histDir)
        fs.mkdir(path.join(histDir,dataset.id.toString()),{ recursive: true }, (err) => {
            if (err) throw err;
          });
        fs.mkdir(path.join(msiDir,dataset.id.toString()),{ recursive: true }, (err) => {
            if (err) throw err;
          })
        res.json({message: "Dataset was created successfully!", datasetId: dataset.id})

    } catch (error) {
        console.log(error.message)
        res.status(500).json({ message: error.message });
    }
}

const deleteDataset = async (req, res) => {
    const data = req.body
    try {
        const dataset = await Dataset.findByPk(data.datasetId)
        if (!dataset){
            return res.status(404).json({message:'Dataset not found'})
        }
        if (dataset.userId !== req.userId){
            return res.status(401).json({
                message: "Unauthorized!"
            });
        }
        /* Need to remove relation record from db */

        dataset.drop()

    } catch (error) {
        console.log(error.message)
        res.status(500).json({ message: error.message });
    }
    
}

export default {all, show, example, edit, newDataset, deleteDataset}