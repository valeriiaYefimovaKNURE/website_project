const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const path = require("path");

const PROTO_PATH = path.join(__dirname, "../proto/news.proto");

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const newsProto = grpc.loadPackageDefinition(packageDefinition).news; //package name

//функції сервісу
const newsService = {
    GetNews: (call, callback) => {

    }
};

function startGrpcServer() {
    const server = new grpc.Server();
    server.addService(newsProto.NewsService.service, newsService);

    const GRPC_PORT = "50051";
    const ADDRESS=`0:0.0.0:${GRPC_PORT}`;

    server.bindAsync(ADDRESS, grpc.ServerCredentials.createInsecure(), () => {
        console.log(`gRPC server running at ${ADDRESS}`);
        server.start();
    });

    return server;
}

module.exports = { startGrpcServer };