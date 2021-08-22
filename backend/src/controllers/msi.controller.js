import { MSI } from "../db/db";
import {uploadMSIMiddleware} from '../middleware'
import path from 'path'
import fs from 'fs'

const DIR_MSI = process.env.DIR_MSI

const newMSI = (req, res) => {
    const imzml_file = req.files.filter(file=> file.toLowerCase().endsWith('imzml'))
    const ibd_file = req.files.filter(file=> file.toLowerCase().endsWith('ibd'))
    const data = req.body

    try{
        if (req.files.length !== 2) {
            return res.status(400).json({message:'You must upload 2 files (*.imzML and *.ibd) simultaneously.'});
        }

        await uploadMSIMiddleware(req,res)
        console.log(req.files);

        const msiData = await MSI.create({
            data_type:'imzML',
            imzml_file:path.join(DIR_MSI,imzml_file),
            ibd_file:path.join(DIR_MSI,ibd_file),
            projectId: data.projectId,
            userId: data.userId
        });
        res.status(201).json({
            message: "Uploaded!",
            msi: {
                msiId: msiData.id,
                imzml_file: msiData.imzml_file,
                ibd_file: msiData.ibd_file,
            }
        })

    }
    catch(err){
            console.log(err),
            res.status(500).json({
                message: 'Error',
                error: err
            });
    }
}

const updateMSI = (req, res) => {
    const imzml_file = req.files.filter(file=> file.toLowerCase().endsWith('imzml'))
    const ibd_file = req.files.filter(file=> file.toLowerCase().endsWith('ibd'))
    const data = req.body

    try{
        const msiData = await MSI.findByPk(data.msiId);

        if (req.files.length !== 2) {
            return res.status(400).json({message:'You must upload 2 files (*.imzML and *.ibd) simultaneously.'});
        }

        if (msiData.userId !== req.userId){
            return res.status(401).json({
                message: "Unauthorized!"
            });
        }
        
        // remove existing files
        fs.unlink(msiData.imzml_file, function (err) {
            if (err) throw err;
            console.log('imzML file deleted!');
        });
        fs.unlink(msiData.ibd_file, function (err) {
            if (err) throw err;
            console.log('ibd file deleted!');
        });

        await uploadMSIMiddleware(req,res)
        console.log(req.files);

        msiData.imzml_file = path.join(DIR_MSI,imzml_file)
        msiData.ibd_file = path.join(DIR_MSI,ibd_file)
        await msiData.save()
        
        res.status(201).json({
            message: "Updated!",
            msi: {
                msiId: msiData.id,
                imzml_file: msiData.imzml_file,
                ibd_file: msiData.ibd_file,
            }
        })

    }
    catch(err){
            console.log(err),
            res.status(500).json({
                message: 'Error',
                error: err
            });
    }
    
}

const submitMSI = (req, res) => {

    const data = req.body

    try {

        const msiData = MSI.findByPk(data.msiId)
        
        if (msiData.userId !== req.userId){
            return res.status(401).json({
                message: "Unauthorized!"
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

export default {newMSI, updateMSI, submitMSI}
