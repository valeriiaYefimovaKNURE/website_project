const express=require("express");
const cors=require("cors");
const corsOptions={
    origin:["http://localhost:5173"],  //client 
    methods: ["GET", "POST", "PUT", "DELETE"]
}
const { getAllUsers } = require("./lib/FirebaseUsers");
const { getAllNews, getReportedComments }=require("./lib/FirebaseNews");

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


app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
