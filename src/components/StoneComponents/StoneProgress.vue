<template>
  <div class="col-md-12 bordered">
    <div id="progress-bar-container">
      <div id="progress-bar" :style="{ width: progress + '%' }">
        <div class="item-price"> {{ currentEarn.toFixed(2) }}&nbsp;$</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'StoneProgress',
  props: {
    progress: {
      type: Number,
      required: true
    },
    currentEarn: {
      type: Number,
      required: true
    }
  },
}
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
