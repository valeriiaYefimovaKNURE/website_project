const { database } = require("../firebaseAdmin.config");

const getAllUsers=async()=>{
    try {
        const ref=database.ref("/Users");
        const snapshot=await ref.once("value") // Получаем данные один раз
        return snapshot.val() || {};
    } catch (error) {
        console.error("FirebaseUsers.js / getAllUsers() : Помилка при отриманні данних користувачів.")
        throw new Error("Не вдалось завантажити користувачів");
    }
}

module.exports = { getAllUsers };