const express = require("express");
const router = express.Router();

const { userSignIn } = require("../lib/FirebaseUsers");

// Вхід користувача
router.post("/",async(req,res)=>{ 
    try{ 
        const {userToken}=req.body; 
        const userData=await userSignIn(userToken); 
        res.json(userData); 
    }catch(error){ 
        console.error("Login error:", error); 
        res.status(401).json({ error: "Unauthorized" }); 
    } 
});

module.exports = router;