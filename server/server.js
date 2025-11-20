const express=require("express");
const cors=require("cors");
const https = require("https");
const fs=require("fs");

const { initNewsSocket } = require("./sockets/newsSocket");

const usersRouter = require("./routes/users");
const newsRouter = require("./routes/news");
const commentsRouter = require("./routes/comments");
const loginRouter = require("./routes/login");
const registerRouter = require("./routes/register");

const app=express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const corsOptions={
    origin:["https://localhost:5173"],  //client 
    methods: ["GET", "POST", "PUT", "DELETE"]
}
app.use(cors(corsOptions));

app.use("/users", usersRouter);
app.use("/news", newsRouter);
app.use("/comments", commentsRouter);
app.use("/login", loginRouter);
app.use("/register", registerRouter);

const PORT = 8080;
const server = https.createServer({
  key: fs.readFileSync("localhost-key.pem"),
  cert: fs.readFileSync("localhost.pem")
}, app);

const ws = initNewsSocket(server);
app.locals.broadcastNewComment = ws.broadcastNewComment;

server.listen(PORT, () => console.log(`HTTPS + WebSocket сервер на ${PORT}`));