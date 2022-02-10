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
  .then(() => console.log('The connection to the MongoDB is established'))
  .catch(err => console.error(err))

const user = require('./routes/user')

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(user)
app.use(cors())

if (require.main === module) {
  const port = process.env.PORT || 3001

  http.listen(port, () => {
    console.log(`The server is running on ${port} port`)
  })
}

io.on('connection', function() {
  console.log('a user connected')
})

module.exports = app