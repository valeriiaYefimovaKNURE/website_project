const express=require("express");
const cors=require("cors");
const https = require("https");
const fs=require("fs");
const { ApolloServer } = require("apollo-server-express");

const { initNewsSocket } = require("./sockets/newsSocket");
const { typeDefs, resolvers } = require("./graphql/schema");

const usersRouter = require("./routes/users");
const newsRouter = require("./routes/news");
const commentsRouter = require("./routes/comments");
const likesRouter = require("./routes/likes")
const loginRouter = require("./routes/login");
const registerRouter = require("./routes/register");
const { startGrpcServer } = require("./config/grpc/grpcNewsServer");

const app=express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const corsOptions={
    origin:["https://localhost:5173"],  //client 
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}
app.use(cors(corsOptions));

app.use("/users", usersRouter);
app.use("/news", newsRouter);
app.use("/comments", commentsRouter);
app.use("/likes", likesRouter)
app.use("/login", loginRouter);
app.use("/register", registerRouter);

const PORT = 8080;
const server = https.createServer({
  key: fs.readFileSync("./config/ssl/localhost-key.pem"),
  cert: fs.readFileSync("./config/ssl/localhost.pem")
}, app);

const ws = initNewsSocket(server);
app.locals.broadcastNewComment = ws.broadcastNewComment;

startGrpcServer();

async function startApolloServer() {
    const serverGraphQL = new ApolloServer({
        typeDefs,
        resolvers,
        introspection: true, 
    });

    await serverGraphQL.start();
    
    serverGraphQL.applyMiddleware({ 
        app, 
        path: '/graphql',
        cors: false
    });
}

startApolloServer();


server.listen(PORT, () => {
  console.log(`HTTPS + WebSocket сервер на ${PORT}`);
  console.log(`GraphQL доступний за адресою https://localhost:${PORT}/graphql`);
});
