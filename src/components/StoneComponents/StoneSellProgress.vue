<template>
  <div class="col-md-12 bordered">
    <div id="progress-bar-container">
      <div id="progress-bar" :style="{ width: getProgressById(stoneId) + '%' }">
      
        <div class="item-price">{{ getStoneValueById(stoneId).toFixed(2) }}&nbsp;$</div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "StoneSellProgress",
  props: {
    stoneId: {
      type: Number,
      required: true,
    },
    progress: {
      type: Number,
      required: true,
    },
  },
  computed: {
    ...mapGetters(["getProgressById","getStoneValueById"]),
  },
};
</script>
<style>
#progress-bar-container {
  background-color: rgb(58 0 0 / 66%);
  border-radius: 7px;
  overflow: hidden;
  border: 2px solid rgb(130 174 16 / 26%);
}

#progress-bar {
  min-height: 24px;
  height: calc(4vw);
  max-height: 27px;
  background-color: #f8c928;
  transition: width 0.1s linear;
  text-align: left;
}

.item-price {
  font-size: 20px;
  color: #a57843;
}
</style>
