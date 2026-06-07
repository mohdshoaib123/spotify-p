import express from 'express';
import dotenv from 'dotenv';
import { sql } from './config/db.js';
import adminRoute from './route.js';
import cloudinary from 'cloudinary';
import cookieParser from "cookie-parser";
import { createClient } from 'redis';
import cors from 'cors';
export const redisClient = createClient({
    url: process.env.REDIS_URL
});
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
    .then(() => console.log("connected to redis"))
    .catch((err) => console.log(err));
dotenv.config();
const app = express();
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"]
}));
app.use(cookieParser());
cloudinary.v2.config({ cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
});
async function initDB() {
    try {
        await sql `
    CREATE TABLE IF NOT EXISTS albums(
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description VARCHAR NOT NULL,
    thumbnail VARCHAR NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);`;
        await sql `
    CREATE TABLE IF NOT EXISTS songs(
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description VARCHAR NOT NULL,
    thumbnail VARCHAR ,
    audio VARCHAR(255) NOT NULL,
    album_id  INTEGER REFERENCES albums(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`;
        console.log('database initialized successfully');
    }
    catch (error) {
        console.log('error initdb', error);
    }
}
const PORT = process.env.PORT;
app.use("/api/v1", adminRoute);
initDB().then(() => {
    app.listen(PORT, () => {
        console.log(`server is listen on port${PORT}`);
    });
});
//# sourceMappingURL=index.js.map