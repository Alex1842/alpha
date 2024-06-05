<template>
  <div :style="{ backgroundColor: randomColor }" class="card">
    {{value}}
  </div>
</template>

<script>
export default {
  name: 'CCard',
  props: {
    value: {
      type: Number,
      required: true
    }
  },
  computed: {
    randomColor() {
      var r = Math.floor(Math.random() * 256);
      var g = Math.floor(Math.random() * 256);
      var b = Math.floor(Math.random() * 256);
      return `rgb(${r},${g},${b})`;
    }
  }
}
</script>
<style></style>
