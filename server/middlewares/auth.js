import { clerkClient } from "@clerk/express";

// Middleware to check userId and hasPremiumPlan

/*
  =====================================================
  AUTH MIDDLEWARE
  -----------------------------------------------------
  Purpose:
  - Check if user is authenticated using Clerk
  - Check if user has premium plan
  - Manage free usage for free users
  - Attach plan & usage info to request object
  =====================================================
*/

export const auth = async (req, res, next)=>{
    try {
        /*
          --------------------------------------------
          Get authentication info from Clerk
          --------------------------------------------
          req.auth() returns:
          - userId : Logged-in user's ID
          - has    : Function to check user's plans
        */
        const {userId, has} = await req.auth();

        /*
          --------------------------------------------
          Check if user has Premium Plan
          --------------------------------------------
          Returns true if user has premium subscription
          Otherwise returns false
        */
        const hasPremiumPlan = await has({plan: 'premium'}); // if has premium paln then true else false.

        /*
          --------------------------------------------
          Fetch full user details from Clerk
          --------------------------------------------
          This includes metadata (private/public)
        */
        const user = await clerkClient.users.getUser(userId);

         /*
          --------------------------------------------
          Free Usage Logic
          --------------------------------------------
          If:
          - User is NOT premium
          - User has remaining free usage
        */
        if(!hasPremiumPlan && user.privateMetadata.free_usage){
            // Attach remaining free usage to request
            req.free_usage = user.privateMetadata.free_usage
        } 
        

        else{
            /*
              ----------------------------------------
              Reset free usage
              ----------------------------------------
              This happens when:
              - User is premium
              - OR free usage is finished
            */
            await clerkClient.users.updateUserMetadata(userId, {
                privateMetadata: {
                    // Set free usage to 0 in request
                    free_usage: 0
                }
            })
            req.free_usage = 0;
        }

        /*
          --------------------------------------------
          Attach User Plan to Request
          --------------------------------------------
          This will be used in controllers later
        */
        req.plan = hasPremiumPlan ? 'premium' : 'free';

        /*
          --------------------------------------------
          Call Next Middleware / Route
          --------------------------------------------
          If next() is not called, request will hang
        */
        next()
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}