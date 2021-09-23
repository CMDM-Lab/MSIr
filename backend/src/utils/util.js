import { Job } from "../db/db";
import { runExtractionScript, runRegistrationScript } from "./runScript";
import pkg from 'sequelize';
const { Op } = pkg

const runWaitingJob = async () => {
    try {
        if (await hasJobRunning()){
            return true
        }
        const job = await Job.findOne({
            where:{
                status: 'WAITING'
            }
        })
        if (job){
            console.log('sep job type')
            switch(job.task){
                case 'R':
                    runRegistrationScript(job.taskId)
                    break
                case 'E':
                    runExtractionScript(job.taskId)
                    break
                default:
                    break
            }
            job.status = 'RUNNING'
            job.attempts =job.attempts+1
            await job.save()
            return true
        }
        return false
    } catch (error) {
        console.log(error)
    }
}

const rerunErrorJob = async () => {
    try {
        if (await hasJobRunning()){
            return true
        }
        const job = await Job.findOne({
            where:{
                status: 'ERROR',
                attempts:{[Op.lt]:3}
            }
        })
        if (job){
            if (job.attempts<3){
                switch(job.task){
                case 'R':
                    runRegistrationScript(job.taskId)
                    break
                case 'E':
                    runExtractionScript(job.taskId)
                    break
                default:
                    break
                }
                job.status = 'RUNNING'
                job.attempts =job.attempts+1
                await job.save()
                return true
            }   
        }
        return false
    } catch (error) {
        console.log(error)
    }
}

export const finishJob = async (task, taskId) => {
    try {
        const job = await Job.findOne({
            where:{
                task,
                taskId
            }
        })
        if (job){
            job.status = 'FINISH'
            await job.save()
        }        
    } catch (error) {
        console.log(error)
    }
}

const hasJobRunning = async () => {
    try {
        const jobs = await Job.findAll({
            where:{
                status: "RUNNING"
            }
        })
        if (jobs.length>0){
            return true
        }else{
            return false
        }
    } catch (error) {
        console.log(error)  
    }
}

export const runJobs = async () => {
    var running = false
    console.log(running)
    running = await runWaitingJob()
    console.log(running)
    if (!running){
        rerunErrorJob()
    }
}