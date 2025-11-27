const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const path = require("path");

// Завантажуємо news.proto
const PROTO_PATH = path.join(__dirname, "proto", "news.proto");

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const newsProto = grpc.loadPackageDefinition(packageDefinition).news;

const ADDRESS = "localhost:50051";

const client = new newsProto.NewsService(ADDRESS, grpc.credentials.createInsecure());

function sendNews(newsData) {
  client.AddNews(newsData, (err, response) => {
    if (err) {
      console.error("gRPC помилка:", err.message);
      return;
    }
    console.log("Відповідь grpc сервера:", response);
  });
}

// Приклад нової новини
/*
const exampleNews = {
  id: "n1",
  creator_uid: "user123",
  title: "Перша новина",
  subtitle: "Короткий опис",
  text: "Дуже цікава новина!",
  likes: 0,
  comments: 0,
  comments_array: [
    {
      id: "c1",
      author_uid: "user123",
      text: "Перший коментар!",
      timestamp: Date.now(),
    },
  ],
};
*/

// Виклик
//sendNews(exampleNews);

module.exports = { sendNews };