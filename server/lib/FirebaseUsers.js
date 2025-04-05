const { database } = require("../firebaseAdmin.config");

const getAllUsers=async()=>{
    try {
        const ref=database.ref("/Users");
        const snapshot=await ref.once("value") // Получаем данные один раз
        const data = snapshot.val() || {};

        // Преобразуем объект в массив, добавляя id в каждый элемент
        const formattedUsers = Object.entries(data).map(([id, usersData]) => ({
            id, 
            ...usersData
        }));

        return formattedUsers;
    } catch (error) {
        console.error("FirebaseUsers.js / getAllUsers() : Помилка при отриманні данних користувачів.")
        throw new Error("Не вдалось завантажити користувачів");
    }
}

const updateUserData=async(userId, editedData)=>{
    try{
        const ref=database.ref(`Users/${userId}`);
        await update(userId,editedData);
    }catch(error){
        console.error("FirebaseUsers.js / updateUserData() : Помилка при оновленні даних про користувача.")
    }
}

module.exports = { getAllUsers, updateUserData };