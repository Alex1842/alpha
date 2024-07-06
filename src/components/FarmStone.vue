<template>
      <div class="button-container">
        <div class="farmButton" @click="getStone"></div>
      </div>
</template>

<script>
export default {
  name: 'FarmStone',
  props: {
    
  },
  methods: {
    getStone() {
      this.$emit('get');
    },
  },
  emits: ['get']
}
</script>

<style scoped>

.button-container {
  left: 50px;
  top: 50px;
}

.farmButton {
  background-image: url("/src/assets/images/buttons/earn.png");
  width: 70px;
  aspect-ratio: 1;
  background-size: contain;
  background-repeat: no-repeat;
  cursor: pointer;
}
</style>
