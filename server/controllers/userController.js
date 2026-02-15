// Database connection import
// Ye file PostgreSQL se connect karne ke liye use hoti hai

import sql from "../configs/db.js";

/*
====================================================
 FUNCTION: getUserCreations
====================================================
 Logged-in user ke saare creations laata hai
 Sirf wahi posts jo usi user ne banayi hain
 Latest post sabse pehle show hoti hai
*/
export const getUserCreations = async (req, res)=>{
    try {

        // Auth middleware se current user ka ID lena
        // Isse pata chalta hai kaun request bhej raha hai

        const {userId} = req.auth()

        // Database query:
        // - creations table se data nikalna
        // - sirf us user ka data lena
        // - latest post pehle lana
       const creations = await sql`SELECT * FROM creations WHERE user_id = ${userId} ORDER BY created_at DESC`;

       // Frontend ko success response bhejna
        // creations array ke form me jayega
        res.json({ success: true, creations });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

/*
====================================================
 FUNCTION: getPublishedCreations
====================================================
 Public feed ke liye use hota hai
 Sirf wahi posts show hongi jo publish ho chuki hain
 Private / draft posts nahi dikhenge
*/

export const getPublishedCreations = async (req, res)=>{
    try {

        // Database query:
        // - publish = true wali posts hi lena
        // - newest post pehle lana
       const creations = await sql`
       SELECT * FROM creations WHERE publish = true ORDER BY created_at DESC`;

       // Now send these data to client.
        res.json({ success: true, creations });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}


/*
====================================================
 FUNCTION: toggleLikeCreation
====================================================
 Like / Unlike system handle karta hai
 Agar user ne pehle like kiya hai → Unlike
 Agar pehle like nahi kiya → Like
 Likes PostgreSQL array me store hote hain
*/
export const toggleLikeCreation = async (req, res)=>{
    try {

        // Logged-in user ka ID lena
        const {userId} = req.auth()

        // Frontend se creation ka ID lena
        // Matlab kaunsi post pe like hua
        const {id} = req.body

        /*
        ----------------------------------
        STEP 1: Check Creation Exists or Not
        ----------------------------------
         Pehle confirm karna zaroori hai ki post exist karti hai ya nahi
         Fake ID hone par error dena
        */
        const [creation] = await sql`SELECT * FROM creations WHERE id = ${id}`

         // Agar post nahi mili to return kar do
        if(!creation){
            return res.json({ success: false, message: "Creation not found" })
        }

        /*
        ----------------------------------
        STEP 2: Get Current Likes Array
        ----------------------------------
         Database me likes TEXT[] type me stored hai
         Example: {user1,user2}
         JS me milega: ["user1","user2"]
        */
        const currentLikes = creation.likes;

        // userId ko string me convert karna
        // Kyunki DB me likes string format me hote hain
        const userIdStr = userId.toString();

        // Updated likes yahan store honge
        let updatedLikes;

        // Frontend ko message bhejne ke liye
        let message;

         /*
        ----------------------------------
        STEP 3: Like / Unlike Logic
        ----------------------------------
         Check karo: user ne pehle se like kiya hai ya nahi
        */

        // Agar user already likes me hai
        if(currentLikes.includes(userIdStr)){

            // Unlike case:
            // User ko likes array se remove karna
            updatedLikes = currentLikes.filter((user)=>user !== userIdStr);
            message = 'Creation Unliked'
        }
        // Agar user ne pehle like nahi kiya
        else{
            // Like case:
            // UserId ko likes array me add karna
            updatedLikes = [...currentLikes, userIdStr]
            message = 'Creation Liked'
        }

        /*
        ----------------------------------
        STEP 4: Convert Array to PostgreSQL Format
        ----------------------------------
         PostgreSQL array format hota hai:
           {user1,user2,user3}
         Isliye JS array ko convert kar rahe hain
        */
        const formattedArray = `{${updatedLikes.join(',')}}`

        /*
        ----------------------------------
        STEP 5: Update Likes in Database
        ----------------------------------
         New likes array DB me save karna
         ::text[] ka matlab → isko text array samjho
        */
       await sql`UPDATE creations SET likes = ${formattedArray}::text[] WHERE id = ${id}`;

        res.json({ success: true, message }); // success response sent to frontend.

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// In sab functions ka endpoint hum userRoutes.js file me banayenge.