import { Extraction, Job, Registration } from "../db/db";

const errorHandler = async (req, res) => {
    console.log('error')
    const data = req.body
    try {
        const job = await Job.findOne({
            where:{
                task: data.task,
                taskId: data.taskId
            }
        })
        if (job){
            job.message = data.message
            job.status = 'ERROR'
            job.save()
        }
        switch (data.task){
            case 'R':
                const registration = await Registration.findByPk(data.taskId)
                registration.status = 'error'
                registration.save()
                break
            case 'E':
                const extraction = await Extraction.findByPk(data.taskId)
                extraction.status = 'error'
                extraction.save()
        }
        
        // send mail to admin with error message
    } catch (error) {
        console.log(error)
    }
}

export default {errorHandler}