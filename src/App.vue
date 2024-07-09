<template>
  <Background></Background>
  <CoinsCounter></CoinsCounter>
  <section>
    <div class="d-flex row">
      <div class="store col-12">
        <template v-for="(stone, i) in stones" :key="i">
          <StoneItem
            :stoneId="stone.id"
            :stoneImg="stoneImages[i]"
          >
          </StoneItem>
        </template>
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
import content from "./content/workers.json";

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
      coins: 0,
      basicFarm: 250,
      idCounter: 0,
      stones2: content.map((stone, index) => ({
        ...stone,
        id: index,
        level: 0,
        amount: 0,
        active: index === 0,
      })),
      chanceList: [],
      absolutechanceList: [],
      stoneImages: [],
    };
  },
  computed: {
    ...mapState(["coins", "stones"]),
    stonesWithImages() {
      return this.stones.filter((_, i) => this.stoneImages[i]);
    },
  },
  mounted() {
    console.log(this.stones)
    this.initializeStones();
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
      this.$nextTick(() => {
        this.initializeStones();
        this.loadGame();
      });
    });
  },
  methods: {
    ...mapActions([
      "loadGame",
      "saveGame",
      "initializeStones",
      "upgradeStone",
      "getMoney",
      "farmStone",
      "stones",
    ]),
  },
  watch: {
    stones: {
      handler: "generateChanceTable",
      deep: true,
    },
  },
};
</script>

<style>
body {
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

@font-face {
  font-family: "HoneyCrepes";
  src: url("/src/assets/fonts/Honey_Crepes.otf") format("opentype"),
    url("/src/assets/fonts/Honey_Crepes.ttf") format("truetype");
  font-weight: normal;
  font-style: normal;
}

* {
  font-family: "HoneyCrepes", sans-serif !important;
}

.farmButton:hover {
  transform: scale(1.1);
}
</style>

<style>
* {
  position: relative;
}
</style>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 10px;
}

.card {
  border: 2px solid #3498db;
  border-radius: 8px;
  background-color: #ecf0f1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  transition: transform 0.3s, box-shadow 0.3s;
  cursor: pointer;
}

.card:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
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

::-webkit-scrollbar {
  width: 12px;
}

::-webkit-scrollbar-track {
  background: #f7f5f2;
  border-radius: 10px;
  box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
}

::-webkit-scrollbar-thumb {
  background-color: #d9d4cf;
  border-radius: 10px;
  border: 3px solid #f7f5f2;
}

::-webkit-scrollbar-thumb:hover {
  background-color: #b8b1a9;
}
</style>
