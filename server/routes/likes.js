const express = require("express");
const router = express.Router();

const {getIsNewsLiked, createLike,deleteLike}= require("../lib/FirebaseLikes");

//перевірка чи лайкнута новина
router.get("/:userId/:newsId", async (req, res) => {
  try {
    const { userId, newsId } = req.params;
    const isLiked = await getIsNewsLiked(userId, newsId);
    res.json({ liked: isLiked });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// створення лайка
router.post("/", async (req, res) => {
  try {
    const { userId, newsId } = req.body;
    if (!userId || !newsId) {
      return res.status(400).json({ error: "userId і newsId обов'язкові" });
    }
    const result = await createLike(userId, newsId);
    res.status(201).json({ success: true, ...result });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//видалення лайка
router.delete("/:userId/:newsId", async (req, res) => {
  try {
    const { userId, newsId } = req.params;
    const result = await deleteLike(userId, newsId);
    res.json({ success: true, ...result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;