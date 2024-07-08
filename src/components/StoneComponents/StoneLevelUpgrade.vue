<template>
  <div
    class="item-upgrade position-absolute"
    :disabled="coins < currentPrice"
    @click="upgrade"
  >
    <!-- ↑ -->
    {{ currentPrice.toFixed(2) }}&nbsp;$
  </div>
</template>

<script>
export default {
  name: "StoneLevelUpgrade",
  props: {
    id: {
      type: Number,
      required: true,
    },
    coins: {
      type: Number,
      required: true,
    },
    currentPrice: {
      type: Number,
      required: true,
    },
  },
  methods: {
    upgrade() {
      console.log(this.$store)
      this.$store.dispatch("upgradeStone", {
        stoneId: this.id,
        paymentAmount: this.currentPrice,
      });
      //this.$emit("click", { stoneId: this.id, paymentAmount: this.currentPrice });
    },
  },
};
</script>
<style>
.item-upgrade {
  font-size: 20px;
  background: bisque;
  border-radius: 3px;
  padding: 0 5px;
  cursor: pointer;
  right: -30px;
  bottom: 0;
  transform: rotate(307deg);
  z-index: 1;
}
</style>
