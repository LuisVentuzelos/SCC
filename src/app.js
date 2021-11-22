require('dotenv').config()
require('./data/database').connect()

const express = require('express')

const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const randToken = require('rand-token')

const config = require('config')
const auth = require('./middleware/auth')
const userModel = require('./model/user')

const tokenExpirationTime = config.token.expireIn
var refreshTokensUsed = {}

const app = express()

app.use(express.json())

app.get('/welcome', auth, (req, res) => {
  res.status(200).send('Welcome to Viter')
})

app.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body

    if (!(email && password && name)) {
      res.status(400).send('All fields are required')
    }

    userModel.findOne({ email }).then((response) => {
      if (response) return res.status(409).send('User Already Exist. Please Login')
    })

    // Encrypt user password
    const encryptedPassword = await bcrypt.hash(password, 10)

    const user = await userModel.create({
      name,
      email: email.toLowerCase(),
      password: encryptedPassword
    })

    const token = jwt.sign(
      { user_id: user._id, email, role },
      process.env.TOKEN_KEY,
      {
        expiresIn: tokenExpirationTime
      }
    )
    user.token = token

    res.status(201).json(user)
  }
  catch (err) {
    console.log(err)
  }
})

app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    if (!(email && password)) {
      return res.status(400).send('All input is required')
    }
    const user = await userModel.findOne({ email })

    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign(
        { user_id: user._id, email, role },
        process.env.TOKEN_KEY,
        {
          expiresIn: tokenExpirationTime
        }
      )
      var refreshToken = randToken.uid(256);
      user.token = token
      user.refreshToken = refreshToken
      refreshTokensUsed[refreshToken] = user.name

      return res.status(200).json(user)
    }
    res.status(400).send('Invalid Credentials')
  }
  catch (err) {
    console.log(err)
  }
})

app.post('/refreshToken', function(req, res){
  try {
    const { email, refreshToken } = req.body

    if (!(email && refreshToken)) {
      return res.status(400).send('Required data missing')
    }

    if((refreshToken in refreshTokensUsed) && (refreshTokensUsed[refreshToken] == email)){
      const user = await userModel.findOne({ email })

      if(user.role !== "admin"){
        return res.status(401).json({ message: 'Unauthorized' });
      }
      const token = jwt.sign(
        { user_id: user._id, email, role },
        process.env.TOKEN_KEY,
        {
          expiresIn: tokenExpirationTime
        }
      )

      user.token = token
      user.refreshToken = refreshToken
      refreshTokensUsed[refreshToken] = user.name

      return res.status(200).json(user)
    }
    res.status(400).send('Invalid data')
  }
  catch (err) {
    console.log(err)
  }
})

app.post('/revoke', auth, function(req, res){
  try {
    if (req.user.role !== "admin") {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    if(refreshToken in refreshTokensUsed){
      delete refreshTokensUsed[refreshToken]
    }
    res.status(200).send("Token revoked")
  } catch (err) {
    console.log(err)
  }
})

app.post('/revokeAll', auth, function(req, res){
  try {
    if (req.user.role !== "admin") {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    for(var refreshToken in refreshTokensUsed){
      delete refreshTokensUsed[refreshToken]
    }
    res.status(200).send("All tokens revoked");
  } catch (err) {
    console.log(err)
  }
})

app.get('/:id', auth, function(req, res){
  try {
    if (req.params.id !== req.user.id && req.user.role !== "admin") {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const user = await userModel.findById(req.params.id)
    if (!user) return res.status(401).json({ message: 'User not found' });
    return user;

  }catch (err) {
    console.log(err)
  }
});

module.exports = app
