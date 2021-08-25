import express from 'express'
import controller from '../controllers/project.controller'
import {authJwt} from '../middleware'

let router = express.Router();

router.get('/all', authJwt.verifyToken, controller.all)

router.get('/show', authJwt.verifyToken, controller.show)

router.post('/example', authJwt.verifyToken, controller.example)

router.put('/edit', authJwt.verifyToken, controller.edit)

router.post('/new', authJwt.verifyToken, controller.newProject)

router.delete('/delete', authJwt.verifyToken, controller.deleteProject)

export default router