require("dotenv").config();
require("./data/database").connect();

const userModel = require("./model/user");
const auth = require("./middleware/auth");

const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");

const config = require('config');
const tokenExpirationTime = config.token.expireIn;

const express = require('express')
const app = express()

app.use(express.json());

app.get("/welcome", auth, (res) => {
  res.status(200).send("Welcome to Viter ");
});

app.post("/register", async (req, res) => {

  try {
    const { user_name, email, password } = req.body;

    if (!(email && password && user_name)) {
      res.status(400).send("All fields are required");
    }

    userModel.findOne({ email }).then((response) => {
      if (response)
        return res.status(409).send("User Already Exist. Please Login");
      });

    //Encrypt user password
    let encryptedPassword = await bcrypt.hash(password, 10);

    const user = await userModel.create({
      user_name,
      email: email.toLowerCase(),
      password: encryptedPassword,
    });

    const token = jwt.sign(
      { user_id: user._id, email },
      process.env.TOKEN_KEY,
      {
        expiresIn: tokenExpirationTime,
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
    const user = await userModel.findOne({ email });

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



