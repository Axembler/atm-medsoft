const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const expressJWT = require('express-jwt')
const cookieParser = require('cookie-parser')

const app = express()
app.use(cookieParser())

app.use(expressJWT({secret: 'key'}).unless({path: '/api/user/login'}))

const User = require('../models/User');

//ПОПОЛНЕНИЕ
router.post('/user/replenish', async (req, res) => {
  const user = await User.findOne({
    nickname: req.body.nickname,
  })
  if (user) {
    const newBalance = Number(user.balance) + Number(req.body.replenishCount)
    await User.updateOne(
      {balance: user.balance},
      {balance: newBalance}
    )
    res.status(200).json({message: 'Balance has been successfully replenished', newBalance})
  }
})

//СНЯТИЕ
router.post('/user/withdraw', async (req, res) => {
  const user = await User.findOne({
    nickname: req.body.nickname,
  })
  if (user) {
    const newBalance = Number(user.balance) - Number(req.body.withdrawCount)
    await User.updateOne(
      {balance: user.balance},
      {balance: newBalance}
    )
    res.status(200).json({message: 'Money successfully withdrawn', newBalance})
  }
})

//ПЕРЕДАЧА
router.post('/user/transfer', async (req, res) => {
  const user = await User.findOne({
    nickname: req.body.nickname,
  })
  const requiredUser = await User.findOne({
    nickname: req.body.requiredNickname,
  })
  if (user) {
    if (requiredUser && requiredUser !== user) {
      const userNewBalance = Number(user.balance) - Number(req.body.transferCount)
      await User.updateOne(
        {balance: user.balance},
        {balance: userNewBalance}
      )
      const reqUserNewBalance = Number(requiredUser.balance) + Number(req.body.transferCount)
      await User.updateOne(
        {balance: requiredUser.balance},
        {balance: reqUserNewBalance}
      )
      res.status(200).json({message: `The money was successfully transferred to the ${requiredUser.nickname}`, userNewBalance, reqUserNewBalance})
    } else {
      res.status(500).json({message: 'ERROR: User not found'})
    }
  }
})

//БАЛАНС
router.post('/user/balance', async (req, res) => {
  const user = await User.findOne({
    nickname: req.body.nickname,
  })
  if (user) {
    res.status(200).json({balance: user.balance})
  }
})

//ПРОВЕРКА И ГЕНЕРАЦИЯ ТОКЕНА
router.post('/user/login', async (req, res) => {
  const user = await User.findOne({
    nickname: req.body.nickname,
    password: req.body.password
  })
  if (user) {
    const payload = {
      id: user._id,
      nickname: user.nickname,
      balance: user.balance
    }
    jwt.sign(payload, 'key', {expiresIn: '30m'}, function(err, token) {
      res.status(200).json({token: token, payload: payload})
    })
  } else {
    res.status(500).json({message: 'Incorrect data entered'})
  }
})

//ВЕРИФИКАЦИЯ ТОКЕНА
router.get('/user/user', async (req, res) => {
  const token = req.headers.authorization.split(' ')[1]
  const decodedToken = jwt.verify(token, 'key')
  res.status(200).json({user: decodedToken})
})

//ВЫХОД
router.post('/user/logout', async (req, res) => {
  res.status(200).json({message: 'You have successfully logged out'})
})

module.exports = router
