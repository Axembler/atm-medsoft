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
				<form class="display-flex">
					<input id="replenish-input" type="number" min="1" v-model.trim="replenishCount" />
					<button @click="replenish"><img class="check" src="images/check.svg"></button>
				</form>
			</div>
			<div class="withdraw">
				<small for="withdraw-input">Withdraw money from your account in the amount of:</small>
				<form class="display-flex">
					<input id="withdraw-input" type="number" min="1" v-model.trim="withdrawCount" />
					<button @click="withdraw"><img class="check" src="images/check.svg"></button>
				</form>
			</div>
			<form class="transfer">
				<div class="display-flex direction-column">
					<label>Transfer money from your account to the user's account</label>

					<small for="user-input">For user:</small>
					<input type="text" id="user-input" v-model.trim="requiredNickname" />

					<small for="transfer-input">Transfer amount:</small>
					<input type="number" id="transfer-input" min="1" v-model.trim="transferCount" />
				</div>
				<button class="transfer-perform" @click="transfer">TRANSFER</button>
			</form>
		</div>
		<transition-group name="fade" class="messages">
			<span class="successfully fade-item" v-if="replenishSuccessfully" key="rep">{{ replenishSuccessfully }}</span>
			<span class="successfully fade-item" v-if="withdrawSuccessfully" key="wit">{{ withdrawSuccessfully }}</span>
			<span class="successfully fade-item" v-if="transferSuccessfully" key="tra">{{ transferSuccessfully }}</span>

			<span class="error fade-item" v-if="error" key="error">{{ error }}</span>
		</transition-group>
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

			error: '',

			pending: false
		}
	},
	methods: {
		//ПОПОЛНЕНИЕ
		replenish() {
			event.preventDefault()
			if (!this.pending) {
				if (this.replenishCount !== '' && this.replenishCount > 0) {
					this.pending = true
					const form = {
						nickname: this.$auth.user.nickname,
						replenishCount: this.replenishCount
					}
					this.$axios.post('/api/user/replenish', form)
					.then((res) => {
						this.replenishSuccessfully = res.data.message
						setTimeout(() => this.replenishSuccessfully = '', 3000)

						this.balance = Number(res.data.newBalance)

						this.pending = false
					})
				} else {
					this.error = 'ERROR: It is not possible to send a negative or empty amount'
					setTimeout(() => this.error = '', 3000)

					this.pending = false
				}
			}
		},
		//СНЯТИЕ
		withdraw() {
			event.preventDefault()
			if (!this.pending) {
				if (this.withdrawCount !== '' && this.balance >= this.withdrawCount && this.withdrawCount > 0) {
					this.pending = true
					const form = {
						nickname: this.$auth.user.nickname,
						withdrawCount: this.withdrawCount
					}
					this.$axios.post('/api/user/withdraw', form)
					.then((res) => {
						this.withdrawSuccessfully = res.data.message
						setTimeout(() => this.withdrawSuccessfully = '', 3000)

						this.balance = Number(res.data.newBalance)

						this.pending = false
					})
				} else {
					this.error = 'ERROR: It is not possible to send a negative or empty amount'
					setTimeout(() => this.error = '', 3000)
					
					this.pending = false
				}
			}
		},
		//ПЕРЕДАЧА
		transfer() {
			event.preventDefault()
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
							this.transferSuccessfully = res.data.message
							setTimeout(() => this.transferSuccessfully = '', 3000)

							this.balance = Number(res.data.userNewBalance)

							this.pending = false
						})
						.catch((err) => {
							this.error = err.response.data.message
							setTimeout(() => this.error = '', 3000)
							
							this.pending = false
						})
					} else {
						this.error = 'ERROR: It is not possible to send a negative or empty amount'
						setTimeout(() => this.error = '', 3000)
						
						this.pending = false
					}
				} else {
					this.error = 'ERROR: You cant send money to yourself'
					setTimeout(() => this.error = '', 3000)
					
					this.pending = false
				}
			}
		}
	},
	mounted() {
		this.$axios.post('/api/user/balance', {nickname: this.$auth.user.nickname})
		.then((res) => {
			this.balance = Number(res.data.balance)
		})
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

@media (max-width: 350px)
	.info
		padding-bottom: 30px
</style>