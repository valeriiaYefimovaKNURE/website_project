const { database } = require("../firebaseAdmin.config");

const getAllNews=async()=>{
    try {
        const ref=database.ref("/News");
        const snapshot=await ref.once("value") // Получаем данные один раз
        const data = snapshot.val() || {};

        // Преобразуем объект в массив, добавляя id в каждый элемент
        const formattedNews = Object.entries(data).map(([id, newsData]) => ({
            id, 
            ...newsData
        }));

        return formattedNews;
    } catch (error) {
        console.error("FirebaseNews.js / getAllNews() : Помилка при отриманні данних новин.")
        throw new Error("Не вдалось завантажити новини");
    }
}
const createNews=async(newsData)=>{
    try{
        const ref=database.ref("/News").push();
        const newsId=ref.key;

        console.log("createNews(): newsData: ", newsData);
        const newNews={
            id:newsId,
            ...newsData,
            creatorLogin:newsData.creatorName
        };

        await ref.set(newNews);

        console.log("Допис викладено!")
        return newNews;
    }catch(error){
        console.error("Помилка викладання новини");
        throw error;
    }
}

const updateNewsData=async(newsId, updatedFields)=>{
    try{
        if (typeof updatedFields !== "object") throw new Error("Некоректні дані");
        
        const ref=database.ref(`News/${newsId}`);
        await ref.update(updatedFields)
            .then(() => console.log("Оновлені поля:", updatedFields))
            .catch(console.error);
    }catch(error){
        console.error("FirebaseNews.js / updateNewsData() : Помилка при оновленні новини.")
    }
}

const deleteNewsData = async (newsId) => {
  try {
    if (!newsId) throw new Error("Не вказано ID новини для видалення");

    const ref = database.ref(`News/${newsId}`);
    await ref.remove();
    console.log(`Новину ${newsId} видалено з бази даних`);
  } catch (error) {
    console.error("FirebaseNews.js / deleteNews(): Помилка при видаленні новини", error.message);
    throw error;
  }
};



module.exports = { getAllNews, createNews, updateNewsData,deleteNewsData};