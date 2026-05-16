import express from 'express';
import Redis from 'ioredis';

const app = express();
app.use(express.json());
const port = 8080;
const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');


function otpKey(phone){
    return `otp:${phone}`
}


app.post("/otp",async(req,res)=>{
    const {phone} = req.body;
    const otp = Math.floor(100000 + Math.random()*90000).toString();

    await redis.set(otpKey(phone),otp,'EX',30);
    res.json({message:'otp sent',otp})
})

app.post("/otp/verify",async(req,res)=>{
    const {otp,phone} = req.body;
    const currectOtp = await redis.get(otpKey(phone));
    if(!currectOtp) return res.status(400).json({message:'Otp Expired'});
    if(currectOtp!==otp) return res.status(401).json({message:'Otp is Incorrect'});
    await redis.del(otpKey(phone));
    res.json({message:'Otp Verified'})

})

app.get('/otp/:phone/ttl',async(req,res)=>{
    const ttl =  await redis.ttl(otpKey(req.params.phone));
    res.json({ttl})
})

app.get("/redis",async(req,res)=>{
    const reply = await redis.ping();
    res.json({redis:reply})
})




app.listen(port,()=>{
    console.log(`Server is running on ${port}`)
})