import express from 'express'
import controller from '../controllers/msi.controller'
import {authJwt} from '../middleware'

let router = express.Router();

router.post('/new', authJwt.verifyToken, controller.newMSI)

//router.post('/update', authJwt.verifyToken, controller.updateMSI)

router.post('/submit', authJwt.verifyToken, controller.submitMSI)

router.get('/get', authJwt.verifyToken, controller.getMSI)

export default router