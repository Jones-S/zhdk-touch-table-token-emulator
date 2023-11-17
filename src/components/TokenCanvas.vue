<script setup>
import { ref, onMounted, toRaw, computed } from 'vue'
import RotaryToken from './RotaryToken.vue'
import InfoBox from './InfoBox.vue'

const tokens = ref([])
let socket = false
const canvasWidth = ref(window.innerWidth)
const canvasHeight = ref(window.innerHeight)
const showMeta = ref(true)
const useFixedIDs = ref(false)
const addingToken = ref(false)
const wsConnected = ref(false)
const tokenId = ref(1)

const saveToken = () => {
  addingToken.value = true
}

const addToken = () => {
  addingToken.value = false
  const id = useFixedIDs.value ? tokenId.value : new Date().valueOf()

  tokens.value.push({ id })

  if (socket) {
    socket.send(
      JSON.stringify({
        type: '/tracker/add',
        args: {
          id,
          x: 0,
          y: 0,
          relativeX: 0,
          relativeY: 0,
          rotation: 0
        }
      })
    )
  }

  // try to increase the token number
  const parsedInput = parseInt(tokenId.value, 10)
  if (!isNaN(parsedInput)) {
    tokenId.value = parsedInput + 1
  }
}

const metaButtonText = computed(() => {
  return 'Meta Information'
})

const fixedIDButtonText = computed(() => {
  return 'Fixed IDs'
})

const changeIDHandling = () => {
  removeAll()
  useFixedIDs.value = !useFixedIDs.value
}

const removeToken = (id) => {
  console.log('id: ', id)
  tokens.value = tokens.value.filter((token) => {
    console.log('toRaw(token): ', toRaw(token))
    return token.id !== id
  })
  console.log('tokens.value: ', tokens.value)
}

const removeAll = () => {
  tokens.value = []
}

const recalculateCanvas = () => {
  canvasWidth.value = window.innerWidth
  canvasHeight.value = window.innerHeight
}

const sendUpdatedPosition = (data) => {
  if (socket) {
    console.log('udpated position data: ', data)

    socket.send(
      JSON.stringify({
        type: '/tracker/update',
        args: {
          ...data
        }
      })
    )
  }
}

const connectToWebsocketServer = () => {
  // create connection
  const port = import.meta.env.VITE_WEBSOCKET_PORT
  const server = `ws://localhost:${port}`
  socket = new WebSocket(server)
  socket.onopen = () => {
    console.log('Websocket connection established')
    wsConnected.value = true
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
    <!-- Show input field only when adding a component -->
    <div class="overlay" v-if="addingToken">
      <div class="input-field">
        <label class="input-field-item" for="tokenId">Enter Token ID:</label>
        <input class="input-field-item" v-model="tokenId" type="text" id="tokenId" />
        <button class="input-field-item" @click="addToken">Save</button>
      </div>
    </div>

    <div class="controls">
      <button :class="[{ 'is-active': showMeta }]" @click="showMeta = !showMeta">
        {{ metaButtonText }}
      </button>
      <button :class="['button-mb', { 'is-active': useFixedIDs }]" @click="changeIDHandling">
        {{ fixedIDButtonText }}
      </button>
      <button @click="useFixedIDs ? saveToken() : addToken()">Add token</button>
      <button :disabled="!tokens.length" @click="removeAll">Clear tokens</button>
    </div>
    <div v-if="tokens.length <= 0" class="fallback-message">Place tokens here</div>
    <RotaryToken
      v-for="token in tokens"
      :key="token.id"
      @update="sendUpdatedPosition"
      @destroy="removeToken"
      :id="token.id"
      :show-meta="showMeta"
    />
    <InfoBox v-if="showMeta" :connected="wsConnected" />
  </div>
</template>

<style scoped>
.controls {
  display: inline-flex;
  flex-direction: column;
}

button {
  font-family: jetbrains-medium;
  text-align: left;
  background: var(--vt-c-divider-dark-2);
  border: 1px solid var(--vt-c-white-soft);
  border: 0;
  border-radius: 1px;
  color: var(--color-text);
  padding: 0.3em 0.7em;
  margin-bottom: 0.6em;
  box-shadow: 0 0 2px var(--vt-c-white-soft);
  transition: all 0.3s;
  font-size: 13px;
}

button.is-active {
  background-color: #b2c5bf;
  color: var(--vt-c-black-soft);
}

.button-mb {
  margin-bottom: 1.9em;
}

button:hover {
  cursor: pointer;
  background-color: var(--color-highlight);
  color: var(--vt-c-black-soft);
}

button:disabled {
  cursor: auto;
  opacity: 0.5;
  pointer-events: none;
}

.canvas {
  width: 100%;
  height: 100%;
}

.controls {
  padding: 15px;
}

.overlay {
  background-color: rgba(0, 0, 0, 0.8);
  z-index: 100;
  width: 100%;
  height: 100%;
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
}

.input-field {
  display: flex;
  flex-direction: column;
  align-items: left;
}

.input-field-item {
  margin-bottom: 1em;
}

label.input-field-item {
  margin-bottom: 0.6em;
}

button.input-field-item {
  text-align: center;
}

.fallback-message {
  height: 100%;
  width: 100%;
  position: fixed;
  top: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  pointer-events: none;
}
</style>
