import express from 'express'
import controller from '../controllers/histology.controller'
import {authJwt} from '../middleware'

let router = express.Router();

router.post('/new', authJwt.verifyToken ,controller.newHistologyImg)

router.post('/submit',authJwt.verifyToken, controller.submit)

router.get('/information', authJwt.verifyToken, controller.information)

export default router