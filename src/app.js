require("dotenv").config();
require("./config/database").connect();

const User = require("./model/user");
const auth = require("./middleware/auth");

const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");

const express = require('express')
const app = express()

const port = 3000

app.use(express.json());

app.get("/welcome", auth, (req, res) => {
  res.status(200).send("Welcome to Viter ");
});

app.post("/register", async (req, res) => {

  try {
    const { user_name, email, password } = req.body;

    if (!(email && password && user_name)) {
      res.status(400).send("All fields are required");
    }

    User.findOne({ email }).then((response) => {
      if (response)
        return res.status(409).send("User Already Exist. Please Login");
      });

    //Encrypt user password
    let encryptedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      user_name,
      email: email.toLowerCase(),
      password: encryptedPassword,
    });

    const token = jwt.sign(
      { user_id: user._id, email },
      process.env.TOKEN_KEY,
      {
        expiresIn: "2h",
      }
    );
    user.token = token;

    res.status(201).json(user);
  } catch (err) {
    console.log(err);
  }
});


app.post("/login", async (req, res) => {

  try {
    const { email, password } = req.body;

    if (!(email && password)) {
      res.status(400).send("All input is required");
    }
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign(
        { user_id: user._id, email },
        process.env.TOKEN_KEY,
        {
          expiresIn: "2h",
        }
      );

      user.token = token;

      res.status(200).json(user);
    }
    res.status(400).send("Invalid Credentials");
  } catch (err) {
    console.log(err);
  }
});

module.exports = app;



