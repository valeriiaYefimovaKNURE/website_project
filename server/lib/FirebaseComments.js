const { database } = require("../config/firebaseAdmin.config");
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
        console.error("FirebaseComments.js / getAllComments():", error.message);
        throw new Error("Не вдалось завантажити коментарі");
    }
}

const getCommentsByNewsId=async(newsId)=>{
    try{
        if (!newsId) throw new Error("newsId відсутнє");
        const allNews = await getAllNews();
        if (!allNews || !Array.isArray(allNews)) {
            throw new Error("Дані про новини невалідні");
        }

        const news = allNews.find(n => n.id === newsId);
        if (!news || !news.commentsArray) return [];

        const comments = Object.entries(news.commentsArray).map(([commentId, comment]) => ({
            id: commentId,
            text: comment.text || "Без тексту",
            user_uid: comment.user_uid || "Невідомий UID",
            user_login: comment.user_login || "Анонім",
            user_name: comment.user_name || "Невідоме ім'я",
            news_id: news.id,
            date: comment.date || "Невідома дата",
            hasReport: comment.reports ? true : false,
            reports: comment.reports
            ? Object.entries(comment.reports).map(([reportId, report]) => ({
                reportId,
                ...report
            }))
            : [],
        }));
        return comments;
    }catch{
        console.error("FirebaseComments.js / getCommentsByNewsId():", error.message);
        return [];
    }
}


const updateComment=async(newsId, commentId, updatedFields)=>{
    try{
        if (!newsId || !commentId) throw new Error("newsId або commentId відсутні");
        if (typeof updatedFields !== "object") throw new Error("Некоректні дані");

        const ref=database.ref(`News/${newsId}/commentsArray/${commentId}`);
        await ref.update(updatedFields)
            .then(() => console.log("Оновлені поля:", updatedFields));
    }catch(error){
        console.error("FirebaseComments.js / updateComment() : Помилка при оновленні даних коментаря.")
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
const deleteComment = async (newsId, commentId) => {
   try {
    if (!newsId || !commentId)
      throw new Error("Не вказано ID новини або коментаря для видалення");

    const ref = database.ref(`News/${newsId}/commentsArray/${commentId}`);
    await ref.remove();

    console.log(`Коментар ${commentId} з новини ${newsId} видалено`);
  } catch (error) {
    console.error(
      "FirebaseComments.js / deleteComment(): Помилка при видаленні коментаря",
      error.message
    );
    throw error;
  }
}
const getReportedComments = async () => {
    try {
        const allNews = await getAllNews();
        if (!allNews || !Array.isArray(allNews)) {
            throw new Error("Дані про новини невалідні");
        }

        let reportedComments = [];

        allNews.forEach((news) => {
            if (news.commentsArray && typeof news.commentsArray === "object") {
                Object.entries(news.commentsArray).forEach(([commentId, comment]) => {
                    if (comment.reports && typeof comment.reports === "object" && Object.keys(comment.reports).length > 0) {
                        reportedComments.push({
                            id: commentId,
                            reason: Object.values(comment.reports)[0]?.reason || "Невідома причина",
                            status: Object.values(comment.reports)[0]?.status || "Невідомий статус",
                            time: Object.values(comment.reports)[0]?.time || "Невідомий час",
                            text: comment.text || "Без тексту",
                            user_uid: comment.user_uid || "Невідомий UID",
                            user_login: comment.user_login || "Анонім",
                            user_name: comment.user_name || "Невідоме ім'я",
                            news_id: news.id,
                            date: comment.date || "Невідома дата",
                        });
                    }
                });
            }
        });

        return reportedComments;
    } catch (error) {
        console.error("FirebaseComments.js / getReportedComments():", error.message);
        throw new Error("Не вдалось завантажити коментарі зі скаргами");
    }
};

const updateCommentReport=async(newsId, commentId, updatedFields)=>{
    try{
        if (typeof updatedFields !== "object") throw new Error("Некоректні дані");

        const ref=database.ref(`News/${newsId}/commentsArray/${commentId}`);
        await ref.update(updatedFields)
            .then(() => console.log("Оновлені поля:", updatedFields))
            .catch(console.error);
    }catch(error){
        console.error("FirebaseComments.js / updateCommentReport() : Помилка при оновленні даних коментаря.")
    }
}

module.exports = {getAllComments,getCommentsByNewsId, updateComment, createComment, deleteComment, getReportedComments, updateCommentReport};