import { Dataset, MSI } from "../db/db";
import {uploadMSIMiddleware} from '../middleware'
import path from 'path'
import fs from 'fs'
/*import dotenv from 'dotenv-defaults'
dotenv.config()
const DIR_MSI = process.env.DIR_MSI*/

const newMSI = async (req, res) => {

    const dataset = await Dataset.findByPk(Number(req.query.datasetId))
    if (req.userId !== dataset.userId){
        return res.status(403).json({
            message: "Access is denied!"
        });
    }

    try{
        await uploadMSIMiddleware(req,res)
        let msi = await MSI.findOne({
            where:{
                datasetId: req.query.datasetId
            }
        })
        if (msi){
            if (req.file.path === msi.imzml_file){
                return res.status(201).json({
                            message: "ImzML file Uploaded!",
                            msi: {
                                msiId: msi.id,
                                imzml_file: path.basename(msi.imzml_file),
                            }
                })
            }
            if (req.file.path === msi.ibd_file){
                return res.status(201).json({
                    message: "Ibd file Uploaded!",
                    msi: {
                        msiId: msi.id,
                        ibd_file: path.basename(msi.ibd_file),
                    }
                })
            }
            if (req.file.path.toLowerCase().endsWith('imzml')){
                if (msi.imzml_file!==''){
                     fs.unlink(msi.imzml_file, function (err) {
                        if (err) throw err;
                        console.log('imzML file deleted!');
                    });
                }
               
                msi.imzml_file = req.file.path
                await msi.save()
                return res.status(201).json({
                            message: "ImzML file Uploaded!",
                            msi: {
                                msiId: msi.id,
                                imzml_file: path.basename(msi.imzml_file),
                            }
                        })
            }
            if (req.file.path.toLowerCase().endsWith('ibd')){
                if (msi.ibd_file!==''){
                    fs.unlink(msi.ibd_file, function (err) {
                        if (err) throw err;
                        console.log('ibd file deleted!');
                    });
                }
                
                msi.ibd_file = req.file.path
                await msi.save()
                return res.status(201).json({
                            message: "Ibd file Uploaded!",
                            msi: {
                                msiId: msi.id,
                                ibd_file: path.basename(msi.ibd_file),
                            }
                        })
            }
            
        }else{
            msi = await MSI.create({
                data_type:'imzML',
                imzml_file: req.file.path.toLowerCase().endsWith('imzml')? req.file.path : '',
                ibd_file: req.file.path.toLowerCase().endsWith('ibd')? req.file.path : '',
                datasetId: req.query.datasetId,
                userId: req.userId
            })
            return res.status(201).json({
                        message: "Uploaded!",
                        msi: {
                            msiId: msi.id,
                            imzml_file: path.basename(msi.imzml_file),
                            ibd_file: path.basename(msi.ibd_file),
                        }
                    })
        }

    }
    catch(err){
            console.log(err),
            res.status(500).json({
                message: 'Error',
                error: err
            });
    }
}

const submitMSI = async (req, res) => {

    const data = req.body

    try {

        const msiData = await MSI.findByPk(data.msiId)
        console.log(msiData)
        console.log(req.userId)
        
        if (msiData.userId !== req.userId){
            return res.status(403).json({
                message: "Access is denied!"
            });
        }

        msiData.bin_size = data.bin_size
        msiData.pixel_size = data.pixel_size
        msiData.save()

        res.json({message:'MSI data has been saved!'})

    } catch (error) {
        res.status(500).json({ message: error.message }); 
    }
    
}

const getMSI = async (req, res) => {

    const {datasetId} = req.query

    try {

        const msiData = await MSI.findOne({
            where:{
                datasetId: datasetId
            }
        })
        
        if (msiData){
            if (msiData.userId !== req.userId){
                return res.status(403).json({
                    message: "Access is denied!"
                });
            }

            res.json({msi:
                {msiId:msiData.id,
                datasetId: msiData.datasetId, 
                ibd_file:path.basename(msiData.ibd_file),
                imzml_file:path.basename(msiData.imzml_file),
                bin_size: msiData.bin_size,
                pixel_size: msiData.pixel_size
            }})
        }else{
            res.json({msi:{}})
        }
    } catch (error) {
        res.status(500).json({ message: error.message }); 
    }
    
}

export default {newMSI, submitMSI, getMSI}
