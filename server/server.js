const express=require("express");
const app=express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const cors=require("cors");
const corsOptions={
    origin:["http://localhost:5173"],  //client 
    methods: ["GET", "POST", "PUT", "DELETE"]
}
const { getAllUsers,updateUserData } = require("./lib/FirebaseUsers");
const { getAllNews, updateNewsData, createNews, deleteNewsData, deleteReportedComments}=require("./lib/FirebaseNews");
const{ getAllComments, updateComment, createComment}=require("./lib/FirebaseComments");

const PORT = 8080;
app.use(cors(corsOptions));
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

//отримання даних
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
app.get("/comments", async (req, res) => {
  try {
    const comments=await getAllComments();
    res.json(comments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
})

//створення
app.post("/news", async(req,res)=>{
  try{
    console.log("POST /news body:", req.body);
    const newNews=req.body;
    const created=await createNews(newNews);
    res.status(201).json(created);
  }catch(error){
    console.error("Сервер: Помилка створення допису", error.message);
    res.status(500).json({ error: error.message });
  }
})
app.post("/comments", async(req,res)=>{
  try{
    const { newsId, ...newComment } = req.body;
    if (!newsId) {
      return res.status(400).json({ error: "Не вказано ID новини" });
    }

    const created=await createComment(newsId,newComment);
    res.status(201).json(created);
  }catch(error){
    console.error("Сервер: Помилка збереження коментаря", error.message);
    res.status(500).json({ error: error.message });
  }
})

//оновлення даних
app.put("/comments/:newsId", async (req,res)=>{
  try{
    const {newsId}=req.params;
    const updatedFields=req.body;

    await updateComment(newsId,updatedFields);

    res.status(200).json({success: true});
  } catch(error){
    console.error("Сервер: Помилка оновлення репорта на коментарій новини",error.message);
    res.status(500).json({error:error.message});
  }
})

app.put("/users/:userId", async (req,res)=>{
  try{
    const {userId}=req.params;
    const updatedFields=req.body;

    await updateUserData(userId,updatedFields);

    res.status(200).json({success: true});
  }catch(error){
    console.error("Сервер: Помилка оновлення даних про користувача",error.message);
    res.status(500).json({error:error.message});
  }
});

app.put("/news/:newsId", async (req,res)=>{
  try{
    const {newsId}=req.params;
    const updatedFields=req.body;

    await updateNewsData(newsId, updatedFields);

    res.status(200).json({success: true});
  }catch(error){
    console.error("Сервер: Помилка оновлення даних новини",error.message);
    res.status(500).json({error:error.message});
  }
})

app.delete("/news/:newsId", async (req, res) => {
  try {
    const { newsId } = req.params;
    await deleteNewsData(newsId);
    res.status(200).json({ success: true, message: "Новину успішно видалено" });
  } catch (error) {
    console.error("Сервер: Помилка при видаленні новини:", error.message);
    res.status(500).json({ error: error.message });
  }
});

app.delete("/reported-comments/:newsId/:commentId", async (req, res) => {
  try {
    const { newsId, commentId } = req.params;
    await deleteReportedComments(newsId, commentId);
    res.status(200).json({ success: true, message: "Коментар успішно видалено" });
  } catch (error) {
    console.error("Сервер: Помилка при видаленні коментаря:", error.message);
    res.status(500).json({ error: error.message });
  }
});