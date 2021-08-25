import express from 'express'
import controller from '../controllers/extraction.controller'
import {authJwt} from '../middleware'

let router = express.Router();

router.post('/new', authJwt.verifyToken, controller.newExtraction)

router.delete('/delete', authJwt.verifyToken, controller.deleteExtraction)

router.get('/all', authJwt.verifyToken, controller.all)

router.get('/show', authJwt.verifyToken, controller.show)

//router.get('/resultfile')

router.post('/get_parameter', controller.getParameter)

router.post('/set_parameter', controller.setParameter)

export default router