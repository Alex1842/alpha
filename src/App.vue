<template>
  <Background></Background>
  <CoinsCounter :coins="coins"></CoinsCounter>
  <section>
    <div class="d-flex row">
      <div class="store col-12">
        <template v-for="(stone, i) in stonesWithImages" :key="i">
          <StoneItem v-if="stone.active" :ref="'stoneComponent-' + stone.id" :stone="stone" :stoneImg="stoneImages[i]"
            :chance=absolutechanceList[stone.id] :coins="coins" @upgrade="upgradeStone" @reward="getMoney" @updateProbs="convertToConditionalProbabilities">
          </StoneItem>
        </template>
      </div>
      <FarmStone class="col-12" @get="getStone"></FarmStone>
    </div>
  </section>
</template>

<script>
import { toRaw, reactive } from 'vue';
import Background from './components/Background.vue';
import StoneItem from './components/StoneItem.vue';
import CoinsCounter from './components/CoinsCounter.vue';
import FarmStone from './components/FarmStone.vue';
import content from './content/workers.json';

export default {
  name: 'App',
  components: {
    Background,
    CoinsCounter,
    FarmStone,
    StoneItem
  },
  data() {
    return {
      coins: 0,
      basicFarm: 250,
      idCounter: 0,
      stones: content.map((stone, index) => ({
        ...stone,
        id: index,
        level: 0,
        amount: 0,
        active: index === 0
      })),
      chanceList: [],
      absolutechanceList: [],
      stoneImages: []
    };
  },
  computed: {
    stonesWithImages() {
      return this.stones.filter((_, i) => this.stoneImages[i]);
    },
  },
  mounted() {
    this.generateChanceTable();
    this.convertToConditionalProbabilities();
    this.loadGame();
    const imagePromises = this.stones.map(stone => {
      return import(`@/assets/images/gems/${stone.icon}.png`)
        .then(module => module.default)
        .catch(error => {
          console.error(`Error loading image for stone ${stone.name}:`, error);
          return null;
        });
    });

    Promise.all(imagePromises).then(images => {
      this.stoneImages = images;
    });
  },
  methods: {
    generateChanceTable() {
      let chanceList = [];
      const stonesWithRef = this.stones.filter(item => {
        const stoneRef = this.$refs['stoneComponent-' + item.id];
        return stoneRef && stoneRef.length > 0;
      });
      stonesWithRef.forEach(item => {
        const stoneComponent = this.$refs['stoneComponent-' + item.id][0];
        chanceList.push(stoneComponent.currentChance);
      });
      this.chanceList = chanceList;
    },
    convertToConditionalProbabilities() {
      const conditionalChances = [];
      let prevProbability = 1.0;
      for (let i = this.chanceList.length - 1; i >= 0; i--) {
        const currentProbability = this.chanceList[i] * prevProbability;
        conditionalChances.push(currentProbability);
        prevProbability *= (1 - this.chanceList[i]);
      }
      this.absolutechanceList = conditionalChances.reverse()
    },
    upgradeStone(stoneId, paymentAmount) {
      this.coins -= paymentAmount;
      const stone = this.stones.find(w => w.id === stoneId);
      stone.level++;
    },
    getMoney(stoneId, earnAmount) {
      this.coins += earnAmount;
      const stone = this.stones.find(w => w.id === stoneId);
      stone.amount--;
      const nextInactiveStone = this.stones.find(w => !w.active);
      if (nextInactiveStone && this.coins >= nextInactiveStone.price) {
        nextInactiveStone.active = true;
      }
    },
    getStone() {
      this.coins = this.coins + this.basicFarm;
      const chances = this.chanceList;
      this.convertToConditionalProbabilities();
      console.log(this.absolutechanceList)
      for (let i = chances.length - 1; i >= 0; i--) {
        const seed = Math.random()
        if (seed < chances[i]) {
          this.stones.find(w => w.id == i).amount++;
          this.saveGame();
          return;
        }
      }
      this.stones.find(w => w.id == 0).amount++;
      this.saveGame();
    },
    saveGame() {
      const gameStatus = {
        coins: this.coins,
        stones: toRaw(this.stones)
      };
      const jsonString = JSON.stringify(gameStatus);
      document.cookie = `alpha_gameStatus=${jsonString}`;
    },
    loadGame() {
      const cookies = document.cookie.split('; ').find(row => row.startsWith('alpha_gameStatus='));
      const jsonString = cookies ? cookies.split('=')[1] : null;
      if (jsonString) {
        const gameStatus = JSON.parse(jsonString);

        this.coins = gameStatus.coins;
        this.stones = reactive(gameStatus.stones);
        console.log('Game loaded:', gameStatus);
      } else {
        console.error('No saved game found.');
      }
    }
  },

  watch: {
    stones: {
      handler: 'generateChanceTable',
      deep: true
    },
  },
}
</script>

<style>
body {
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

@font-face {
  font-family: 'HoneyCrepes';
  src: url('/src/assets/fonts/Honey_Crepes.otf') format('opentype'),
    url('/src/assets/fonts/Honey_Crepes.ttf') format('truetype');
  font-weight: normal;
  font-style: normal;
}

* {
  font-family: 'HoneyCrepes', sans-serif !important;
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
