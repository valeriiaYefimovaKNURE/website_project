const { database } = require("../firebaseAdmin.config");

const getAllNews=async()=>{
    try {
        const ref=database.ref("/News");
        const snapshot=await ref.once("value") // Получаем данные один раз
        return snapshot.val() || {};
    } catch (error) {
        console.error("FirebaseNews.js / getAllNews() : Помилка при отриманні данних новин.")
        throw new Error("Не вдалось завантажити новини");
    }
}

const getReportedComments = async () => {
    try {
        const allNews = await getAllNews();
        if (!allNews || typeof allNews !== "object") {
            throw new Error("Дані про новини невалідні");
        }

        let reportedComments = [];

        Object.entries(allNews).forEach(([newsId, news]) => {
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
                            news_id: newsId,
                            date: comment.date || "Невідома дата",
                        });
                    }
                });
            }
        });

        return reportedComments;
    } catch (error) {
        console.error("FirebaseNews.js / getReportedComments():", error.message);
        throw new Error("Не вдалось завантажити коментарі зі скаргами");
    }
};

module.exports = { getAllNews, getReportedComments};