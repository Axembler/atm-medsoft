const express = require('express')
const app = express()

const mongoose = require('mongoose')
const cors = require('cors')
const bodyParser = require('body-parser')

const http = require('http').createServer(app)
const io = require('socket.io')(http, {
  cors: {
    origin: "http://atm-medsoft.herokuapp.com",
    methods: ["GET", "POST"]
  },
  allowRequest: (req, callback) => {
    callback(null, false);
  },
  allowEIO3: true
})

mongoose.connect(
  'mongodb://pagliaccio:89205103106@cluster0-shard-00-00.xzdxm.mongodb.net:27017,cluster0-shard-00-01.xzdxm.mongodb.net:27017,cluster0-shard-00-02.xzdxm.mongodb.net:27017/atm?ssl=true&replicaSet=atlas-qtyj9o-shard-0&authSource=admin&retryWrites=true&w=majority',
  { useNewUrlParser: true, useUnifiedTopology: true }
)
  .then(() => console.log('Connection to MongoDB is established'))
  .catch(err => console.error(err))

const user = require('./routes/user')

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(user)
app.use(cors())

const users = [] // МАССИВ ПОЛЬЗОВАТЕЛЕЙ

io.on('connection', socket => {
  // БАЛАНС
  socket.on('balance', (data, callback) => {
    callback({balance: data.balance})
  })

  // ОБНОВЛЕНИЕ БАЛАНСА У КОНКРЕТНОГО ПОЛЬЗОВАТЕЛЯ
  socket.on('transfer', (data) => {
    users.forEach(user => {
      if (user.nickname === data.nickname) {
        io.to(user.id).emit('balance', {balance: data.balance})
      }
    })
  })

  // ПОДКЛЮЧЕНИЕ ПОЛЬЗОВАТЕЛЯ
  socket.on('user', data => {
    socket.nickname = data.user.nickname

    users.push(socket)

    const date = new Date()
    const options = new Intl.DateTimeFormat('ru', {
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric'
    })
    console.log(`${options.format(date)} | ${socket.nickname} has connected`)
  })

  // ОТКЛЮЧЕНИЕ ПОЛЬЗОВАТЕЛЯ
  socket.on('disconnect', function() {
    if (socket.nickname) {
      users.splice(users.indexOf(socket), 1)

      const date = new Date()
      const options = new Intl.DateTimeFormat('ru', {
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric'
      })
      console.log(`${options.format(date)} | ${socket.nickname} has disconnected`)
    }
  })
})

if (require.main === module) {
  const port = process.env.PORT || 3001

  http.listen(port, () => {
    console.log(`Server with socket.io is running on ${port} port`)
  })
}

module.exports = app
