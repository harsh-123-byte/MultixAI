// In routes we create the api endpoints.

import express from "express";
import { auth } from "../middlewares/auth.js";
import { generateArticle, generateBlogTitle, generateImage, removeImageBackground, removeImageObject, resumeReview } from "../controllers/aiController.js";
import { upload } from "../configs/multer.js";

const aiRouter = express.Router();

aiRouter.post('/generate-article', auth, generateArticle)// (endpoint,auth middleware which will provide plan data inthe request, and the controller function respective to that end point. )

aiRouter.post('/generate-blog-title', auth, generateBlogTitle)
aiRouter.post('/generate-image', auth, generateImage)

aiRouter.post('/remove-image-background', upload.single('image'), auth, removeImageBackground) // upload middleware will add the image in the request and then we can access that image in the controller function using req.file,and multer will also take care of deleting the image from the server after uploading it to cloudinary.
aiRouter.post('/remove-image-object', upload.single('image'), auth, removeImageObject)

aiRouter.post('/resume-review', upload.single('resume'), auth, resumeReview)

export default aiRouter