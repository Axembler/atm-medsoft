import Vue from 'vue'
import VueSocketIO from 'vue-socket.io'

export default function({ store }) {
  Vue.use(
    new VueSocketIO({
      debug: false,
      connection: 'http://localhost:3001',
      vuex: {
        store,
        actionPrefix: 'socket_',
        mutationPrefix: 'socket_'
      },
      extraHeaders: {
        'Access-Control-Allow-Credentials': true
      },
      allowEIO3: true
    })
  )
}