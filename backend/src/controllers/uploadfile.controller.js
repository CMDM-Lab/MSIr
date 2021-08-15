import {MSIdata, HistologyImage} from '../db/db'
import {uploadMSIMiddleware,uploadHistologyMiddleware} from '../middleware'
import path from 'path'

const uploadMSI = async (req, res, next) => {

    const imzml_file = req.files.filter(file=> file.toLowerCase().endsWith('imzml'))
    const ibd_file = req.files.filter(file=> file.toLowerCase().endsWith('ibd'))

    try{
        await uploadMSIMiddleware(req,res)
        console.log(req.files);

        if (req.files.length !== 2) {
            return res.status(400).json({message:'You must select 2 files.'});
        }

        const msiData = await MSIdata.create({
            data_type:'imzML',
            imzml_file:path.join(DIR,imzml_file),
            ibd_file:path.join(DIR,ibd_file),
            projectId: req.body.projectId
        });
        res.status(201).json({
            message: "Uploaded!",
            userCreated: {
                _id: result._id,
                imagesArray: result.imagesArray
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
    
    try {
        await uploadHistologyMiddleware(req,res)
        console.log(req.files);

        if (req.file == undefined) {
            return res.status(400).send({ message: "Please upload a file!" });
        }

        const histologyImage = await HistologyImage.create({
            file: path.join(DIR,req.files[0]),
            projectId: req.body.projectId
        })
        res.status(201).json({
            message: "Uploaded!",
            userCreated: {
                _id: result._id,
                imagesArray: result.imagesArray
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