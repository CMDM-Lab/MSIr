import express from 'express'
import { v4 as uuidv4 } from 'uuid'
import multer from 'multer'
import {MSIdata, HistologyImage} from '../db/db'
import * as path from 'path'

let router = express.Router();

const DIR = process.env.ROOT_STORAGE

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, DIR);
    },
    filename: (req, file, cb) => {
        const fileName = file.originalname.toLowerCase().split(' ').join('-');
        cb(null, fileName)
    }
});

//filename: 'test.ibd', type: 'application/octet-stream'

var upload_MSI = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.originalname.toLowerCase().endsWith('.imzml') || file.originalname.toLowerCase().endsWith('.ibd')) {
            cb(null, true);
        } else {
            cb(null, false);
            return cb(new Error('File type not accepted (.imzML, .ibd)'));
        }
    }
});

var upload_Histology = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype == "image/png" || file.mimetype == "image/jpeg" || file.mimetype == 'image/tiff') {
            cb(null, true);
        } else {
            cb(null, false);
            return cb(new Error('File type not accepted (.png, .jpeg, .jpg, .tif)'));
        }
    }
});

router.post('/MSIdata-upload', upload_MSI.array('MSIDataArray', 2), async (req, res, next) => {

    const imzml_file = req.files.filter(file=> file.toLowerCase().endsWith('imzml'))
    const ibd_file = req.files.filter(file=> file.toLowerCase().endsWith('ibd'))

    try{
        const msiData = await MSIdata.create({
            data_type:'imzML',
            imzml_file:path.join(DIR,imzml_file),
            ibd_file:path.join(DIR,ibd_file),
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
                error: err
            });
    }
})

router.post('/Histology-upload', upload_Histology.array('histologyImagesArray', 1), async (req, res, next) => {
    
    try {
        const histologyImage = await HistologyImage.create({
            file: path.join(DIR,req.files[0])
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
                error: err
            });
    }
})

router.get("/", (req, res, next) => {
    File.find().then(response => {
        res.status(200).json({
            message: "Images fetched!",
            posts: response
        });
    });
});

export {router};