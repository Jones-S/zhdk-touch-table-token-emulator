<script setup>
import { ref, onMounted } from 'vue'
import RotaryToken from './RotaryToken.vue'

const tokens = ref([])
let id = 0
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

onMounted(() => {
  window.addEventListener('resize', recalculateCanvas)
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
    />
  </div>
</template>

<style scoped>
.canvas {
  width: 100%;
  height: 100%;
}
</style>
