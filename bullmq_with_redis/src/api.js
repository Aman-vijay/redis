import express from 'express';
import {emailWorker} from './worker.js'
import {emailQueue} from './queue.js'
import { delay } from 'bullmq';
const app = express();
const port = 8080
app.use(express.json());

app.post('/welcome-email',async(req,res)=>{
    const job = emailQueue.add("send-welcome-email",{
        to:req.body.to,
        name:req.body.name || "Learner"
    },
    {
        attempts:3,
        backoffs:{
            type:"exponential",
            delay:1000
        }
    }
);
res.json({message:"Welcome email job added to the queue",jobId:job.id})
})


app.listen(port,()=>{
    console.log(`Server is listening to ${port}`)
})