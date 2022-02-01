const WebSocket = require('ws')

const clients = [] // МАССИВ ПОЛЬЗОВАТЕЛЕЙ WEBSOCKET

const onConnect = ws => {
	ws.on('message', message => {
		// console.log('Client sent:', JSON.parse(message))
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
					console.log(`${ws.nickname} has connected at ${options.format(date)}`)
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
		console.log(`${ws.nickname} has disconnected at ${options.format(date)}`)
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