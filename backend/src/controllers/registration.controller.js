import { Registration } from "../db/db";
import fs from 'fs'

const newRegistration = (req, res) => {
    const data = req.body
    try {
        const project = await Project.findByPk(data.projectId)
        const registration = await Registration.create({
            perform_type: data.perform_type,
            transform_type: data.transform_type,
            projectId: data.projectId,
            msiId: project.msiId,
            histologyImageId: project.histologyImageId,
            histologyroiId: project.histologyroiId
        })
        res.send({message: "Registration was created successfully!"})

        // run script
        
    } catch (error) {
        console.log(error.message)
        res.status(500).send({ message: error.message });
    }
}

const deleteRegistration = async (req, res) => {
    const data = req.body
    try {
        const registration = await Registration.findByPk(data.registrationId)
        if (registration.userId !== req.userId){
            return res.status(401).send({message: "Unauthorized!"})
        }
        if (registration.status==='running'){
            return res.status(404).send({message:'This registration is being implement, please retry after a while.'})
        }
        if (registration.transform_matrix_file){
            fs.unlink(registration.transform_matrix_file, function (err) {
                if (err) throw err;
                // if no error, file has been deleted successfully
                console.log('File deleted!');
            });
        }
        registration.destroy()
        res.send({message:'Delete Registration successfully!'})
        
    } catch (error) {
        console.log(error.message)
        res.status(500).send({ message: error.message });
    }

}

const all = (req, res) => {
    const data = req.body
    try {
        const registrations = Registration.findAll({
            where: {
                projectId: data.projectId,
            },
        })
        if (registrations){
            if (registrations[0].userId !== req.userId){
                return res.status(401).send({
                    message: "Unauthorized!"
                })
            }
        }
        res.send({data:registrations})
        
    } catch (error) {
        console.log(error.message)
        res.status(500).send({ message: error.message });
    }
}

const show = (req, res) => {
    const data = req.body
    try {
        const registration = Registration.findOne({
            where: {
                id: data.registrationId,
            },
            //attributes: { exclude: ['userId',]}
        })
        if (registration.userId !== req.userId){
            return res.status(401).send({
                message: "Unauthorized!"
            });
        }
        res.send({data:registration})
        
    } catch (error) {
        console.log(error.message)
        res.status(500).send({ message: error.message });
    }
}

const resultImg = (req, res) => {
    
}

const matrixFile = (req, res) => {
    
}

const idxFile = (req, res) => {
    
}

export default {newRegistration, deleteRegistration, all, show, resultImg, matrixFile, idxFile}