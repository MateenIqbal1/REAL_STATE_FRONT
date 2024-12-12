import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv'
import userRouter from '../api/routes/userRoutes.js'
import authRouter from '../api/routes/authRoute.js'
import cookieParser from 'cookie-parser';
import listingRoute from './routes/listingRoute.js'
import {router as imageRoutes} from '../api/routes/imageRoutes.js'
import cors from 'cors'
const PORT = 3000;
dotenv.config();

const DATABASE_URL=process.env.MONGO_URL
try{
  
    await mongoose.connect(DATABASE_URL)
     console.log("successfully connected to mongodb...")
   }catch(error){
console.log(error)
   }
const app=express();
app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.listen(PORT, (error) =>{
    if(!error)
        console.log("Server is listening on port "+ PORT);
    else 
        console.log("Error occurred, server can't start", error);
    }
);

app.use('/api/user',userRouter);
app.use('/api/auth',authRouter);
app.use('/api/listing',listingRoute);
app.use('/api/image',imageRoutes);




app.use((err,req,res,next)=>{
    const statusCode=err.statusCode || 500;
    const message=err.message || 'Internal Server Error';
    return res.status(statusCode).json({
        success:false,
        statusCode,
        message,

    })
})