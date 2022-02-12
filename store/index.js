export const state = () => ({
  balance: null
})

export const mutations = {
  socket_balanceServer(ctx, data) {
    state.balance = data.balance
    console.log(state.balance);
  }
}
