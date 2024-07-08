<template>
  <div class="item-icon position-relative" @click="sell">
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
    ...mapGetters(["getStoneAmountById"]),
    stoneAmount() {
      return this.getStoneAmountById(this.stoneId);
    },
  },
  methods: {
    ...mapActions(["sellStone"]),
    sell() {
      this.sellStone(this.stoneId);
    },
  },
};
</script>
<style>
.item-icon[disabled="false"] {
  cursor: pointer;
}
.item-icon img {
  border: 3px solid #692222;
  outline: 1px solid #fdd627;
  outline-offset: -5px;
  height: calc(10vw);
  max-height: 80px;
  min-height: 60px;
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
