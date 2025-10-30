const { database } = require("../firebaseAdmin.config");
const {getAllNews}=require("./FirebaseNews");

const getAllComments=async()=>{
    try{
        const allNews = await getAllNews();
        if (!allNews || !Array.isArray(allNews)) {
            throw new Error("Дані про новини невалідні");
        }

        let comments=[];

        allNews.forEach((news)=>{
            if(news.commentsArray && typeof news.commentsArray === "object"){
                Object.entries(news.commentsArray).forEach(([commentId,comment])=>{
                    comments.push({
                        id: commentId,
                        text: comment.text || "Без тексту",
                        user_uid: comment.user_uid || "Невідомий UID",
                        user_login: comment.user_login || "Анонім",
                        user_name: comment.user_name || "Невідоме ім'я",
                        news_id: news.id,
                        date: comment.date || "Невідома дата",
                        
                        hasReport:comment.reports?true:false,
                        reports: comment.reports 
                          ? Object.entries(comment.reports).map(([reportId, report]) => ({
                                reportId,
                                ...report
                            })) 
                          : [],
                    })
                })
            }
        });

        return comments;
    }catch(error){
        console.error("FirebaseNews.js / getAllComments():", error.message);
        throw new Error("Не вдалось завантажити коментарі");
    }
}

const updateComment=async(newsId, updatedFields)=>{
    try{
        if (typeof updatedFields !== "object") throw new Error("Некоректні дані");

        const ref=database.ref(`News/${newsId}/commentsArray/${commentId}`);
        await ref.update(updatedFields)
            .then(() => console.log("Оновлені поля:", updatedFields))
            .catch(console.error);
    }catch(error){
        console.error("FirebaseNews.js / updateComment() : Помилка при оновленні даних коментаря.")
    }
}

const createComment=async(newsId, commentData)=>{
    try{
        const ref=database.ref(`/News/${newsId}/commentsArray`);
        const newRef = await ref.push(commentData);

        console.log("Коментар збережено!")
        return { id: newRef.key, ...commentData };
    }catch(error){
        console.error("Помилка збереження коментаря");
    }
}

module.exports = {getAllComments, updateComment, createComment};