import { HistologyImage, HistologyROI, MSI, Registration } from "../db/db";
import fs from 'fs'

const newRegistration = async (req, res) => {
    const data = req.body
    try {
        //const dataset = await Dataset.findByPk(data.datasetId)
        const msi = await MSI.findOne({where:{datasetId:datasetId}})
        const hist = await HistologyImage.findOne({where:{datasetId:datasetId}})
        const registration = await Registration.create({
            perform_type: data.perform_type,
            transform_type: data.transform_type,
            datasetId: data.datasetId,
            msiId: msi.id,
            histologyImageId: hist.id,
            histologyroiId: data.histologyroiId
        })
        res.json({message: "Registration was created successfully!"})

        // run script
        
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ message: error.message });
    }
}

const deleteRegistration = async (req, res) => {
    const data = req.body
    try {
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
            fs.unlink(registration.transform_matrix_file, function (err) {
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
        const registration = await Registration.findByPk(data.registrationId)
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
            attributes:['id', 'imzml_file']
        })
        if (registration.histologyroiId){
            const roi = await HistologyROI.findByPk(registration.histologyroiId)
            res.json({
                userId: registration.userId,
                datasetId: msi.datasetId,
                image: image,
                msi: msi,
                perform_type: registration.perform_type,
                transform_type: registration.transform_type,
                roi: roi.points
            })
        }else{
            res.json({
                datasetId: msi.datasetId,
                image: image,
                msi: msi,
                perform_type: registration.perform_type,
                transform_type: registration.transform_type,
                roi: undefined
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
            registration.save()
            msi.min_mz = data.min_mz
            msi.max_mz = data.max_mz
            msi.msi_h = data.msi_h
            msi.msi_w = data.msi_w
            msi.processed_data_file = data.processed_data_file
            msi.save()
        }else{
            //handle status ERROR
            registration.status = 'error'
        }
        
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ message: error.message });
    }
}

export default {newRegistration, deleteRegistration, all, show, getParameter, setParameter}