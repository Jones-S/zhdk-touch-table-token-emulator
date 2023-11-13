<script setup>
import { ref, getCurrentInstance, onMounted, onUnmounted } from 'vue'
import Vue3DraggableResizable from 'vue3-draggable-resizable'

const emit = defineEmits(['update'])

defineProps({
  initialPosition: {
    type: Object,
    default: () => {},
    required: false
  }
})

const instance = getCurrentInstance()
const uuid = ref(instance.uid)
const x = ref()
const y = ref()
const active = ref()
const relativeX = ref(0)
const relativeY = ref(0)
const rotation = ref(0)

const print = (val) => {
  console.log(val)
}

const rotate = (e) => {
  // only rotate active element
  if (active.value) {
    rotation.value = rotation.value + e.wheelDelta
    if (rotation.value > 360) {
      rotation.value = rotation.value - 360
    } else if (rotation.value < 0) {
      rotation.value = rotation.value + 360
    }
  }
}

const update = () => {
  relativeX.value = x.value / window.innerWidth
  relativeY.value = y.value / window.innerHeight
  emit('update', {
    x: x.value,
    y: y.value,
    relativeX: relativeX.value,
    relativeY: relativeY.value,
    id: uuid.value
  })
}

const size = 50
const cssSize = `${size}px`

onMounted(() => {
  window.addEventListener('wheel', rotate)
})

onUnmounted(() => {
  window.removeEventListener('wheel', rotate)
})
</script>

<template>
  <Vue3DraggableResizable
    :initW="size"
    :initH="size"
    v-model:x="x"
    v-model:y="y"
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
      <g class="rotating" :style="`transform: rotate(${rotation}deg);`">
        <circle class="cls-1" cx="122.8" cy="120.46" r="55.74" />
        <polygon points="111.64 60.83 122.8 33.89 133.96 60.83 111.64 60.83" />
      </g>
    </svg>
    <div class="meta">
      <table>
        <tr>
          <td>ID:</td>
          <td>{{ uuid }}</td>
        </tr>
        <tr>
          <td>Position:</td>
          <td>[{{ relativeX }}, {{ relativeY }}]</td>
        </tr>
        <tr>
          <td>Rotation:</td>
          <td>{{ rotation }}</td>
        </tr>
      </table>
    </div>
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

td {
  vertical-align: top;
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

.rotating {
  transform-origin: 50% 50%;
}

.meta {
  font-family: monospace;
  font-size: 8px;
  transform: translate(v-bind(cssSize), v-bind(cssSize));
  width: 200px;
}

.vdr-container.active {
  border: 0;
}
.vdr-container.active .cls-2 {
  fill: rgb(126, 208, 126);
}
</style>
