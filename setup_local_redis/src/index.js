import express from 'express';
import Redis from 'ioredis';
import mongoose, { mongo } from 'mongoose';


const app = express();
const port = 8080
const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');
const BANNER_KEY = 'app:banner';
app.use(express.json())
app.get("/redis",async(req,res)=>{
    const reply =  await redis.ping();
    res.json({redis:reply});
})

app.get("/mongo",async(req,res)=>{
    const url = process.env.MONGO_URL || 'mongodb://localhost:27017/redis_with_mongo'
    if(mongoose.connection.readyState===0){
        await mongoose.connect(url)
    }
    res.json({mongo:"conncted",database:mongoose.connection.name})
})

app.post("/banner",async(req,res)=>{
    await redis.set(BANNER_KEY,req.body.message||"Welcome");
    res.json({success:true});
})


app.get("/banner",async(req,res)=>{
    const message = await redis.get(BANNER_KEY);
    res.json({message});

})

app.delete("/banner",async(req,res)=>{
    await redis.del(BANNER_KEY);
    res.json({success:true})
})

app.get("/banner/exists",async(req,res)=>{
   const message =  await redis.exists(BANNER_KEY);
    res.json({exists:message})
})


app.listen(port,()=>{
    console.log(`Server is running at ${port} `)
})