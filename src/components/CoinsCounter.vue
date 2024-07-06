<template>
  <h1> {{ coins.toFixed(2) }} $</h1>
</template>

<script>
export default {
  name: 'CoinsCounter',
  props: {
    coins: {
      type: Number,
      required: true
    }
  }
}
</script>

<style scoped>

h1{
  position: absolute;
    bottom: 0;
    background: grey;
    color: white;
    width: 100%;
    padding: 15px;
}
</style>
