const mongoose = require('mongoose')
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const app = express()

app.use(cors())

mongoose.connect(
  'mongodb://pagliaccio:89205103106@cluster0-shard-00-00.xzdxm.mongodb.net:27017,cluster0-shard-00-01.xzdxm.mongodb.net:27017,cluster0-shard-00-02.xzdxm.mongodb.net:27017/atm?ssl=true&replicaSet=atlas-qtyj9o-shard-0&authSource=admin&retryWrites=true&w=majority',
  { useNewUrlParser: true, useUnifiedTopology: true }
)
  .then(() => console.log('The connection to the MongoDB is established'))
  .catch(err => console.error(err))

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const user = require('./routes/user')

app.use(user)

module.exports = app

if (require.main === module) {
  const port = process.env.PORT || 3001
  app.listen(port, () => {
    console.log(`The server with MongoDB is running on ${port} port`)
  })
}

const WebSocket = require('ws')

const clients = [] // МАССИВ ПОЛЬЗОВАТЕЛЕЙ WEBSOCKET

const onConnect = ws => {
	ws.on('message', message => {
		console.log('Client sent:', JSON.parse(message))
		try {
			const jsonMessage = JSON.parse(message)

			switch (jsonMessage.action) {

				// ДОБАВЛЕНИЕ ПОЛЬЗОВАТЕЛЯ В МАССИВ
				case 'user':
					const date = new Date()
					const options = new Intl.DateTimeFormat('ru', {
						hour: 'numeric',
						minute: 'numeric',
						second: 'numeric'
					})

					ws.id = jsonMessage.user.id
					ws.nickname = jsonMessage.user.nickname
					clients.push(ws)
					console.log(`${options.format(date)} | ${ws.nickname} has connected`)
					break;

				// ПРИНЯТИЕ И ОТПРАВЛЕНИЕ БАЛАНСА НА КЛИЕНТ
				case 'balance':
					ws.send(jsonMessage.balance)
					break;

				// ОБРАБОТКА ПЕРЕДАЧИ ДЕНЕГ
				case 'otherBalance':
					ws.send(jsonMessage.balance)

					clients.forEach(client => {
						if (client.nickname === jsonMessage.requiredNickname) {
							client.send(jsonMessage.requiredBalance)
						}
					})
					break;

				default:
					console.log('Unknown command')
					break;
			}
		} catch (error) {
			console.log(error)
		}
	})
	// ОБРАБОТКА ВЫХОДА
	ws.on('close', function() {
		const date = new Date()
		const options = new Intl.DateTimeFormat('ru', {
			hour: 'numeric',
			minute: 'numeric',
			second: 'numeric'
		})

		console.log(`${options.format(date)} | ${ws.nickname} has disconnected`)
		clients.pop(ws)
	})

	//ОБРАБОТКА ОШИБОК
	ws.on('error', function(err) {
		console.log('Error:', err)
	})
}

const wsServer = new WebSocket.Server({port: 5000})

wsServer.on('connection', onConnect)

console.log(`The WS-server is running on 5000 port`)