<template>
	<div class="main">
		<div class="form">
			<label for="nickname">Nickname (Иван | Егор)</label>
			<input list="nicknames" id="nickname" type="text" v-model.trim="nickname" autofocus>

			<label for="password">Password (123 | 321)</label>
			<input list="passwords" type="password" id="password" v-model.trim="password">
		</div>
		<button @click="authorization">Log in</button>
	</div>
</template>

<script>
export default {
	data() {
		return {
			user: '',

			nickname: '',
			password: ''
		}
	},
	methods: {
		authorization () {
			const form = {
				nickname: this.nickname,
				password: this.password
			}
			this.$auth.loginWith('local', { data: form })
			.then((res) => {
				const payload = res.data.payload
				localStorage.setItem('payload', JSON.stringify(payload))
				this.$router.push('/')
			})
		}
		// authorization () {
		// 	const form = {
		// 		nickname: this.nickname,
		// 		password: this.password
		// 	}
		// 	this.$axios.post('/api/user/login', form)
		// 	.then(async(res) => {
		// 		if (res.data.token) {
		// 			const token = JSON.stringify(res.data.token)

		// 			localStorage.setItem('token', token)
		// 			await this.$store.commit('token', token)
		// 			this.$axios.setToken(token, 'Bearer')
		// 		} else {
		// 			console.log('Ошибка авторизации')
		// 		}
		// 	})
		// }
	}
}
</script>

<style lang="sass" scoped>
.main
	display: flex
	justify-content: center
	align-items: center
	flex-direction: column
	min-height: calc(100vh - 8vh - 12vh)
.form
	display: grid
	gap: 10px
	grid-template-columns: repeat(1r, 1fr)
	justify-content: center
	width: 30%
	padding-bottom: 50px
input
	width: 250px
	height: 30px
	font-size: 18px
	border: 0
	border-bottom: 1px solid white
	background: rgba(255, 255, 255, .1)
	color: white
button
	width: 160px
	height: 40px
	color: #1D1128
	background: #a358e8
	border: 0
	font-size: 18px
	text-align: center
	font-weight: 500
	letter-spacing: .1em
</style>