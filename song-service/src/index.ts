import express from "express";
import dotenv from "dotenv"
import songRoute from './route.js'
import { createClient } from "redis"
import cors from 'cors'




dotenv.config()

export const redisClient=createClient({
  url:process.env.REDIS_URL as string
 
})




// Connection established
redisClient.on("connect", () => {
  console.log("✅ Redis connecting...");
});

// Ready to use
redisClient.on("ready", () => {
  console.log("✅ Redis ready");
});

// Any Redis error
redisClient.on("error", (err) => {
  console.error("❌ Redis Error:", err);
});

// Socket closed
redisClient.on("end", () => {
  console.log("🔌 Redis connection closed");
});

// Reconnecting
redisClient.on("reconnecting", () => {
  console.log("🔄 Redis reconnecting...");
});

redisClient.connect()
.then(()=>console.log("connected to redis"))
.catch((err)=>console.log(err))


const app=express()
app.use(cors())



const PORT =process.env.PORT

app.use('/api/v1/song',songRoute)

app.listen(PORT,()=>{
  console.log(`server are listen on PORT ${PORT}`)

})

