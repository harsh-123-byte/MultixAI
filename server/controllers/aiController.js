import OpenAI from "openai";
import sql from "../configs/db.js";
import { clerkClient } from "@clerk/express";
import axios from "axios";
import { v2 as cloudinary } from "cloudinary";
import fs from 'fs'
import pdf from 'pdf-parse/lib/pdf-parse.js'
import { GoogleGenerativeAI } from "@google/generative-ai";

const AI = new OpenAI({
    apiKey: process.env.GEMINI_API_KEY,
    baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/"
});



// Controller funnction for article generation---> Phir iska end point create kar denge aiRouts.js me waha se phir server.js me jo ai wala route bana hai usme iska end point jod ke check kar sakte hain.
export const generateArticle = async (req, res)=>{
    try {
        const { userId } = req.auth();
        const { prompt, length } = req.body;
        const plan = req.plan;
        const free_usage = req.free_usage;

        if(plan !== 'premium' && free_usage >= 10){ // In free plan user can only create 10 articles.
            return res.json({ success: false, message: "Limit reached. Upgrade to continue."})
        }

        const response = await AI.chat.completions.create({
            model: "gemini-1.5-flash",
            messages: [{
                // we will provide aur prompt here with therole 'user'
                    role: "user",
                    content: prompt,
                },
            ],
            temperature: 0.7,
            max_tokens: length,
        });

        const content = response.choices[0].message.content // response which we get from the AI.

       // now we will store this response data in our database, for that we have to write the sql query.
        await sql` INSERT INTO creations (user_id, prompt, content, type) 
        VALUES (${userId}, ${prompt}, ${content}, 'article')`;

        if(plan !== 'premium'){
            await clerkClient.users.updateUserMetadata(userId, {
                privateMetadata:{
                    free_usage: free_usage + 1 // increasing the count of free usage.
                }
            })
        }

        res.json({ success: true, content})


    } catch (error) {
        console.log(error.message)
        res.json({success: false, message: error.message}) // agar nhi chalega sahis se to jo bhi error hoga wo show ho jayega.
    }
}

// Controller function to generate Blog Titles.
export const generateBlogTitle = async (req, res)=>{
    try {
        const { userId } = req.auth();
        const { prompt } = req.body;
        const plan = req.plan;
        const free_usage = req.free_usage;

        if(plan !== 'premium' && free_usage >= 10){
            return res.json({ success: false, message: "Limit reached. Upgrade to continue."})
        }

        const response = await AI.chat.completions.create({
            model: "gemini-1.5-flash",
            messages: [{ role: "user", content: prompt, } ],
            temperature: 0.7,
            max_tokens: 100,
        });

        const content = response.choices[0].message.content

        // We have update the above generated response in the neon DB so we have to insert he values into the tables.
        await sql` INSERT INTO creations (user_id, prompt, content, type) 
        VALUES (${userId}, ${prompt}, ${content}, 'blog-title')`;

        if(plan !== 'premium'){
            await clerkClient.users.updateUserMetadata(userId, {
                privateMetadata:{
                    free_usage: free_usage + 1
                }
            })
        }

        res.json({ success: true, content})


    } catch (error) {
        console.log(error.message)
        res.json({success: false, message: error.message})
    }
}

// Function to generate Image.
export const generateImage = async (req, res)=>{
    try {
        const { userId } = req.auth();
        const { prompt, publish } = req.body; // Publish status will be either true or false.
        const plan = req.plan;

        if(plan !== 'premium'){
            return res.json({ success: false, message: "This feature is only available for premium subscriptions"})
        }

        // Using ClipDrop Api to generate the Image Using the text using AI.
        const formData = new FormData()
        formData.append('prompt', prompt)
        const {data} = await axios.post("https://clipdrop-api.co/text-to-image/v1", formData, { // used axios to make the post request to the clipdrop api, we could have also used fetch but in fetch we have to do some extra work to send the form data but in axios it is very easy to send the form data.
            headers: {'x-api-key': process.env.CLIPDROP_API_KEY,},
            responseType: "arraybuffer",
        })

        // Storing aur generated image using cloudinary.---> Upar {data} me humara generated image aaya hai ab use humlog cloudinary pe bhej rhe hain.
        const base64Image = `data:image/png;base64,${Buffer.from(data, 'binary').toString('base64')}`;

        const {secure_url} = await cloudinary.uploader.upload(base64Image)
        

        await sql` INSERT INTO creations (user_id, prompt, content, type, publish) 
        VALUES (${userId}, ${prompt}, ${secure_url}, 'image', ${publish ?? false })`;

        res.json({ success: true, content: secure_url}) // isi URL ka use kar ke hum abne image ko Frontend pe show karenge.

    } catch (error) {
        console.log(error.message)
        res.json({success: false, message: error.message})
    }
}


// Function for removing the background.
export const removeImageBackground = async (req, res)=>{
    try {
        const { userId } = req.auth();
        const image = req.file; // this image will be added in req.file using a middleware and we will create that middleware using Multer.
        // Multer is a middleware for Node.js + Express that is used to handle file uploads (like images, PDFs, videos, etc.) from HTML forms.
        const plan = req.plan;

        if(plan !== 'premium'){
            return res.json({ success: false, message: "This feature is only available for premium subscriptions"})
        }

        const {secure_url} = await cloudinary.uploader.upload(image.path, {
            transformation: [
                {
                    effect: 'background_removal',
                    background_removal: 'remove_the_background'
                }
            ]
        })

        // Storing the updated image in DB.

        await sql` INSERT INTO creations (user_id, prompt, content, type) 
        VALUES (${userId}, 'Remove background from image', ${secure_url}, 'image')`;

        res.json({ success: true, content: secure_url})

    } catch (error) {
        console.log(error.message)
        res.json({success: false, message: error.message})
    }
}


// Function to remove any object from the Image.
export const removeImageObject = async (req, res)=>{
    try {
        const { userId } = req.auth();
        const { object } = req.body;
        const image = req.file;
        const plan = req.plan;

        if(plan !== 'premium'){
            return res.json({ success: false, message: "This feature is only available for premium subscriptions"})
        }

        const {public_id} = await cloudinary.uploader.upload(image.path)

        // Object hatne ke baad ek naya URL milega use phir DB me store karna hoga.
        const imageUrl = cloudinary.url(public_id, {
            transformation: [{effect: `gen_remove:${object}`}], // object name which is removed from the background.
            resource_type: 'image'
        })

        await sql` INSERT INTO creations (user_id, prompt, content, type) 
        VALUES (${userId}, ${`Removed ${object} from image`}, ${imageUrl}, 'image')`;

        res.json({ success: true, content: imageUrl})

    } catch (error) {
        console.log(error.message)
        res.json({success: false, message: error.message})
    }
}


// Controller function for Reviewing the Resume.
export const resumeReview = async (req, res)=>{
    try {
        const { userId } = req.auth();
        const resume = req.file;
        const plan = req.plan;

        if(plan !== 'premium'){
            return res.json({ success: false, message: "This feature is only available for premium subscriptions"})
        }

        if(resume.size > 5 * 1024 * 1024){ // 5MB se bada nhi hona chahiye file size.
            return res.json({success: false, message: "Resume file size exceeds allowed size (5MB)."})
        }

        const dataBuffer = fs.readFileSync(resume.path) // File systems me save kar rhe hain.
        // We have to parse this resume to extract it's texts.
        const pdfData = await pdf(dataBuffer)

        // We will generate the prompt using the parsed text we we get above.
        const prompt = `Review the following resume and provide constructive feedback on its strengths, weaknesses, and areas for improvement. Resume Content:\n\n${pdfData.text}`

        // Send this prompt to google Gemini API to get the response.
       const response = await AI.chat.completions.create({
            model: "gemini-1.5-flash",
            messages: [{ role: "user", content: prompt, } ],
            temperature: 0.7,
            max_tokens: 1000,
        });

        const content = response.choices[0].message.content // choices array ka 1st wala item hi chahiye hume.

        await sql` INSERT INTO creations (user_id, prompt, content, type) 
        VALUES (${userId}, 'Review the uploaded resume', ${content}, 'resume-review')`;

        res.json({ success: true, content})

    } catch (error) {
        console.log(error.message)
        res.json({success: false, message: error.message})
    }
}

// Controllers Function banane ke baad hum in sab functions ka api endpoint banayenge.