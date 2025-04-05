const express=require("express");
const cors=require("cors");
const corsOptions={
    origin:["http://localhost:5173"],  //client 
    methods: ["GET", "POST", "PUT", "DELETE"]
}
const { getAllUsers,updateUserData } = require("./lib/FirebaseUsers");
const { getAllNews, getReportedComments, updateCommentReport, updateNewsData }=require("./lib/FirebaseNews");

const PORT = 8080;

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
app.get("/news", async (req, res) => {
  try {
    const news=await getAllNews();
    res.json(news);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
})

app.get("/reported-comments", async (req, res) => {
  try {
      const comments = await getReportedComments();
      res.json(comments);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});

app.put("/reported-comments/:newsId/:commentId", async (req,res)=>{
  try{
    const {newsId, commentId}=req.params;
    const updatedData=req.body;


    await updateCommentReport(newsId,commentId,updatedData);

    res.status(200).json({success: true});
  } catch(error){
    console.error("Сервер: Помилка оновлення репорта на коментарій новини",error.message);
    res.status(500).json({error:error.message});
  }
})

app.put("/users/:userId", async (req,res)=>{
  try{
    const {userId}=req.params;
    const updatedData=req.body;

    await updateUserData(userId,updatedData);

    res.status(200).json({success: true});
  }catch(error){
    console.error("Сервер: Помилка оновлення даних про користувача",error.message);
    res.status(500).json({error:error.message});
  }
});

app.put("/news/:newsId", async (req,res)=>{
  try{
    const {newsId}=req.params;
    const updatedData=req.body;

    await updateNewsData(newsId, updatedData);

    res.status(200).json({success: true});
  }catch(error){
    console.error("Сервер: Помилка оновлення даних новини",error.message);
    res.status(500).json({error:error.message});
  }
})

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
