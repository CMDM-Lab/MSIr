import express from 'express'
import controller from '../controllers/roi.controller'
import {authJwt} from '../middleware'

let router = express.Router();

router.post('/new', controller.newROI)

router.get('/show', authJwt.verifyToken, controller.show)

router.get('/all', authJwt.verifyToken, controller.all)

router.get('/allmask', authJwt.verifyToken, controller.allmask)

router.get('/allroi', authJwt.verifyToken, controller.allROI)

router.delete('/delete',authJwt.verifyToken, controller.deletROIs)

router.post('/new_batch', authJwt.verifyToken, controller.newROIs)

router.post('/get_parameter', controller.getParameter)

router.post('/set_parameter', controller.setParameter)

export default router