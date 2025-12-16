const { database } = require('../config/firebaseAdmin.config');
const {getAllUsers}=require("./FirebaseUsers");
const { getAllNews } = require("./FirebaseNews");

const getIsNewsLiked=async(userId,newsId)=>{
     try{
        if (!userId || !newsId) throw new Error("userId або newsId відсутні");

        const allUsers = await getAllUsers();
        if (!allUsers || !Array.isArray(allUsers)) {
            throw new Error("Дані про користувачів невалідні");
        }

        const user = allUsers.find(u => u.id === userId);
        if (!user || !user.likesArray) return false;

        return user.likesArray[newsId] === true;
    }catch{
        console.error("FirebaseLikes.js / getIsNewsLiked():", error.message);
        return [];
    }
}

const createLike=async(userId,newsId)=>{
    try{
        if (!userId || !newsId) throw new Error("userId або newsId відсутні");
        
        const ref=database.ref(`/Users/${userId}/likesArray/${newsId}`);
        await ref.set(true);

        // збільшити лічильник лайків у новини
        const likesCountRef = database.ref(`/News/${newsId}/likes`);
        await likesCountRef.transaction(current => (current || 0) + 1);

        console.log("Лайк збережено!")
        return true;
    }catch(error){
        console.error("FirebaseLikes.js / createLike(): Помилка:", error.message);
        return false;
    }
}

const deleteLike=async(userId,newsId)=>{
     try {
        if (!newsId || !userId)
            throw new Error("Не вказано userId або newsId для видалення лайка");
        const ref = database.ref(`Users/${userId}/likesArray/${newsId}`);
        await ref.remove();

        // зменшити лічильник
        const likesCountRef = database.ref(`/News/${newsId}/likes`);
        await likesCountRef.transaction(current => Math.max((current || 1) - 1, 0));

        console.log(`Лайк з новини ${newsId} видалено`);
        return true;
  } catch (error) {
    console.error(
      "FirebaseLikes.js / deleteLike(): Помилка при видаленні лайка",
      error.message
    );
    throw error;
  }
}


module.exports ={getIsNewsLiked, createLike,deleteLike};