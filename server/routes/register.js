const express = require("express");
const router = express.Router();

const { saveUserToBD } = require("../lib/FirebaseUsers");

// Завершення реєстрації користувача
router.post("/", async(req,res)=>{ 
    try{ 
        const {email,login,name}=req.body; 
        const result= await saveUserToBD(email,login,name); 
        res.json({success:result}); 
    }catch(error){ 
        console.error("Сервер: Помилка збереження даних користувача до БД.", error.message); 
        res.status(500).json({ error: error.message }); 
    } 
});

module.exports = router;