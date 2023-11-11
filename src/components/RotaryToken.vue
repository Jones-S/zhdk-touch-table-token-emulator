<script setup>
import { ref, onMounted } from 'vue'
import Vue3DraggableResizable from 'vue3-draggable-resizable'

defineProps({
  initialPosition: {
    type: Object,
    default: () => {},
    required: false
  }
})

const token = ref(null)

const startDrag = (evt, item) => {
  console.log('item: ', item)
  evt.dataTransfer.dropEffect = 'move'
  evt.dataTransfer.effectAllowed = 'move'
  evt.dataTransfer.setData('itemID', item.id)
}

const dragEnterMethod = (evt, item) => {
  console.log('item: ', item)
  console.log('evt: ', evt)
}

const onDrop = (evt, list) => {
  const itemID = evt.dataTransfer.getData('itemID')
  const item = this.items.find((item) => item.id == itemID)
  item.list = list
}

const print = (val) => {
  console.log(val)
}

onMounted(() => {
  console.log('token.value: ', token.value)
  token.value.addEventListener('dragstart', startDrag)
})

const size = 4
const cssSize = `${size}rem`
</script>

<template>
  <Vue3DraggableResizable
    :initW="110"
    :initH="120"
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
    @drag-end="print('drag-end')"
    @resize-end="print('resize-end')"
  >
    <svg
      ref="token"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 245.6 245.6"
      :style="`top: calc(${initialPosition.y * 100}% - ${size / 2}rem); left: calc(${
        initialPosition.x * 100
      }% - ${size / 2}rem);`"
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
</style>
