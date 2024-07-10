<template>
  <div class="item-upgrade position-absolute" :disabled="cantPay" @click="upgrade">
    <!-- ↑ -->
    {{ this.upgradePrice.toFixed(2) }}&nbsp;$
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
export default {
  name: "StoneLevelUpgrade",
  props: {
    stoneId: {
      type: Number,
      required: true,
    },
  },
  computed: {
    ...mapGetters(["coins", "getActualUpgradePriceById"]),
    upgradePrice() {
      return this.getActualUpgradePriceById(this.stoneId);
    },
    cantPay() {
      return this.coins < this.upgradePrice;
    },
  },
  methods: {
    ...mapActions(["upgradeStone"]),
    upgrade() {
      this.upgradeStone({
        stoneId: this.stoneId,
        paymentAmount: this.upgradePrice,
      });
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
