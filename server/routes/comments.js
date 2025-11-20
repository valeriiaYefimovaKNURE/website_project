const express = require("express");
const router = express.Router();

const{ getAllComments, getCommentsByNewsId, updateComment, createComment, deleteComment}=require("../lib/FirebaseComments");

// Получение всех комментариев
router.get("/", async (req, res) => {
  try {
    const comments=await getAllComments();
    res.json(comments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
})
// Получение комментариев по ID новости
router.get("/:newsId", async (req, res) => {
  try {
    const { newsId } = req.params;
    const comments=await getCommentsByNewsId(newsId);
    res.json(comments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
})
// Создание комментария
router.post("/", async(req,res)=>{
  try{
    const newComment=req.body;
    const newsId=newComment.news_id;
    if (!newsId) {
      return res.status(400).json({ error: "Не вказано ID новини" });
    }

    const created=await createComment(newsId,newComment);
    
    req.app.locals.broadcastNewComment({
        id: created.id,
        ...newComment
    });

    res.status(201).json(created);
  }catch(error){
    console.error("Сервер: Помилка збереження коментаря", error.message);
    res.status(500).json({ error: error.message });
  }
})
// Обновление комментария
router.put("/:newsId/:commentId", async (req,res)=>{
  try{
    const {newsId, commentId}=req.params;
    const updatedFields=req.body;

    await updateComment(newsId, commentId, updatedFields);

    res.status(200).json({success: true});
  } catch(error){
    console.error("Сервер: Помилка оновлення репорта на коментарій новини",error.message);
    res.status(500).json({error:error.message});
  }
})
// Удаление комментария
router.delete("/:newsId/:commentId", async (req, res) => {
  try {
    const { newsId, commentId } = req.params;

    await deleteComment(newsId, commentId);

    res.status(200).json({ success: true, message: "Коментар успішно видалено" });
  } catch (error) {
    console.error("Сервер: Помилка при видаленні коментаря:", error.message);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;