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
  background: grey;
    color: white;
}
</style>
