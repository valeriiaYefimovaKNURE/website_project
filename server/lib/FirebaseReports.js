const { database } = require("../firebaseAdmin.config");

const getAllReported=async()=>{
    try{
        const ref=database.ref("/Reported");
        const snapshot=await ref.once("value")
        const data = snapshot.val() || {};

        const formattedReports = Object.entries(data).map(([id, reportsData]) => ({
            id, 
            ...reportsData
        }));

        return formattedReports;
    }catch(error){
        console.error("FirebaseReports.js / getAllReported() : Помилка при отриманні данних репортів.")
        throw new Error("Не вдалось завантажити репорти");
    }
}

const confirmReport=async(newsId, reportId, reportData, type, moderatorNote="")=>{
    try{
        if(!newsId || !reportId || !reportData) throw new Error("Недостатньо даних для підтвердження");

        const newReportedRef=database.ref("Reported").push();

        const confirmedReport={
            user_uid:reportData.user_uid,
            reason:{
                type:type,
                text:reportData.text,
                subject:reportData.reason
            },
            time:reportData.time,
            action_taken:"warned",
            notes:moderatorNote||"Порушення підтверджено модератором"
        };

        await newReportedRef.set(confirmedReport);

        await database.ref(`News/${newsId}/commentsArray/${reportId}`).remove();

        console.log("Репорт перенесено в Reported та видалено з CommentReports в таблиці News");
    }catch(error){
        console.error("FirebaseReports / confirmReport(): Помилка при підтвердженні репорту:", error.message);
    }
}