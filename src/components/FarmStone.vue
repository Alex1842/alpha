<template>
  <div id="farmButton_container" class="button-container d-flex justify-content-center align-items-center">
    <div class="farmButton" @click="earnStone"></div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
export default {
  name: "FarmStone",
  methods: {
    ...mapActions(["farmStone"]),
    earnStone() {
      const sun = this.getRandomStone;
      this.farmStone(sun);
    },
  },
  computed: {
    ...mapGetters(["getRandomStone"])
  }
};
</script>

<style scoped>
#farmButton_container {
  position: absolute;
  bottom: 90px;
}

.farmButton {
  background-image: url("/src/assets/images/buttons/earn.png");
  width: 30%;
  min-width: 150px;
  max-width: 190px;
  aspect-ratio: 1;
  background-size: contain;
  background-repeat: no-repeat;
  cursor: pointer;
}
</style>
