import express from 'express'
import controller from '../controllers/registration.controller'
import {authJwt} from '../middleware'

let router = express.Router();

router.post('/new', authJwt.verifyToken, controller.newRegistration)

router.post('/delete', authJwt.verifyToken, controller.deleteRegistration)

router.get('/all', authJwt.verifyToken, controller.all)

router.get('/show', authJwt.verifyToken, controller.show)

//router.get('/resultimg')

//router.get('/matrixfile')

//router.get('/idxfile')

router.post('/get_parameter', controller.getParameter)

router.post('/set_parameter', controller.setParameter)

export default router