const express = require('express')
const app = express()

const mongoose = require('mongoose')
const cors = require('cors')
const bodyParser = require('body-parser')

const http = require('http').createServer(app)
const io = require('socket.io')(http)

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

const users = []
const connections = []

// app.get('/', (req, res) => {
//   res.sendFile(__dirname + '/index.html')
// })

// ВЫВОД ПОЛЬЗОВАТЕЛЯ ПРИ ПОДКЛЮЧЕНИИ
io.on('connection', (socket) => {
  connections.push(socket)
  console.log('User connected')

  socket.send('Hello')

  socket.on('disconnect', function(data) {
    connections.splice(connections.indexOf(socket), 1)
    console.log('User disconnected')
  })
})

// СОЗДАНИЕ СЕРВЕРА С SOCKET.IO И ВЫВОД В КОНСОЛЬ
if (require.main === module) {
  const port = process.env.PORT || 3001

  http.listen(port, () => {
    console.log(`Server with socket.io is running on ${port} port`)
  })
}

module.exports = app
