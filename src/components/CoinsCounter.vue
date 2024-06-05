<template>
  <h1>coin: {{ coins }}</h1>
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
</style>
