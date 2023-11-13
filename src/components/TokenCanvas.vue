<script setup>
import { ref, onMounted } from 'vue'
import RotaryToken from './RotaryToken.vue'

const tokens = ref([])
let id = 0
let socket = false
const canvasWidth = ref(window.innerWidth)
const canvasHeight = ref(window.innerHeight)

const addToken = (event) => {
  const { x, y } = event
  const tokenId = id + 1
  id = id + 1
  const relativeX = x / canvasWidth.value
  const relativeY = y / canvasHeight.value
  tokens.value.push({ absoluteX: x, absoluteY: y, relativeX, relativeY, rotation: 10, id: tokenId })
}

const recalculateCanvas = () => {
  canvasWidth.value = window.innerWidth
  canvasHeight.value = window.innerHeight
}

const sendUpdatedPosition = (data) => {
  if (socket) {
    console.log('data: ', data)
    socket.send(JSON.stringify(data))
  }
}

const connectToWebsocketServer = () => {
  // create connection
  const port = import.meta.env.VITE_WEBSOCKET_PORT
  const server = `ws://localhost:${port}`
  socket = new WebSocket(server)
  socket.onopen = () => {
    console.log('Websocket connection established')
  }

  socket.onerror = (error) => {
    console.log(`WebSocket error: `, error)
  }

  socket.onmessage = (e) => {
    console.log(e.data)
  }
}

onMounted(() => {
  window.addEventListener('resize', recalculateCanvas)
  connectToWebsocketServer()
})
</script>

<template>
  <div class="canvas">
    <button @click="addToken">Add token</button>
    <div v-if="tokens.length <= 0" class="fallback-message"><span>Place tokens here</span></div>
    <RotaryToken
      v-for="token in tokens"
      :key="token.id"
      :initial-position="{ x: token.relativeX, y: token.relativeY }"
      @update="sendUpdatedPosition"
    />
  </div>
</template>

<style scoped>
.canvas {
  width: 100%;
  height: 100%;
}
</style>
