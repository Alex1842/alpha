<template>
  <Background></Background>
  <h1>Lorem Ipsum</h1>
  <section class="game-board" :style="gridStyles">
    <Card class="card" v-for="num in nArray" :key="num" :id="num" :value="num"></Card>
  </section>
</template>

<script>
import Background from './components/Background.vue';
import Card from './components/Card.vue';

export default {
  name: 'App',
  components: {
    Background,
    Card
  },
  data() {
    return {
      n: 5 // Alapértelmezett grid méret, de dinamikusan módosítható
    };
  },
  computed: {
    nArray() {
      return Array.from({ length: this.n * this.n }, (_, i) => i);
    },
    gridStyles() {
      return {
        gridTemplateColumns: `repeat(${this.n}, 50px)`,
        gridTemplateRows: `repeat(${this.n}, 50px)`,
      };
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

.game-board {
  display: grid;
  grid-gap: 10px;
  justify-content: center;
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
}

@media (min-width: 600px) {
  .game-board {
    grid-gap: 15px;
  }

  .card {
    font-size: 2rem;
  }
}

@media (min-width: 900px) {
  .game-board {
    grid-gap: 20px;
  }

  .card {
    font-size: 2.5rem;
  }
}
</style>
