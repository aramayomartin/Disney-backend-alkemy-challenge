var express = require("express");
var router = express.Router();
const { User } = require("../db.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const {LoginEmail} = require("../sendEmails/index.js");


/* GET users listing. */
router.post("/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    // consutamos DB y validamos que existen tanto username y password
    const user = await User.findOne({ where: { email: email } });
    const match = await bcrypt.compare(password, user.dataValues.password);
    if (match) {
      const accesToken = jwt.sign(user.dataValues, process.env.SECRET,{expiresIn:'10m'});
      LoginEmail(email);
      res.header("authorization", accesToken).json({
        message: "User authenticated",
        token: accesToken,
      });
    } else {
      res.status(400).send("User or password incorrect");
    }
  } catch {
    res.status(400).send("Something went wrong! :(");
  }
});

// functions

module.exports = router;
