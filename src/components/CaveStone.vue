<template>
  <div :key="componentKey" id="caveStone_container" @click="earnStone">
    <img id="caveStone_img" :src="stoneImages[this.stoneId]" />
    <div id="caveStone_img-overlay" :style="backgroundImg"></div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
export default {
  name: "CaveStone",
  props: {
    stoneImages: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      stoneId: 0,
      componentKey: Date.now(),  // Ezt a kulcsot használjuk az újrarendereléshez
    };
  },
  methods: {
    ...mapActions(["farmStone"]),
    earnStone() {
      this.farmStone(this.stoneId);
      this.regenerateComponent();  // Újragenerálja a komponenst
    },

    regenerateComponent() {
      this.componentKey = Date.now();  // Növeli a kulcs értékét
      console.log("sun", this.stoneId);
      this.stoneId = this.getRandomStone;  // Új kő ID-t generál
    },
  },
  computed: {
    ...mapGetters(["getRandomStone"]),
    backgroundImg() {
      return {
        backgroundImage: `url(${this.stoneImages[this.stoneId]})`,
      };
    },
  },
  
  beforeCreate() {
    this.stoneId = this.getRandomStone;
  },
};
</script>

<style scoped>
#caveStone_container {
  position: fixed;
  left: 50%;
  bottom: 162px;
  transform: translateX(-50%);
  height: 77px;
  aspect-ratio: 1;
  cursor: pointer;
  opacity: 0.8;
}

#caveStone_img {
  width: 100%;
  border-radius: 5px;
  height: auto;
  filter: brightness(1) blur(3px);
}

#caveStone_img-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 20px;

  background-size: cover;
  clip-path: inset(5px);
}
</style>
