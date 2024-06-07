<template>
  <Background></Background>
  <section>
    <CoinsCounter :coins="coins"></CoinsCounter>
    <div class="d-flex">
      <div class="store">
        <div class="store-item" v-for="(worker, i) in workersWithImages" :key="i">
          <Worker v-if="worker.active" :worker="worker" :workerImg="workerImages[i]" :coins="coins" @upgrade="upgradeWorker"
            @reward="rewardWorker">
          </Worker>
        </div>
      </div>
      <!-- <div class="button-container">
        <div class="farmButton" @click="coins = coins + this.basicFarm"></div>
      </div> -->
    </div>
  </section>
</template>

<script>
import Background from './components/Background.vue';
import Worker from './components/Worker.vue';
import CoinsCounter from './components/CoinsCounter.vue';
import content from './content/workers.json';

export default {
  name: 'App',
  components: {
    Background,
    CoinsCounter,
    Worker
  },
  data() {
    return {
      coins: 0,
      basicFarm: 0.25,
      idCounter: 0,
      workers: content.map((worker, index) => ({
        ...worker,
        id: index,
        amount: 0,
        active: index === 0
      })),
      workerImages: []
    };
  },
  computed: {
    workersWithImages() {
      return this.workers.filter((_, i) => this.workerImages[i]);
    }
  },
  mounted() {
    const imagePromises = this.workers.map(worker => {
      return import(`@/assets/images/gems/${worker.icon}.png`)
        .then(module => module.default)
        .catch(error => {
          console.error(`Error loading image for worker ${worker.name}:`, error);
          return null;
        });
    });

    Promise.all(imagePromises).then(images => {
      this.workerImages = images;
    });
  },
  methods: {
    upgradeWorker(workerId, paymentAmount) {
      this.coins -= paymentAmount;
      const worker = this.workers.find(w => w.id === workerId);
      worker.amount++;
    },
    rewardWorker(workerId, earnAmount) {
      this.coins += earnAmount;
      const nextInactiveWorker = this.workers.find(w => !w.active);
      if (nextInactiveWorker && this.coins >= nextInactiveWorker.price) {
        nextInactiveWorker.active = true;
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
*{
  font-family: 'HoneyCrepes', sans-serif !important;
}
.button-container {
  position: absolute;
  left: 50px;
  top: 50px;
}

.farmButton {
  background-image: url("/src/assets/images/buttons/earn.png");
  width: 100px;
  aspect-ratio: 1;
  background-size: contain;
  background-repeat: no-repeat;
  cursor: pointer;
}

.farmButton:hover {
  transform: scale(1.1);
}
</style>

<style scoped>
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
