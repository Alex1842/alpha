<template>
  <div class="button-container d-flex justify-content-center align-items-center">
    <div class="farmButton" @click="earnStone"></div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
export default {
  name: "FarmStone",
  methods: {
    ...mapActions(["farmStone"]),
    earnStone() {
      this.farmStone();
    },
  },
};
</script>

<style scoped>
.button-container {
  height: 20vh;
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
