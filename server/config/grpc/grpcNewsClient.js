const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const path = require("path");

const PROTO_PATH = path.join(__dirname, "proto", "notifications.proto");

const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const proto = grpc.loadPackageDefinition(packageDefinition).notifications;

const ADDRESS = "localhost:50051";

const client = new proto.NotificationService(ADDRESS, grpc.credentials.createInsecure());

module.exports = client;