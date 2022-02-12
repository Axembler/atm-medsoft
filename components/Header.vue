<template>
	<header>
		<div class="buttons">
			<NuxtLink exact to="/" class="logo">ATM</NuxtLink>
			<button class="logout" @click="logout" v-if="$auth.loggedIn">Log out</button>
		</div>
	</header>
</template>

<script>
export default {
	methods: {
		async logout() {
			this.$auth.logout()

			localStorage.removeItem('payload')

			this.$socket.disconnect()

			this.$router.push('/login')
		}
	}
}
</script>

<style lang="sass" scoped>
*
	color: white
header
	display: flex
	align-items: center
	justify-content: space-between
	height: 12vh
.logo
	font-size: 32px
	font-weight: 500
	padding-left: 5%
.buttons
	display: flex
	align-items: center
	justify-content: space-between
	width: 100%
.logout
	background: none
	border: 0
	padding: 0
	padding-right: 5%
.login, .logout
	font-size: 20px
	white-space: nowrap

@media (max-width: 350px)
	header
		margin-bottom: 20px
</style>