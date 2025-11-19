const express=require("express");
const app=express();
////
const http = require("http");
const WebSocket = require("ws");

const server = http.createServer(app);
const wss = new WebSocket.Server({server});

const viewers = {};

wss.on("connection", (ws) => {
  console.log("WebSocket client connected");

  ws.on("message", (msg) => {
    const message = JSON.parse(msg);

    // якщо користувач відкрив новину
    if (message.type === "join") {
      const { news_id } = message.data;
      if (!viewers[news_id]) viewers[news_id] = new Set();
      viewers[news_id].add(ws);

      // Відправити всім клієнтам, що дивляться цю новину оновлену кількість
      const count = viewers[news_id].size;
      viewers[news_id].forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({ type: "viewers_count", data: { news_id, count } }));
        }
      });
    }

    // логіка для нових коментарів
    if (message.type === "new_comment") {
      broadcastNewComment(message.data);
    }
  });

   ws.on("close", () => {
    console.log("WebSocket client disconnected");
    // видаляємо ws з усіх news_id
    for (const news_id in viewers) {
      viewers[news_id].delete(ws);
      const count = viewers[news_id].size;
      viewers[news_id].forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({ type: "viewers_count", data: { news_id, count } }));
        }
      });
    }
  });

});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const cors=require("cors");
const corsOptions={
    origin:["http://localhost:5173"],  //client 
    methods: ["GET", "POST", "PUT", "DELETE"]
}

const { getAllUsers,updateUserData, saveUserToBD, userSignIn, deleteUserData, createUser } = require("./lib/FirebaseUsers");
const { getAllNews, getNewsById, updateNewsData, createNews, deleteNewsData}=require("./lib/FirebaseNews");
const{ getAllComments, getCommentsByNewsId, updateComment, createComment, deleteComment}=require("./lib/FirebaseComments");


function broadcastNewComment(comment) {
  wss.clients.forEach(client => {
    if ( client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({
        type: "new_comment",
        data: comment
      }));
    }
  });
}


const PORT = 8080;
app.use(cors(corsOptions));
//app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

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

app.get("/news/:newsId", async (req, res) => {
  try {
    const { newsId } = req.params;
    const newsItem = await getNewsById(newsId);

    if (!newsItem) {
      return res.status(404).json({ error: "Новину не знайдено" });
    }

    res.json(newsItem);
  } catch (error) {
    console.error("Сервер: Помилка при отриманні новини:", error.message);
    res.status(500).json({ error: error.message });
  }
});

app.get("/comments/:newsId", async (req, res) => {
  try {
    const { newsId } = req.params;
    const comments=await getCommentsByNewsId(newsId);
    res.json(comments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
})

//створення
app.post("/users", async(req,res)=>{
  try{
    const {userData, userId}=req.body;

    if (!userData) {
      return res.status(400).json({ error: "Немає даних користувача" });
    }

    const created=await createUser(userData, userId);
    res.status(201).json(created);
  }catch(error){
    console.error("Сервер: Помилка створення користувача в БД", error.message);
    res.status(500).json({ error: error.message });
  }
})
app.post("/news", async(req,res)=>{
  try{
    const newsData=req.body;

    if (!newsData) {
      return res.status(400).json({ error: "Немає даних для новини" });
    }

    const created=await createNews(newsData);
    res.status(201).json(created);
  }catch(error){
    console.error("Сервер: Помилка створення допису", error.message);
    res.status(500).json({ error: error.message });
  }
})
app.post("/comments", async(req,res)=>{
  try{
    const newComment=req.body;
    const newsId=newComment.news_id;
    if (!newsId) {
      return res.status(400).json({ error: "Не вказано ID новини" });
    }

    const created=await createComment(newsId,newComment);
    
    broadcastNewComment({
      id: created,
      ...newComment
    });

    res.status(201).json(created);
  }catch(error){
    console.error("Сервер: Помилка збереження коментаря", error.message);
    res.status(500).json({ error: error.message });
  }
})
app.post("/complete-registration", async(req,res)=>{
  try{
    const {email,login,name}=req.body;
    const result= await saveUserToBD(email,login,name);

    res.json({success:result});
  }catch(error){
    console.error("Сервер: Помилка збереження даних користувача до БД.", error.message);
    res.status(500).json({ error: error.message });
  }
})
app.post("/login",async(req,res)=>{
  try{
    const {userToken}=req.body;
    const userData=await userSignIn(userToken);

    res.json(userData);
  }catch(error){
    console.error("Login error:", error);
    res.status(401).json({ error: "Unauthorized" });
  }
});

//оновлення даних
app.put("/comments/:newsId/:commentId", async (req,res)=>{
  try{
    const {newsId, commentId}=req.params;
    const updatedFields=req.body;

    await updateComment(newsId, commentId, updatedFields);

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

//видалення
app.delete("/users/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    await deleteUserData(userId);

    res.status(200).json({ success: true, message: "Новину успішно видалено" });
  } catch (error) {
    console.error("Сервер: Помилка при видаленні користувача:", error.message);
    res.status(500).json({ error: error.message });
  }
});

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

app.delete("/comments/:newsId/:commentId", async (req, res) => {
  try {
    const { newsId, commentId } = req.params;

    await deleteComment(newsId, commentId);

    res.status(200).json({ success: true, message: "Коментар успішно видалено" });
  } catch (error) {
    console.error("Сервер: Помилка при видаленні коментаря:", error.message);
    res.status(500).json({ error: error.message });
  }
});