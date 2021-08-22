import {MSI, HistologyImage} from '../db/db'
import {uploadMSIMiddleware,uploadHistologyMiddleware} from '../middleware'
import path from 'path'

const uploadMSI = async (req, res, next) => {

    const imzml_file = req.files.filter(file=> file.toLowerCase().endsWith('imzml'))
    const ibd_file = req.files.filter(file=> file.toLowerCase().endsWith('ibd'))
    const data = req.body

    try{
        await uploadMSIMiddleware(req,res)
        console.log(req.files);

        if (req.files.length !== 2) {
            return res.status(400).json({message:'You must upload 2 files (*.imzML and *.ibd) simultaneously.'});
        }

        const msiData = await MSI.create({
            data_type:'imzML',
            imzml_file:path.join(DIR,imzml_file),
            ibd_file:path.join(DIR,ibd_file),
            projectId: data.projectId,
            userId: data.userId
        });
        res.status(201).json({
            message: "Uploaded!",
            msi: {
                msiId: msiData.id,
                imzml_file: msiData.imzml_file,
                ibd_file: msiData.ibd_file
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

const uploadHistology = async (req, res, next) => {

    const data = req.body
    
    try {
        await uploadHistologyMiddleware(req,res)
        console.log(req.files);

        if (req.file == undefined) {
            return res.status(400).json({ message: "Please upload a file!" });
        }

        const histologyImage = await HistologyImage.create({
            file: path.join(DIR,req.files[0]),
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

export default {uploadMSI,uploadHistology}