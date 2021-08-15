import express from 'express'
import controller from '../controllers/uploadfile.controller'

let router = express.Router();

router.post('/MSIdata-upload', controller.uploadMSI)

router.post('/Histology-upload',controller.uploadHistology)

export default router;