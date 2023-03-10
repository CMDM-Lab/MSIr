import { Dataset, HistologyImage, MSI, } from "../db/db";
import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv-defaults'

dotenv.config()

const histDir = process.env.DIR_HIST
const msiDir = process.env.DIR_MSI
const exampleImzML = process.env.EXAMPLE_IMZML
const exampleIdb = process.env.EXAMPLE_IDB
const exampleHistology = process.env.EXAMPLE_HISTOLOGY

const all = async (req, res) => {
    try {
        const datasets = await Dataset.findAll({
            where: {
                userId: req.userId
              },
            //attributes: ['id', 'name','description',]
        })
        if (datasets.length>0){
            if (datasets[0].userId !== req.userId){
                return res.status(403).json({
                    message: "Access is denied!"
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
        const dataset = await Dataset.findByPk(data.datasetId)
        if (!dataset){
            return res.status(404).json({
                message: "Not Found"
            })
        }

        if (dataset.userId !== req.userId){
            return res.status(403).json({
                message: "Access is denied!"
            });
        }
        const msi = await MSI.findOne({
            where:{
                datasetId:data.datasetId
            },
            attributes:['datasetId', 'ibd_file', 'imzml_file', 'id']
        })
        const hist = await HistologyImage.findOne({
            where:{
                datasetId:data.datasetId
            },
            attributes:['datasetId', 'file', 'id']
        })

        //res.json({dataset:dataset, msi:msi, histologyImage:hist})
        res.json({dataset:dataset, 
            msi:msi?{datasetId: msi.datasetId, msiId: msi.id, ibd_file:path.basename(msi.ibd_file),imzml_file:path.basename(msi.imzml_file)}:null, 
            histologyImage:hist?{datasetId:hist.datasetId, histologyImageId: hist.id, file: path.basename(hist.file)}:null})
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ message: error.message }); 
    }
}

const example = async (req, res) => {
    try {
        const dataset = await Dataset.create({
            name:'Example Dataset',
            description:"This is an example dataset.",
            userId:req.userId
        })
        fs.mkdir(path.join(histDir,dataset.id.toString()),{ recursive: true }, (err) => {
            if (err) throw err;
          });
        fs.mkdir(path.join(msiDir,dataset.id.toString()),{ recursive: true }, (err) => {
            if (err) throw err;
          })
        //create MSI with information into db and copy example imzML and ibd file to dataset dir 
        const msi = await MSI.create({
            data_type:'imzML',
            imzml_file: 'example.imzml',
            ibd_file: 'example.ibd',
            bin_size: 0.01,
            // pixel_size: 150,
            datasetId:dataset.id,
            userId: req.userId
        })
        //copy example imzML file
        fs.copyFile(exampleImzML,path.join(msiDir,dataset.id.toString(),'example.imzml'),(err) => {
            if (err) throw err;
          })
        //copy example ibd file
        fs.copyFile(exampleIdb,path.join(msiDir,dataset.id.toString(),'example.ibd'),(err) => {
            if (err) throw err;
          })
        //create histology image into db and copy example image file to dataset dir 
        const hist = await HistologyImage.create({
            file: 'example.png',
            datasetId: dataset.id,
            userId: req.userId
        })
        //copy example histology image file
        fs.copyFile(exampleHistology,path.join(histDir,dataset.id.toString(),'example.png'),(err) => {
            if (err) throw err;
          })
        res.json({message: "Dataset was created successfully!", datasetId: dataset.id})

    } catch (error) {
        console.log(error.message)
        res.status(500).json({ message: error.message });
    }
    
}

const edit = async (req, res) => {
    const data = req.body
    try {
        const dataset = await Dataset.findByPk(data.datasetId)
        if (!dataset){
            return res.status(404).json({message:'Dataset not found'})
        }
        if (dataset.userId !== req.userId){
            return res.status(403).json({
                message: "Access is denied!"
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
    console.log(data)
    try {
        const dataset = await Dataset.create({
            name:data.name,
            description:data.description,
            userId:req.userId
        })
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
    const {datasetId} = req.body
    console.log(req.body)
    try {
        const dataset = await Dataset.findByPk(datasetId)
        if (!dataset){
            return res.status(404).json({message:'Dataset not found'})
        }
        if (dataset.userId !== req.userId){
            return res.status(403).json({
                message: "Access is denied!"
            });
        }
        /* Need to remove relation record from db */
        const msi = await MSI.findOne({where:{datasetId:datasetId}})
        const hist = await HistologyImage.findOne({where:{datasetId:datasetId}})
        if (msi){
            await msi.destroy()
        }
        if (hist){
            await hist.destroy()
        }
        
        fs.rmdir(path.join(histDir,dataset.id.toString()), { recursive: true }, (err) => {
            if (err) {throw err;}
            console.log(`${path.join(histDir,dataset.id.toString())} is deleted!`);
        });
        fs.rmdir(path.join(msiDir,dataset.id.toString()), { recursive: true }, (err) => {
            if (err) {throw err;}
            console.log(`${path.join(msiDir,dataset.id.toString())} is deleted!`);
        });
        await dataset.destroy()

        return res.json({message:"Delete dataset successfully!"})

    } catch (error) {
        console.log(error.message)
        res.status(500).json({ message: error.message });
    }
    
}

export default {all, show, example, edit, newDataset, deleteDataset}