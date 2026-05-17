import Redis from 'ioredis';
import express from 'express';
const port = process.env.PORT || 8080
const app =  express();
app.use(express.json());

const QUEUE_KEY = "queue:emails"
const redis = new Redis(process.env.REDIS_PORT || 'redis://localhost:6379');


app.post('/emails',async(req,res)=>{
    const job = {
        to:req.body.to,
        subject:req.body.subject || 'no subject',
        body:req.body.body,
        createdAt:new Date().toISOString()
    }

    await redis.lpush(QUEUE_KEY,JSON.stringify(job));
    res.json({message:"Email processed",job});
})


app.post('/email/process-one',async(req,res)=>{
    const rawJob = await redis.rpop(QUEUE_KEY);
    if(!rawJob) res.json({message:"No job found"})
    const job = JSON.parse(rawJob);
    res.json({message:'Job parsed',job})
})

app.listen(port,()=>{
    console.log(`Server is running at ${port}`)
})