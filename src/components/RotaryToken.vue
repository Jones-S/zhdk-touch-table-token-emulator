<script setup>
import { ref } from 'vue'
import Vue3DraggableResizable from 'vue3-draggable-resizable'

const emit = defineEmits(['update'])

defineProps({
  initialPosition: {
    type: Object,
    default: () => {},
    required: false
  }
})

const token = ref(null)
const x = ref()
const y = ref()

const print = (val) => {
  console.log(val)
}

const update = () => {
  const relativeX = x.value / window.innerWidth
  const relativeY = y.value / window.innerHeight
  emit('update', { x: x.value, y: y.value, relativeX, relativeY })
}

const size = 50
const cssSize = `${size}px`
</script>

<template>
  <Vue3DraggableResizable
    :initW="size"
    :initH="size"
    v-model:x="x"
    v-model:y="y"
    v-model:w="w"
    v-model:h="h"
    v-model:active="active"
    :draggable="true"
    :resizable="false"
    @activated="print('activated')"
    @deactivated="print('deactivated')"
    @drag-start="print('drag-start')"
    @resize-start="print('resize-start')"
    @dragging="print('dragging')"
    @resizing="print('resizing')"
    @drag-end="update()"
    @resize-end="print('resize-end')"
  >
    <svg
      ref="token"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 245.6 245.6"
      draggable="true"
      @dragstart.stop="startDrag"
      @dragenter="startDrag"
      @dragenter.stop.prevent="dragEnterMethod"
      @dragover.stop.prevent
      @dragleave.stop.prevent="onDrop"
    >
      <!-- @drop.prevent.stop="droppedMethod" -->
      <circle class="cls-3" cx="122.8" cy="122.8" r="122.8" />
      <circle class="cls-2" cx="122.8" cy="122.8" r="119" />
      <circle cx="122.8" cy="120.46" r="65.96" />
      <circle class="cls-1" cx="122.8" cy="120.46" r="55.74" />
      <polygon points="111.64 60.83 122.8 33.89 133.96 60.83 111.64 60.83" />
    </svg>
  </Vue3DraggableResizable>
</template>

<style scoped>
svg {
  width: v-bind(cssSize);
  position: absolute;
}

svg:hover {
  cursor: grab;
}
.canvas {
  width: 100%;
  height: 100%;
}

.cls-1 {
  fill: #e8eadf;
}
.cls-2 {
  fill: #666;
}
.cls-3 {
  fill: #bfbfbf;
}

.vdr-container.active {
  border: 0;
}
.vdr-container.active .cls-2 {
  fill: rgb(126, 208, 126);
}
</style>
