import express from 'express'
import uploadController from '../controllers/uploadFile.controller'

let router = express.Router();

router.post('/new', uploadController.uploadMSI)

router.post('/update')

router.post('/sumbit')

export default router