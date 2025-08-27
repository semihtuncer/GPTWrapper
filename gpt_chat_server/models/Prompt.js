const mongoose = require("mongoose");

const PromptSchema = new mongoose.Schema(
  {
    iconId: { type: Number, required: true },
    text: { type: String, required: true },
    access: { type: String, required: true },
    userId: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Prompt", PromptSchema);
