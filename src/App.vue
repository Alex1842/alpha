<template>
  <Background></Background>
  <section>
    <CoinsCounter :coins="coins"></CoinsCounter>
    <div class="d-flex">
      <div class="store">
        <Worker
          v-for="(worker, i) in workersWithImages"
          :key="i"
          :worker="worker"
          :workerImg="workerImages[i]"
          :coins="coins"
          @pay="payWorker"
          @reward="rewardWorker"
        ></Worker>
      </div>
      <div class="button-container">
        <div class="farmButton" @click="coins++"></div>
      </div>
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
  data: function () {
    return {
      coins: 0,
      idCounter: 0,
      workers: content.map((worker, index) => ({
        ...worker,
        id: index
      })),
      workerImages: [],
    };
  },
  computed: {
    workersWithImages() {
      return this.workers.filter((_, i) => this.workerImages[i]);
    }
  },
  mounted: function () {
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
    payWorker(workerId, paymentAmount) {
      if (this.coins >= paymentAmount) {
        this.coins -= paymentAmount;
        const worker = this.workers.find(w => w.id === workerId);
        worker.amount++;
      }
    },
    rewardWorker(workerId, earnAmount) {
      this.coins += earnAmount;
    }
  }
}
</script>

<style>
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
  width: 300px;
  background-color: #d1b68c;
  border: 2px solid #6a4b28;
  border-radius: 8px;
  margin-left: 20px;
  padding: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  max-height: 500px;
  overflow-y: scroll;
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
