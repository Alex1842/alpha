<template>
  <h1>{{ getcoins }} $</h1>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "CoinsCounter",
  computed: {
    ...mapGetters(["coins"]),
    getcoins() {
      return this.coins.toFixed(2);
    },
  },
};
</script>

<style scoped>
h1 {
  position: fixed;
  bottom: 0;
  background: grey;
  color: white;
  width: 100%;
  padding: 15px;
  margin: 0;
}
</style>
