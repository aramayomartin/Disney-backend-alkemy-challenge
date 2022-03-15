var express = require("express");
var router = express.Router();
const { User } = require("../db.js");
const bcrypt = require("bcrypt");
const {RegisterEmail} = require("../sendEmails/index.js");
router.post("/auth/register", async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    // me fijo si el usuario está disponible y si los datos son correctos
    const emailAvailable = await User.findOne({
      where: { email: email },
    });
    if (emailAvailable === null) {
      // si está disponible
      bcrypt.hash(password, 10, async (err, hash) => {
        if (err) {
          next(err);
        } else {
          const result = await User.create({ name, email, password: hash });
          next();
        }
      });
      RegisterEmail(email);
      res.status(200).send("Succesful");
    } else {
      res.status(400).json({ message: "User not avaiable." });
    }
  } catch {
    res.status(400).send("Something went wrong! :(");
  }
});

module.exports = router;
