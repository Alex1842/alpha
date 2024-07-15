<template>
  <Background></Background>
  <CoinsCounter></CoinsCounter>
  <section>
    <div class="d-flex">
      <div class="store col-12">
        <template v-for="(stone, i) in stones" :key="stone.id">
          <StoneItem
            v-if="isActive(stone.id)"
            :stoneId="stone.id"
            :stoneImg="stoneImages[i]"
          >
          </StoneItem>
        </template>
        <button @click="changeChanceType">Change percent type</button>
      </div>
    </div>
  </section>
  <CaveStone :stoneImages="stoneImages"></CaveStone>
  <FarmStone v-if="1==0" class="col-12"></FarmStone>
</template>

<script>
import { mapState, mapGetters, mapActions } from "vuex";
import Background from "./components/Background.vue";
import StoneItem from "./components/StoneItem.vue";
import CoinsCounter from "./components/CoinsCounter.vue";
import FarmStone from "./components/FarmStone.vue";
import CaveStone from "./components/CaveStone.vue";

export default {
  name: "App",
  components: {
    Background,
    CoinsCounter,
    FarmStone,
    CaveStone,
    StoneItem,
  },
  data() {
    return {
      stoneImages: [],
    };
  },
  computed: {
    ...mapState(["stones"]),
    ...mapGetters(["getStoneActiveById"]),
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
    ...mapActions(["loadGame", "initializeStones", "changeChanceType"]),

    isActive(stoneId) {
      return this.getStoneActiveById(stoneId);
    },
  },
};
</script>

<style>
.store {
  margin: 0 10px;
}

.store {
  height: 450px;
  overflow-y: scroll;
}

@media only screen and (max-width: 600px) {
  .store {
    height: 350px;
    overflow-y: scroll;
  }
}
</style>
