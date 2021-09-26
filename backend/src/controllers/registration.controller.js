import { HistologyImage, HistologyROI, Job, MSI, Registration } from "../db/db";
import fs from 'fs'
import path from 'path'
import { finishJob, runJobs } from "../utils/util";
import dotenv from 'dotenv-defaults'

dotenv.config()

const histDir = process.env.DIR_HIST

const newRegistration = async (req, res) => {
    const data = req.body
    try {
        //const dataset = await Dataset.findByPk(data.datasetId)
        const msi = await MSI.findOne({where:{datasetId:data.datasetId}})
        const hist = await HistologyImage.findOne({where:{datasetId:data.datasetId}})
        const registration = await Registration.create({
            perform_type: data.perform_type,
            transform_type: data.transform_type,
            datasetId: data.datasetId,
            msiId: msi.id,
            histologyImageId: hist.id,
            histologyroiId: data.histologyroiId,
            userId: req.userId,
            DR_method: data.DR_method
        })
        res.json({message: "Registration was created successfully!"})

        // run script
        const job = await Job.create({
            task:'R',
            taskId:registration.id,
            status:'WAITING'
        })
        console.log('job save')
        await runJobs()
        console.log('job run')
        
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ message: error.message });
    }
}

const deleteRegistration = async (req, res) => {
    const data = req.body
    try {
        const job = await Job.findOne({
            where:{
                task:'R',
                taskId: data.registrationId
            }
        })
        job.destroy()
        const registration = await Registration.findByPk(data.registrationId)
        if (!registration){
            return res.status(404).json({message:'This registration is not found.'})
        }
        if (registration.userId !== req.userId){
            return res.status(403).json({message: "Access is denied!"})
        }
        if (registration.status==='running'){
            return res.status(404).json({message:'This registration is being implement, please retry after a while.'})
        }
        if (registration.transform_matrix_file){
            fs.unlink(path.join(histDir,registration.datasetId.toString(),registration.transform_matrix_file), function (err) {
                if (err) throw err;
                // if no error, file has been deleted successfully
                console.log('File deleted!');
            });
        }
        if (registration.result_file){
            fs.unlink(path.join(histDir,registration.datasetId.toString(),registration.result_file), function (err) {
                if (err) throw err;
                // if no error, file has been deleted successfully
                console.log('File deleted!');
            });
        }
        registration.destroy()
        res.json({message:'Delete Registration successfully!'})
        
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ message: error.message });
    }

}

const all = async (req, res) => {
    const data = req.query
    try {
        const registrations = await Registration.findAll({
            where: {
                datasetId: data.datasetId,
            },
            include: HistologyROI
        })
        if (registrations.length===0){
            return res.json({data:[]})
        }else{
            if (registrations[0].userId !== req.userId){
                return res.status(403).json({
                    message: "Access is denied!"
                })
            }
        }
        res.json({data:registrations})
        
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ message: error.message });
    }
}

const show = async (req, res) => {
    const data = req.query
    try {
        const registration = await Registration.findByPk(data.registrationId,{include:HistologyROI})
            //attributes: { exclude: ['userId',]}
        if (!registration){
            return res.status(404).json({message: "Not Found"})
        }
        if (registration.userId !== req.userId){
            return res.status(403).json({
                message: "Access is denied!"
            });
        }
        res.json({data:registration})
        
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ message: error.message });
    }
}

const getParameter = async (req, res) => {
    const data = req.body
    try {
        const registration = await Registration.findByPk(data.id)
        const image = await HistologyImage.findOne({
            where:{id:registration.histologyImageId},
            attributes:['id', 'file']
        })
        const msi = await MSI.findOne({
            where:{id:registration.msiId},
            attributes:['id', 'imzml_file', 'bin_size']
        })
        if (registration.histologyroiId){
            const roi = await HistologyROI.findByPk(registration.histologyroiId)
            res.json({
                userId: registration.userId,
                datasetId: registration.datasetId,
                image: image,
                msi: msi,
                perform_type: registration.perform_type,
                transform_type: registration.transform_type,
                roi: {points:roi.points, id:roi.id},
                DR_method: registration.DR_method
            })
        }else{
            res.json({
                userId: registration.userId,
                datasetId: registration.datasetId,
                image: image,
                msi: msi,
                perform_type: registration.perform_type,
                transform_type: registration.transform_type,
                roi: null,
                DR_method: registration.DR_method
            })
        }
        registration.status = 'running'
        registration.save()
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ message: error.message });
    }
    
}

const setParameter = async (req, res) => {
    const data = req.body
    try {
        const registration = await Registration.findByPk(data.id)
        const msi = await MSI.findByPk(registration.msiId)
        if (data.status == 'SUCCESS'){    
            registration.status = 'finished'
            registration.transform_matrix_file = data.transform_matrix_file
            registration.result_file = data.result_file
            registration.histologyroiId = data.mask_id
            registration.save()
            msi.min_mz = data.min_mz
            msi.max_mz = data.max_mz
            msi.msi_h = data.msi_h
            msi.msi_w = data.msi_w
            msi.processed_data_file = data.processed_data_file
            msi.save()
            await finishJob('R',registration.id)
        }else{
            //handle status ERROR
            registration.status = 'error'
            registration.save()
        }
        res.status(200).json({status:'SUCCESS'})
        runJobs()
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ message: error.message });
    }
}

export default {newRegistration, deleteRegistration, all, show, getParameter, setParameter}