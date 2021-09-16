import express from 'express'
import controller from '../controllers/job.controller'

let router = express.Router();

router.post('/error', controller.errorHandler)

export default router