const router = require("express").Router();
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { verifyToken } = require("./verifyToken");

// REGISTER
router.post("/register", async (req, res) => {
  const newUser = new User({
    email: req.body.email,
    password: CryptoJS.AES.encrypt(
      req.body.password,
      process.env.PASSWORD_DECRYPTION_KEY
    ).toString(),
  });

  try {
    const savedUser = await newUser.save();
    res.status(200).json(savedUser);
  } catch (err) {
    res.status(404).json(err);
  }
});
// LOGIN
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      res.status(404).json("No user registered with that email!");
      return;
    }

    const decryptedPassword = CryptoJS.AES.decrypt(
      user.password,
      process.env.PASSWORD_DECRYPTION_KEY
    );
    const pwd = decryptedPassword.toString(CryptoJS.enc.Utf8);

    if (pwd !== req.body.password) {
      res.status(404).json("Password is wrong!");
      return;
    }

    const accessToken = jwt.sign({ id: user._id }, process.env.JWT_KEY, {
      expiresIn: "7d",
    });
    const { password, ...others } = user._doc;

    res.status(200).json({ ...others, accessToken });
  } catch (err) {
    res.status(404).json(err);
  }
});
// GET USER
router.get("/get", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const { password, ...others } = user._doc;
    const accessToken = req.headers.token.split(" ")[1];

    res.status(200).json({ ...others, accessToken });
  } catch (err) {
    res.status(500).json(err);
  }
});
module.exports = router;
