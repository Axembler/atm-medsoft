<template>
	<div class="main">

		<div class="info">
			<span class="name">
				Hello, {{ $auth.user.nickname }}!
			</span>
			<span class="balance">
				Balance: {{ balance }} rubles
			</span>
		</div>

		<div class="actions">
			<div class="replenish">
				<small for="replenish-input">Replenish the balance by the amount of:</small>
				<form class="display-flex" @submit.prevent="replenish">
					<input id="replenish-input" type="number" min="1" v-model.trim="replenishCount" />
					<button type="submit"><img class="check" src="images/check.svg"></button>
				</form>
			</div>
			<div class="withdraw">
				<small for="withdraw-input">Withdraw money from your account in the amount of:</small>
				<form class="display-flex" @submit.prevent="withdraw">
					<input id="withdraw-input" type="number" min="1" v-model.trim="withdrawCount" />
					<button type="submit"><img class="check" src="images/check.svg"></button>
				</form>
			</div>
			<form class="transfer" @submit.prevent="transfer">
				<div class="display-flex direction-column">
					<label>Transfer money from your account to the user's account</label>

					<small for="user-input">For user:</small>
					<input type="text" id="user-input" v-model.trim="requiredNickname" />

					<small for="transfer-input">Transfer amount:</small>
					<input type="number" id="transfer-input" min="1" v-model.trim="transferCount" />
				</div>
				<button class="transfer-perform" type="submit">TRANSFER</button>
			</form>
		</div>

		<div class="output">
			<span
				v-for="(message, index) in messages"
				:key='index + 1'
				:class="[
					{'error': message.type === 'error'},
					{'successfully': message.type === 'successfully'}
				]"
			>
				{{ message.message }}
			</span>
		</div>

	</div>
</template>

<script>
export default {
	middleware: 'auth',

	data() {
		return {
			ws: null,

			balance: '',

			requiredNickname: '',

			replenishCount: null,
			withdrawCount: null,
			transferCount: null,

			messages: [],

			pending: false
		}
	},
	methods: {
		//ПОПОЛНЕНИЕ
		replenish() {
			if (!this.pending) {
				if (this.replenishCount !== '' && this.replenishCount > 0) {
					this.pending = true
					const form = {
						nickname: this.$auth.user.nickname,
						replenishCount: this.replenishCount
					}
					this.$axios.post('/api/user/replenish', form)
					.then((res) => {
						this.messages.push({
							message: res.data.message.successfully,
							type: res.data.message.type
						})
						setTimeout(() => this.messages.shift(), 3000)
						this.replenishCount = null
						this.ws.send(
							JSON.stringify({
								action: 'balance',
								balance: Number(res.data.newBalance)
							})
						)
						this.pending = false
					})
				} else {
					this.messages.push({
						message: 'It is not possible to send a negative or empty amount',
						type: 'error'
					})
					setTimeout(() => this.messages.shift(), 3000)
					this.replenishCount = null
					this.pending = false
				}
			}
		},
		//СНЯТИЕ
		withdraw() {
			if (!this.pending) {
				if (this.withdrawCount !== '' && this.balance >= this.withdrawCount && this.withdrawCount > 0) {
					this.pending = true
					const form = {
						nickname: this.$auth.user.nickname,
						withdrawCount: this.withdrawCount
					}
					this.$axios.post('/api/user/withdraw', form)
					.then((res) => {
						this.messages.push({
							message: res.data.message.successfully,
							type: res.data.message.type
						})
						setTimeout(() => this.messages.shift(), 3000)
						this.withdrawCount = null
						this.ws.send(
							JSON.stringify({
								action: 'balance',
								balance: Number(res.data.newBalance)
							})
						)
						this.pending = false
					})
				} else {
					this.messages.push({
						message: 'It is not possible to send a negative or empty amount',
						type: 'error'
					})
					setTimeout(() => this.messages.shift(), 3000)
					this.withdrawCount = null
					this.pending = false
				}
			}
		},
		//ПЕРЕДАЧА
		transfer() {
			if (!this.pending) {
				if (this.$auth.user.nickname !== this.requiredNickname) {
					if (this.transferCount !== '' && this.transferCount > 0 && this.balance >= this.transferCount) {
						this.pending = true
						const form = {
							nickname: this.$auth.user.nickname,
							requiredNickname: this.requiredNickname,
							transferCount: this.transferCount
						}
						this.$axios.post('/api/user/transfer', form)
						.then((res) => {
							this.messages.push({
								message: res.data.message.successfully,
								type: res.data.message.type
							})
							setTimeout(() => this.messages.shift(), 3000)
							this.ws.send(
								JSON.stringify({
									action: 'otherBalance',
									balance: Number(res.data.userNewBalance),
									requiredBalance: Number(res.data.reqUserNewBalance),
									nickname: this.$auth.user.nickname,
									requiredNickname: this.requiredNickname
								})
							)
							this.transferCount = null
							this.requiredNickname = ''
							this.pending = false
						})
						.catch((err) => {
							this.messages.push({
								message: err.response.data.message.error,
								type: 'error'
							})
							setTimeout(() => this.messages.shift(), 3000)
							this.pending = false
						})
					} else {
						this.messages.push({
							message: 'It is not possible to send a negative or empty amount',
							type: 'error'
						})
						setTimeout(() => this.messages.shift(), 3000)
						this.transferCount = null
						this.pending = false
					}
				} else {
					this.messages.push({
						message: 'It is not possible to send a negative or empty amount',
						type: 'error'
					})
					setTimeout(() => this.messages.shift(), 3000)
					this.transferCount = null
					this.pending = false
				}
			}
		}
	},
	mounted() {
		this.ws = new WebSocket('ws://localhost:5000')

		this.ws.onopen = function() {
			console.log('WS-Client connected')
		}

		// ПОИСК И ОТПРАВЛЕНИЕ БАЛАНСА
		this.$axios.post('/api/user/balance', {nickname: this.$auth.user.nickname})
		.then((res) => {
			this.ws.send(
				JSON.stringify({
					action: 'balance',
					balance: Number(res.data.balance)
				})
			)
		})

		// ОТПРАВЛЕНИЕ ПОЛЬЗОВАТЕЛЯ В WEBSOCKET
		this.$axios.post('/api/user/user', {nickname: this.$auth.user.nickname})
		.then((res) => {
			this.ws.send(
				JSON.stringify({
					action: 'user',
					user: res.data
				})
			)
		})

		// ОТОБРАЖЕНИЕ БАЛАНСА
		this.ws.onmessage = (balance) => {
			this.balance = Number(balance.data)
		}
	}
}
</script>

<style lang="sass" scoped>
.main
	display: flex
	flex-direction: column
	align-items: center
	min-height: calc(100vh - 8vh - 12vh)
.info
	display: flex
	justify-content: space-around
	align-items: center
	width: 100%
	padding-bottom: 100px
.actions
	display: flex
	flex-direction: column
	align-items: center
	width: 100%
	margin-bottom: 25px
.transfer
	display: flex
	flex-direction: column
	align-items: center
	justify-content: center
	padding-top: 30px
.transfer label
	width: 285px
	padding-bottom: 10px
	font-size: 14px
.transfer-perform
	width: 120px
	height: 30px
	background: $red
	border: 0
	font-size: 14px
	font-weight: 500
#user-input, #transfer-input
	width: 280px
.check
	width: 15px
.output
	display: flex
	flex-direction: column
	align-items: center
	overflow: hidden
	height: 250px
	font-size: 14px
	span
		text-align: center
		margin-top: 15px
small
	display: flex
	width: 200px
button
	display: flex
	justify-content: center
	align-items: center
	border: 0
	width: 30px
	height: 30px
	background: $red
input
	margin-bottom: 10px

@media (max-width: 350px)
	.info
		padding-bottom: 30px
</style>