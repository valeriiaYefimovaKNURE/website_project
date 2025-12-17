const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const path = require("path");
const { sendTelegramNewPost } = require("../../lib/telegram");

const PROTO_PATH = path.join(__dirname, "proto", "notifications.proto");

const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const proto = grpc.loadPackageDefinition(packageDefinition).notifications;

function NotifyNewPost(call, callback) {
  console.log("📩 New post received via gRPC:", call.request);

  sendTelegramNewPost(call.request)
    .then(() => callback(null, { success: true }))
    .catch((err) => {
      console.error("❌ Telegram error:", err);
      callback(null, { success: false });
    });
}

function startGrpcServer() {
    const server = new grpc.Server();
    server.addService(proto.NotificationService.service, {
        NotifyNewPost
    });

    const ADDRESS = "0.0.0.0:50051";

    server.bindAsync(ADDRESS, grpc.ServerCredentials.createInsecure(),
        (err) => {
            if (err) {
              console.error("gRPC bind error:", err);
              return;
            }
            console.log(`gRPC server running at ${ADDRESS}`);
        }
    );

    return server;
}

module.exports = { startGrpcServer };