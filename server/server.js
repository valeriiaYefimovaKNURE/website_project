const express=require("express");
const cors=require("cors");
const corsOptions={
    origin:["http://localhost:5173"]  //client 
}
const {database}=require("./firebaseAdmin.config.js")

const app=express();

app.get("/Users", async (req, res) => {
    try {
      const ref = database.ref("/Users"); // Указываем путь в базе
      const snapshot = await ref.once("value");
      res.json(snapshot.val());
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
});

app.use(cors(corsOptions));
