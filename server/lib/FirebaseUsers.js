const { auth } = require("firebase-admin");
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
const userSignIn=async(userToken)=>{
    try{
        const decoded=await auth().verifyIdToken(userToken);
        const uid=decoded.uid;

        if(!uid){
            console.error("FirebaseUsers.js / userSignIn() : Помилка токена. ID користувача не знайдено.")
            return false;
        }
        const ref=database.ref(`Users/${uid}`);
        const snapshot=await ref.once("value");

        if(!snapshot.exists()){
            console.error("FirebaseUsers.js / userSignIn() : Дані користувача не знайдені.")
            return false;
        }

        const userData = snapshot.val();

        return {
          id: uid,
          ...userData
        };
    }catch(error){
        console.error("FirebaseUsers.js / userSignIn() : Помилка при отриманні данних користувачів.")
        throw new Error("Не вдалось завантажити користувачів");
    }
}

const saveUserToBD=async(email,login,name)=>{
    try{
        const user=await auth().getUserByEmail(email);
        if(!user.emailVerified){
            console.error("FirebaseUsers.js / saveUserToBD() : Помилка збереження користувача до БД. Пошта не підтверджена")
            return false;
        }

        const ref=database.ref(`Users/${user.uid}`);

        await ref.set({
            email,
            name,
            login,
            role:'USER'
        });

        return true;
    }catch(error){
      console.error("FirebaseUsers.js / saveUserToBD() : Помилка збереження користувача до БД.")
      throw new Error("Не вдалось зберегти дані користувача до БД");
    }
}
const createUser=async(userData, uid)=>{
  try{
    const ref=database.ref(`Users/${uid}`);

    await ref.set(userData);
  }catch(error){
    console.error("FirebaseUsers.js / createUser() : Помилка збереження користувача до БД.")
    throw new Error("Не вдалось зберегти дані користувача до БД");
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

const deleteUserData = async (userId) => {
  try {
    let userExistsInAuth = true;
    try {
      await auth().getUser(userId); // Проверяем есть ли пользователь в Firebase Auth
    } catch (error) {
      if (error.code === "auth/user-not-found") {
        userExistsInAuth = false;
      } else {
        throw error;
      }
    }

    if (userExistsInAuth) {// Если есть в Auth — удаляем оттуда
      await auth().deleteUser(userId);
      console.log(`Користувач ${userId} видалено з Firebase Auth`);
    } else {
      console.log(`Користувач ${userId} не знайдено в Firebase Auth`);
    }

    // Удаляем из Realtime Database
    const ref = database.ref(`Users/${userId}`);
    await ref.remove();
    console.log(`Дані користувача ${userId} видалені з БД`);

    return true;
  } catch (error) {
    console.error("FirebaseUsers.js / deleteUserData():", error.message);
    throw new Error("Не вдалось видалити дані користувача");
  }
};

module.exports = { getAllUsers, userSignIn, saveUserToBD, createUser, updateUserData, deleteUserData };