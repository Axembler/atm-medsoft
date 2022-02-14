<template>
	<div class="modal-overlay" @click="$emit('close-modal')">
		<div class="modal" @click.stop>
			<span class="head">Notice</span>
			<p class="message">{{ message }}</p>
			<svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" class="close" @click="$emit('close-modal')">
				<path d="M2.22566 0.81096C1.83514 0.420435 1.20197 0.420435 0.811448 0.81096C0.420924 1.20148 0.420924 1.83465 0.811448 2.22517L6.58618 7.99991L0.811508 13.7746C0.420984 14.1651 0.420983 14.7983 0.811508 15.1888C1.20203 15.5793 1.8352 15.5793 2.22572 15.1888L8.0004 9.41412L13.7751 15.1888C14.1656 15.5793 14.7988 15.5793 15.1893 15.1888C15.5798 14.7983 15.5798 14.1651 15.1893 13.7746L9.41461 7.99991L15.1893 2.22517C15.5799 1.83465 15.5799 1.20148 15.1893 0.81096C14.7988 0.420435 14.1657 0.420435 13.7751 0.81096L8.0004 6.58569L2.22566 0.81096Z"/>
			</svg>
		</div>
	</div>
</template>

<script>
export default {
	data() {
		return {
			message: ''
		}
	},
	sockets: {
		modal: function(data) {
			this.message = data.message

			this.showModal = true
		}
	}
}
</script>

<style lang="sass" scoped>
.modal-overlay
	display: flex
	justify-content: center
	align-items: center
	position: fixed
	top: 0
	right: 0
	left: 0
	bottom: 0
.modal
	display: flex
	position: relative
	justify-content: center
	align-items: center
	padding: 40px
	height: 250px
	width: 400px
	background: #262626
	border: 1px solid rgba(255, 255, 255, .1)
	box-shadow: 5px 5px 5px rgba(0, 0, 0, .2)
.message
	width: 100%
	font-size: 18px
	color: $successfully
.head
	display: flex
	position: absolute
	top: 20px
	left: 20px
	font-size: 16px
.close
	display: flex
	position: absolute
	top: 20px
	right: 20px
	height: 20px
	width: 20px
	cursor: pointer
	fill: rgba(255, 255, 255, .2)
	&:hover
		fill: rgba(255, 255, 255, .5)
	&:active
		fill: rgba(255, 255, 255, .6)
</style>