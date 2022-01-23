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
				<div class="display-flex">
					<input id="replenish-input" type="number" min="1" v-model.trim="replenishCount">
					<button @click="replenish"><img class="check" src="images/check.svg"></button>
				</div>
			</div>
			<div class="withdraw">
				<small for="withdraw-input">Withdraw money from your account in the amount of:</small>
				<div class="display-flex">
					<input id="withdraw-input" type="number" min="1" v-model.trim="withdrawCount">
					<button @click="withdraw"><img class="check" src="images/check.svg"></button>
				</div>
			</div>
			<div class="transfer">
				<div class="display-flex direction-column">
					<label>Transfer money from your account to the user's account</label>

					<small for="user-input">For user:</small>
					<input type="text" id="user-input" v-model.trim="requiredNickname">

					<small for="transfer-input">Transfer amount:</small>
					<input type="number" id="transfer-input" min="1" v-model.trim="transferCount">
				</div>
				<button class="transfer-perform" @click="transfer">TRANSFER</button>
			</div>
			<div class="messages">
				<span class="successfully" v-if="replenishSuccessfully">{{ replenishSuccessfully }}</span>
				<span class="successfully" v-if="withdrawSuccessfully">{{ withdrawSuccessfully }}</span>
				<span class="successfully" v-if="transferSuccessfully">{{ transferSuccessfully }}</span>
				
				<span class="error" v-if="errorNegative">{{ errorNegative }}</span>
				<span class="error" v-if="errorUnknown">{{ errorUnknown }}</span>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	middleware: 'auth',

	data() {
		return {
			balance: '',

			requiredNickname: '',

			replenishCount: null,
			withdrawCount: null,
			transferCount: null,

			replenishSuccessfully: '',
			withdrawSuccessfully: '',
			transferSuccessfully: '',

			errorNegative: '',
			errorUnknown: ''
		}
	},
	methods: {
		checkBalance() {
			this.$axios.post('/api/user/balance', {nickname: this.$auth.user.nickname})
			.then((res) => {
				this.balance = res.data.balance
			})
		},


		// updateBalance(newBalance) {
		// 	const payload = localStorage.getItem('payload')
		// 	const parsePayload = JSON.parse(payload)

		// 	parsePayload.balance = newBalance
		// 	localStorage.setItem('payload', JSON.stringify(parsePayload))
		// },
		//ПОПОЛНЕНИЕ
		replenish() {
			if (this.replenishCount > 0 && this.replenishCount !== '') {
				const form = {
					nickname: this.$auth.user.nickname,
					replenishCount: this.replenishCount
				}
				this.$axios.post('/api/user/replenish', form)
				.then((res) => {
					this.replenishSuccessfully = res.data.message
					this.checkBalance()
					// this.$axios.post('/api/user/balance', {nickname: this.$auth.user.nickname})
					// .then((res) => {
					// 	this.balance = res.data.balance
					// })
				})
			} else {
				this.errorNegative = 'ERROR: It is not possible to send a negative or empty amount'
			}
		},
		//СНЯТИЕ
		withdraw() {
			if (this.withdrawCount > 0 && this.withdrawCount !== '' && this.balance > 0 && this.balance > this.withdrawCount) {
				const form = {
					nickname: this.$auth.user.nickname,
					withdrawCount: this.withdrawCount
				}
				this.$axios.post('/api/user/withdraw', form)
				.then((res) => {
					this.withdrawSuccessfully = res.data.message
					this.checkBalance()
					// this.$axios.post('/api/user/balance', {nickname: this.$auth.user.nickname})
					// .then((res) => {
					// 	this.balance = res.data.balance
					// })
				})
			} else {
				this.errorNegative = 'ERROR: It is not possible to send a negative or empty amount'
			}
		},
		//ПЕРЕДАЧА
		transfer() {
			if (this.transferCount > 0 && this.transferCount !== '' && this.balance > 0) {
				const form = {
					nickname: this.$auth.user.nickname,
					requiredNickname: this.requiredNickname,
					transferCount: this.transferCount
				}
				this.$axios.post('/api/user/transfer', form)
				.then((res) => {
					this.transferSuccessfully = res.data.message
					this.checkBalance()
					// this.$axios.post('/api/user/balance', {nickname: this.$auth.user.nickname})
					// .then((res) => {
					// 	this.balance = res.data.balance
					// })
				})
				.catch((err) => {
					this.errorUnknown = err.response.data.message
				})
			} else {
				this.errorNegative = 'ERROR: It is not possible to send a negative or empty amount'
			}
		}
	},
	mounted() {
		this.checkBalance()
	}
}
</script>s

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
	width: 285px
.transfer
	display: flex
	flex-direction: column
	align-items: center
	justify-content: center
	padding-top: 30px
.transfer label
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
.messages
	display: flex
	flex-direction: column
	align-items: center
	font-size: 14px
	span
		text-align: center
		margin-top: 15px
.error
	color: $err
.successfully
	color: $successfully	
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
</style>