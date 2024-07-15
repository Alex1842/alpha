<template>
  <div
    class="item-icon position-relative"
    @click="sell(stoneId)"
    :disabled="stoneAmount < 1 || processing"
  >
    <img class="floating-element" :src="img" alt="Dynamic Image" />
    <div class="item-amount position-absolute">{{ stoneAmount }}</div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
export default {
  name: "StoneImage",
  props: {
    stoneId: {
      type: Number,
      required: true,
    },
    img: {
      type: String,
      required: true,
    },
  },
  computed: {
    ...mapGetters(["getStoneAmountById", "getProgressingById"]),
    stoneAmount() {
      return this.getStoneAmountById(this.stoneId);
    },
    processing() {
      return this.getProgressingById(this.stoneId);
    },
  },
  methods: {
    ...mapActions({ sell: "sellStone" }),
  },
};
</script>
<style>
div[disabled="false"] .floating-element {
  border-radius: 10px;
  animation: float 2s ease-in-out infinite;
  border-radius: 10px;
  animation: float 2s ease-in-out infinite;
}
@keyframes float {
  50% {
    transform: scale(1.05);
  }
}
.item-icon[disabled="false"] {
  cursor: pointer;
}
.item-icon img {
  border: 3px solid #692222;
  outline: 1px solid #fdd627;
  outline-offset: -5px;
  height: 60px;
}

.item-amount {
  font-size: 14px;
  background: brown;
  color: yellow;
  border-radius: 50%;
  height: 20px;
  aspect-ratio: 1;
  padding: 3px;
  font-weight: 500;
  right: -3px;
  bottom: -3px;
}
</style>
