const router = require("express").Router();
const Message = require("../models/Message");
const { verifyToken } = require("./verifyToken");
const { generateTextResponse } = require("./openai");

// GET ALL MESSAGES OF CHAT
router.get("/get/:chatId", verifyToken, async (req, res) => {
  try {
    const msgs = await Message.find({ chatId: req.params.chatId });
    res.status(200).json(msgs);
  } catch (err) {
    res.status(500).json(err);
  }
});
// CREATE
router.put("/create", verifyToken, async (req, res) => {
  const newMsg = new Message(req.body);

  try {
    const saved = await newMsg.save();
    res.status(200).json(saved);
  } catch (err) {
    res.status(500).json(err);
  }
});
// DELETE ALL
router.delete("/deleteall/:chatId", verifyToken, async (req, res) => {
  try {
    await Message.deleteMany({ chatId: req.params.chatId });
    res.status(200).json("Deleted all!");
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET AI RESPONSE
router.put("/getai", verifyToken, async (req, res) => {
  // const aiMsg = generateTextResponse(req.body.message);

  const msg = new Message({
    chatId: req.body.chatId,
    sender: "ai",
    message: process.env.OPENAI_API_KEY
      ? "zzzz"
      : "Konuşulabilmesi için OpenAI API Key gerekli!",
    type: process.env.OPENAI_API_KEY ? "message" : "error",
  });

  try {
    const saved = await msg.save();
    res.status(200).json(saved);
  } catch (err) {
    res.status(500).json(err);
  }
});
module.exports = router;
