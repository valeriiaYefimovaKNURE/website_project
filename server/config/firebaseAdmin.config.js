const admin=require("firebase-admin")
const dotenv = require("dotenv");

dotenv.config();

const serviceAccount = JSON.parse(process.env.FIREBASE_ADMIN_SDK_KEY);

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.FIREBASE_DATABASE_URL,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
});

const database = admin.database();

module.exports={database};