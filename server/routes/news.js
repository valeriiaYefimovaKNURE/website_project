const express = require("express");
const router = express.Router();

const { getAllNews, getNewsById, updateNewsData, createNews, deleteNewsData, getAllThemes}=require("../lib/FirebaseNews");

// Получение всех новостей
router.get("/", async (req, res) => {
  try {
    const news=await getAllNews();
    res.json(news);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
})
// Получение всех тем новостей
router.get("/themes", async (req, res) => {
  try {
    const themes=await getAllThemes();
    res.json(themes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
})
// Получение новости по ID
router.get("/:newsId", async (req, res) => {
  try {
    const { newsId } = req.params;
    const newsItem = await getNewsById(newsId);

    if (!newsItem) {
      return res.status(404).json({ error: "Новину не знайдено" });
    }

    res.json(newsItem);
  } catch (error) {
    console.error("Сервер: Помилка при отриманні новини:", error.message);
    res.status(500).json({ error: error.message });
  }
});

// Создание новости
router.post("/", async(req,res)=>{
  try{
    const newsData=req.body;

    if (!newsData) {
      return res.status(400).json({ error: "Немає даних для новини" });
    }

    const created=await createNews(newsData);
    res.status(201).json(created);
  }catch(error){
    console.error("Сервер: Помилка створення допису", error.message);
    res.status(500).json({ error: error.message });
  }
})

// Обновление новости
router.put("/:newsId", async (req,res)=>{
  try{
    const {newsId}=req.params;
    const updatedFields=req.body;

    await updateNewsData(newsId, updatedFields);

    res.status(200).json({success: true});
  }catch(error){
    console.error("Сервер: Помилка оновлення даних новини",error.message);
    res.status(500).json({error:error.message});
  }
})

// Удаление новости
router.delete("/:newsId", async (req, res) => {
  try {
    const { newsId } = req.params;

    await deleteNewsData(newsId);

    res.status(200).json({ success: true, message: "Новину успішно видалено" });
  } catch (error) {
    console.error("Сервер: Помилка при видаленні новини:", error.message);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;