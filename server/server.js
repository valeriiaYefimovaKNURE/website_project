const express=require("express");
const app=express();
const cors=require("cors");
const corsOptions={
    origin:["http://localhost:5173"]  //client 
}

app.use(cors(corsOptions));
