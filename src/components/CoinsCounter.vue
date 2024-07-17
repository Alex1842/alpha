<template>
  <button @click="changeChanceType">Change percent type</button>
  <h1>{{ getcoins }} $</h1>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
export default {
  name: "CoinsCounter",
  computed: {
    ...mapGetters(["coins"]),
    getcoins() {
      return this.coins.toFixed(2);
    },
  },
  methods: {
    ...mapActions(["changeChanceType"]),
  },
};
</script>

<style scoped>
h1 {
  position: fixed;
  text-align: center;
  bottom: 0;
  background: grey;
  color: white;
  width: 100%;
  padding: 15px;
  margin: 0;
}
button {
  position: fixed;
  bottom: 80px;
  left: 10px;
}
</style>
