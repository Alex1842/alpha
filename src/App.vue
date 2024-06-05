<template>
  <Background></Background>
  <section>
    <CoinsCounter :coins="coins"></CoinsCounter>
    <p>
      <button @click="coins++">💰</button>
    </p>
    <Worker v-for="worker in workers" :key="worker.id" :worker="worker" :coins="coins" @pay="payWorker"></Worker>
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
      workers: content.map(worker => ({ ...worker, amount: 0 }))
    };
  },
  mounted: function () {
    setInterval(() => {
      this.coins += 1 * this.workers[0].amount * 1
      this.coins += 1 * this.workers[1].amount * 3
      this.coins += 1 * this.workers[2].amount * 5
    }, 420)
  },
  methods: {
    payWorker(workerIndex, paymentAmount) {
      if (this.coins >= paymentAmount) {
        this.coins -= paymentAmount;
        this.workers[workerIndex].amount++;
      }
    }
  }
}
</script>

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
  margin-top: 60px;
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
</style>
