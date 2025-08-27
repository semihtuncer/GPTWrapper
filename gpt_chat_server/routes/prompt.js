const router = require("express").Router();
const Prompt = require("../models/Prompt");
const { verifyToken } = require("./verifyToken");

// GET ALL OF A USER && GLOBALS
router.get("/get/:userId", verifyToken, async (req, res) => {
  try {
    const localPrompts = await Prompt.find({ userId: req.params.userId });
    const globalPrompts = await Prompt.find({ access: "GLOBAL" });
    const prompts = [...globalPrompts, ...localPrompts];
    res.status(200).json(prompts);
  } catch (err) {
    res.status(500).json(err);
  }
});
// CREATE
router.put("/create", verifyToken, async (req, res) => {
  const newPrompt = new Prompt(req.body);

  try {
    const saved = await newPrompt.save();
    res.status(200).json(saved);
  } catch (err) {
    res.status(500).json(err);
  }
});
// DELETE
router.delete("/delete/:id", verifyToken, async (req, res) => {
  try {
    await Prompt.findByIdAndDelete(req.params.id);
    res.status(200).json("Prompt deleted!");
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
