<script setup lang="ts">
import { useResize } from '@/hooks/useResize.ts'

const { screenRef } = useResize()
</script>

<template>
  <div class="screen-container">
    <div ref="screenRef" class="screen-wrapper">
      <img src="./assets/image.png" alt="" />
    </div>
  </div>
</template>

<style scoped>
.screen-container {
  overflow: hidden;
  height: 100vh;
  width: 100vw;
  background-color: #000;
  background-size: 100% 100%;
}
.screen-wrapper {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 0.5s;
  width: 1920px;
  height: 1080px;
  position: relative;
  transform-origin: 0 0;
  overflow: hidden;
}
</style>
