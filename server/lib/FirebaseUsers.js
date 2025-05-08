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

const updateUserData=async(userId, updatedFields)=>{
    try{
        if (typeof updatedFields !== "object") throw new Error("Некоректні дані");
        
        const ref=database.ref(`Users/${userId}`);
        await ref.update(updatedFields)
                .then(() => console.log("Оновлені поля:", updatedFields))
                .catch(console.error);
    }catch(error){
        console.error("FirebaseUsers.js / updateUserData() : Помилка при оновленні даних про користувача.")
    }
}

module.exports = { getAllUsers, updateUserData };