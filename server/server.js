import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { clerkMiddleware, requireAuth } from '@clerk/express'
import aiRouter from './routes/aiRoutes.js';
import connectCloudinary from './configs/cloudinary.js';
import userRouter from './routes/userRoutes.js';

const app = express()

await connectCloudinary()

app.use(cors()) // all the requests will be passed using this cors.
app.use(express.json())
app.use(clerkMiddleware()) // all the requests will be passed through this clerk middleware and this middleware will create an 'auth' object by which we will get the user data.

app.get('/', (req, res)=>res.send('Server is Live!'))

app.use(requireAuth()) // matlab is route ke baad ham jo bhi routes banayenge wo sab protected honge means jab that user authenticated na ho tab tak wo en routes ko access nhi kar sakta.

app.use('/api/ai', aiRouter) // Ai related saare controllers ka endpoint.
app.use('/api/user', userRouter)

const PORT = process.env.PORT || 3000; //if the PORT number is available in the environment variable then that PORT number will be use or else we will use PORT 3000.

// for starting of our server.
app.listen(PORT, ()=>{
    console.log('Server is running on port', PORT);
})