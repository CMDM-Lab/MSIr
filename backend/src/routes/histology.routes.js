import express from 'express'
import uploadController from '../controllers/uploadFile.controller'

let router = express.Router();

router.post('/new',uploadController.uploadHistology)

router.post('/update')

router.get('/show')

export default router