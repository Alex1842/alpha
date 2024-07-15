<template>
  <div id="farmButton_container" class="button-container d-flex justify-content-end">
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
  bottom: 80px;
  right:50px;
}

.farmButton {
  cursor: pointer;
  width: clamp(130px, 15vw, 160px);
  aspect-ratio: 1;
  border-radius: 50%;
  background-image: url("/src/assets/images/buttons/earn.png");
  background-size: contain;
  background-repeat: no-repeat;
  box-shadow: 0px 1px 20px 20px rgb(254 235 76 / 11%);
  animation: glowing 2s infinite ease-in-out;
  transition: transform 0.05s;
}

@keyframes glowing {
  50% {
    box-shadow: 0px 1px 20px 20px rgb(254 235 76 / 50%);
  }
}
.farmButton:hover {
  transform: scale(1.1);
}
.farmButton:active {
  transform: scale(1.1) translateY(2px);
}
</style>
