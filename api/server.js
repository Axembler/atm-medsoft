const clients = [] // МАССИВ ПОЛЬЗОВАТЕЛЕЙ WEBSOCKET

const onConnect = ws => {
	ws.on('message', message => {
		// console.log('Client sent:', JSON.parse(message))
		try {
			const jsonMessage = JSON.parse(message)

			switch (jsonMessage.action) {
				// ДОБАВЛЕНИЕ ПОЛЬЗОВАТЕЛЯ В МАССИВ
				case 'user':
					ws.id = jsonMessage.user.id
					ws.nickname = jsonMessage.user.nickname
					clients.push(ws)
					console.log(`${ws.nickname} has connected`)
					break;

				// ПРИНЯТИЕ И ОТПРАВЛЕНИЕ БАЛАНСА НА КЛИЕНТ
				case 'balance':
					ws.send(Number(jsonMessage.balance))
					break;

				// ОБРАБОТКА ПЕРЕДАЧИ ДЕНЕГ
				case 'otherBalance':
					ws.send(Number(jsonMessage.balance))
					clients.forEach(client => {
						if (client.nickname === jsonMessage.requiredNickname) {
							client.send(Number(jsonMessage.requiredBalance))
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
		console.log(`${ws.nickname} has disconnected`)
		clients.pop(ws)
	})
	//ОБРАБОТКА ОШИБОК
	ws.on('error', function(err) {
		console.log('Error:', err)
	})
}

const WebSocket = require('ws')
const wsServer = new WebSocket.Server({port: 5000})

wsServer.on('connection', onConnect)

console.log(`The server is running on 5000 port`)