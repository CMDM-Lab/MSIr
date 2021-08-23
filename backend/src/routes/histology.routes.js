import express from 'express'
import controller from '../controllers/histology.controller'
import {authJwt} from '../middleware'

let router = express.Router();

router.post('/new', authJwt.verifyToken ,controller.newHistologyImg)

router.post('/update',authJwt.verifyToken, controller.update)

router.get('/show', authJwt.verifyToken, controller.show)

export default router