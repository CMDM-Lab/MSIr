import { Job } from "../db/db";

export const runWaitingJob = async () => {
    try {
        if (hasJobRunning){
            return true
        }
        const job = await Job.findOne({
            where:{
                status: 'WAITING'
            }
        })
        if (job){
            switch(job.task){
                case 'registration':
                    runRegistration(job.taskId)
                    break
                case 'extraction':
                    runExtraction(job.taskId)
                    break
                default:
                    break
            }
            job.status = 'RUNNING'
            await job.save()
            return true
        }
        return false
    } catch (error) {
        console.log(error)
    }
}

export const rerunErrorJob = () => {
    try {
        if (hasJobRunning){
            return true
        }
        const job = await Job.findOne({
            where:{
                status: ERROR
            }
        })
        if (job){
            switch(job.task){
                case 'registration':
                    runRegistration(job.taskId)
                    break
                case 'extraction':
                    runExtraction(job.taskId)
                    break
                default:
                    break
            }
            job.status = 'RUNNING'
            await job.save()
            return true
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

export const runRegistration = (id) => {

}

export const runExtraction = (id) => {

}