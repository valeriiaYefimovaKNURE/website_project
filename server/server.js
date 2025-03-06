const express=require("express");
const cors=require("cors");
const corsOptions={
    origin:["http://localhost:5173"]  //client 
}
const {database}=require("./firebaseAdmin.config.js")
const { getAllUsers } = require("./lib/FirebaseUsers");

const app=express();

app.use(cors(corsOptions));

app.get("/users", async (req, res) => {
    try {
      const users=await getAllUsers();
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
});


app.listen(8080, () => console.log("Server is running on port 8080"));
