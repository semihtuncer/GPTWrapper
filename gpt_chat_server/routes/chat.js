const router = require("express").Router();
const Chat = require("../models/Chat");
const { verifyToken } = require("./verifyToken");

// GET
router.get("/get/:id", verifyToken, async (req, res) => {
  try {
    const chats = await Chat.find(req.params.id);
    res.status(200).json(chats);
  } catch (err) {
    res.status(500).json(err);
  }
});
// CREATE
router.put("/create", verifyToken, async (req, res) => {
  const newChat = new Chat(req.body);

  try {
    const saved = await newChat.save();
    res.status(200).json(saved);
  } catch (err) {
    res.status(500).json(err);
  }
});
// DELETE
router.delete("/delete/:id", verifyToken, async (req, res) => {
  try {
    await Chat.findByIdAndDelete(req.params.id);
    res.status(200).json("Chat deleted!");
  } catch (err) {
    res.status(500).json(err);
  }
});
// GET ALL OF A USER
router.get("/getall/:userId", verifyToken, async (req, res) => {
  try {
    const chats = await Chat.find({ userId: req.params.userId });
    res.status(200).json(chats);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
