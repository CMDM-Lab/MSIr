import { Job } from "../db/db";

const errorHandler = async (req, res) => {
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
        // send mail to admin with error message
    } catch (error) {
        console.log(error)
    }
}

export default {errorHandler}