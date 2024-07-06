<template>
  <Background></Background>
  <CoinsCounter :coins="coins"></CoinsCounter>
  <section>
    <div class="d-flex">
      <div class="store">
        <div class="store-item" v-for="(stone, i) in stonesWithImages" :key="i">
          <StoneItem v-if="stone.active" :stone="stone" :stoneImg="stoneImages[i]" :coins="coins"
            @upgrade="upgradeStone" @reward="getMoney">
          </StoneItem>
        </div>
      </div>
      <FarmStone @get="getStone"></FarmStone>
      <div class="button-container">
        <div class="farmButton" @click="saveGame"></div>
      </div>
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
      stoneImages: []
    };
  },
  computed: {
    stonesWithImages() {
      return this.stones.filter((_, i) => this.stoneImages[i]);
    }
  },
  mounted() {
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
      
      this.stones.find(w => w.id == 0).amount++;

      this.coins = this.coins + this.basicFarm;
      window.stones = this.stones
      this.saveGame();
    },
    saveGame() {
      const gameStatus = {
        coins: this.coins,
        stones: toRaw(this.stones)
      };
      const jsonString = JSON.stringify(gameStatus);
      document.cookie = `alpha_gameStatus=${jsonString}`;
      //console.log('Game saved:', jsonString);
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
  }
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
  margin-left: 20px;
}
</style>

<style>
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
