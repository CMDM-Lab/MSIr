import { Project } from "../db/db";
import fs from 'fs'
import path from 'path'

fileDir = process.env.FILEDIR

const all = async (req, res) => {
    try {
        const projects = await Project.findAll({
            where: {
                userId: req.userId
              },
            //attributes: ['id', 'name','description',]
        })
        if (projects){
            if (projects[0].userId !== req.userId){
                return res.status(401).json({
                    message: "Unauthorized!"
                });
            }
        }
        res.json({data:projects})
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ message: error.message }); 
    }
}

const show = async (req, res) => {
    const data = req.body
    try {
        const project = await Project.findOne({
            where:{
                id:data.projectId
            },
            //attributes: ['id', 'name','description',]
        })
        if (project.userId !== req.userId){
            return res.status(401).json({
                message: "Unauthorized!"
            });
        }
        res.json({data:project})
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ message: error.message }); 
    }
}

const example = (req, res) => {
    
}

const edit = async (req, res) => {
    const data = req.body
    try {
        const project = await Project.findByPk(req.projectId)
        if (!project){
            res.status(404).json({message:'Project not found'})
        }
        if (project.userId !== req.userId){
            return res.status(401).json({
                message: "Unauthorized!"
            });
        }
        project.name = data.name
        project.description = data.description
        await project.save()
        res.json({message: "Project was updated successfully!"})

    } catch (error) {
        console.log(error.message)
        res.status(500).json({ message: error.message });
    }
    
}

const newProject = async (req, res) => {
    const data = req.body
    try {
        const project = await Project.create({
            name:data.name,
            description:data.description,
            userId:req.userId
        })
        fs.mkdir(path.join(fileDir,project.id))
        res.json({message: "Project was created successfully!"})

    } catch (error) {
        console.log(error.message)
        res.status(500).json({ message: error.message });
    }
}

const deleteProject = (req, res) => {
    const data = req.body
    try {
        const project = await Project.findByPk(req.projectId)
        if (!project){
            return res.status(404).json({message:'Project not found'})
        }
        if (project.userId !== req.userId){
            return res.status(401).json({
                message: "Unauthorized!"
            });
        }
        /* Need to remove relation record from db */

        project.drop()

    } catch (error) {
        console.log(error.message)
        res.status(500).json({ message: error.message });
    }
    
}

export default {all, show, example, edit, newProject, deleteProject}