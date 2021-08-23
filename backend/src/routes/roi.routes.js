import express from 'express'
import controller from '../controllers/roi.controller'
import {authJwt} from '../middleware'

let router = express.Router();

router.post('/new', authJwt.verifyToken, controller.newROI)

router.get('/show', authJwt.verifyToken, controller.show)

router.get('/points', authJwt.verifyToken, controller.all)

router.get('/allmask', authJwt.verifyToken, controller.allmask)

router.get('/allroi', authJwt.verifyToken, controller.allROI)

router.post('/get_parameter', controller.getParameter)

router.post('/set_parameter', controller.setParameter)

export default router