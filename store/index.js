export const state = () => ({
  balance: null
})

export const mutations = {
  socket_test(state, data) {
    state.balance = data.balance
    console.log(state.balance);
  }
}
