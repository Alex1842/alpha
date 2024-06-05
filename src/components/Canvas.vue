<template>
  <div>
    <canvas ref="canvas" :width="canvasWidth" :height="canvasHeight"></canvas>
  </div>
</template>

<script>
export default {
  name: 'CCanvas',
  data() {
    return {
      canvasWidth: window.innerWidth,
      canvasHeight: "200px"
    };
  },
  mounted() {
    this.drawSquare();
  },
  methods: {
    drawSquare() {
      const canvas = this.$refs.canvas;
      const ctx = canvas.getContext('2d');

      ctx.fillStyle = this.randomColor();
      ctx.fillRect(50, 50, 100, 100);
    },
    randomColor() {
      var r = Math.floor(Math.random() * 256);
      var g = Math.floor(Math.random() * 256);
      var b = Math.floor(Math.random() * 256);
      return `rgb(${r},${g},${b})`;
    }
  },
};
</script>

<style></style>
