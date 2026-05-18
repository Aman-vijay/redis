import { Worker } from "bullmq";
import { connection }  from './queue.js'

const emailWorker =  new Worker("email",async(job)=>{
    console.log(`Processing email job...`,job.id,job.name,job.data);
    (await new Promise((res)=>setTimeout(res,1500)),
    console.log("Email job completed!",job.id,job.name,job.data)
)},
{connection});

Worker.on("completed",(job)=>{
    console.log("Job completed",job.id,job.name,job.data);
})

Worker.on("failed",(job)=>{
    console.log("Job failed",job.id,job.name,job.data)
})

module.exports = {
    emailWorker
}