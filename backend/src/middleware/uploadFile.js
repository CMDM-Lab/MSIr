import multer from 'multer'
import util from 'util'
import path from 'path'
import dotenv from 'dotenv-defaults'

dotenv.config()

const DIR = process.env.ROOT_STORAGE
const DIR_HIST = process.env.DIR_HIST
const DIR_MSI = process.env.DIR_MSI

const storage_msi = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(DIR_MSI,req.query.datasetId));
    },
    filename: (req, file, cb) => {
        const fileName = file.originalname.toLowerCase().split(' ').join('-');
        cb(null, fileName)
    }
});

const storage_hist = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(DIR_HIST,req.query.datasetId));
    },
    filename: (req, file, cb) => {
        const fileName = file.originalname.toLowerCase().split(' ').join('-');
        cb(null, fileName)
    }
});

//filename: 'test.ibd', type: 'application/octet-stream'

var upload_MSI = multer({
    storage: storage_msi,
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
    storage: storage_hist,
    fileFilter: (req, file, cb) => {
        if (file.mimetype == "image/png" || file.mimetype == "image/jpeg" || file.mimetype == 'image/tiff') {
            cb(null, true);
        } else {
            cb(null, false);
            return cb(new Error('File type not accepted (.png, .jpeg, .jpg, .tif)'));
        }
    }
});

export var uploadMSIMiddleware = util.promisify(upload_MSI.single('file'))
export var uploadHistologyMiddleware = util.promisify(upload_Histology.single('file'))

export default {uploadMSIMiddleware,uploadHistologyMiddleware}