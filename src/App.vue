<template>
  <Background></Background>
  <CoinsCounter></CoinsCounter>
  <section>
    <div class="d-flex row">
      <div class="store col-12">
        <template v-for="(stone, i) in stones" :key="i">
          <StoneItem :stoneId="stone.id" :stoneImg="stoneImages[i]"> </StoneItem>
        </template>
        <button @click="changeChanceType">Change percent type</button>
      </div>
      <FarmStone class="col-12"></FarmStone>
    </div>
  </section>
</template>

<script>
import { mapState, mapActions } from "vuex";
import Background from "./components/Background.vue";
import StoneItem from "./components/StoneItem.vue";
import CoinsCounter from "./components/CoinsCounter.vue";
import FarmStone from "./components/FarmStone.vue";

export default {
  name: "App",
  components: {
    Background,
    CoinsCounter,
    FarmStone,
    StoneItem,
  },
  data() {
    return {
      stoneImages: [],
    };
  },
  computed: {
    ...mapState(["stones"]),
    stonesWithImages() {
      return this.stones.filter((_, i) => this.stoneImages[i]);
    },
  },
  mounted() {
    const imagePromises = this.stones.map((stone) => {
      return import(`@/assets/images/gems/${stone.icon}.png`)
        .then((module) => module.default)
        .catch((error) => {
          console.error(`Error loading image for stone ${stone.name}:`, error);
          return null;
        });
    });

    Promise.all(imagePromises).then((images) => {
      this.stoneImages = images;
    });
    this.initializeStones();
    this.loadGame();
  },
  methods: {
    ...mapActions(["loadGame", "initializeStones","changeChanceType"]),
  },
};
</script>

<style>
.farmButton:hover {
  transform: scale(1.1);
}
.store {
  margin: 0 10px;
}

@media only screen and (max-width: 600px) {
  .store {
    height: 350px;
    overflow-y: scroll;
  }
}
</style>
