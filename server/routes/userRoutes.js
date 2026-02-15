import express from "express";
import { auth } from "../middlewares/auth.js";
import { getPublishedCreations, getUserCreations, toggleLikeCreation } from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.get('/get-user-creations', auth, getUserCreations)
userRouter.get('/get-published-creations', auth, getPublishedCreations)
userRouter.post('/toggle-like-creation', auth, toggleLikeCreation) // because we have to send the creation id from the body that's why it is POST request.

export default userRouter;

// now add this router in server.js file---> har route banane ke baad server.js me add karna hota hai,kyuki wahi humari backend ki main file hai.