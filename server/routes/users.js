const express = require("express");
const router = express.Router();
const { getAllUsers, updateUserData, createUser, deleteUserData, userSignIn, saveUserToBD } = require("../lib/FirebaseUsers");

// Получение всех пользователей
router.get("/", async (req, res) => {
  try {
    const users = await getAllUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Создание пользователя
router.post("/", async (req, res) => {
  try {
    const { userData, userId } = req.body;
    if (!userData) return res.status(400).json({ error: "Нет данных пользователя" });
    const created = await createUser(userData, userId);
    res.status(201).json(created);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Обновление
router.put("/:userId", async (req, res) => {
  try {
    await updateUserData(req.params.userId, req.body);
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Удаление
router.delete("/:userId", async (req, res) => {
  try {
    await deleteUserData(req.params.userId);
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;