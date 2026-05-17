import Redis from 'ioredis';
import express from 'express';

const app =  express();
const port = 8080
app.use(express.json());


const redis = new Redis(process.env.Redis_Port || 'redis://localhost:6379');

app.post('/user/:id/json',async(req,res)=>{
    await redis.set(`user:${req.params.id}:json`,JSON.stringify(req.body))
    res.json({message:"user saved json"})
})

app.get('/user/:id/json',async(req,res)=>{
    const uData = await redis.get(`user:${req.params.id}:json`);
    res.json({user:uData? JSON.parse(uData):null});
})

app.post('/user/:id/hash',async(req,res)=>{
    await redis.hset(`user:${req.params.id}:hash`,req.body);
    res.json({message:"user saved in hash"});
})

app.get('/user/:id/hash',async(req,res)=>{
    const user = await redis.hgetall(`user:${req.params.id}:hash`);
    res.json({user})
})

app.listen(port,()=>{
    console.log(`Server is listening at ${port}`)
});

