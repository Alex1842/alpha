<template>
  <div class="item-icon position-relative">
    <img class="floating-element" :src="img" alt="Dynamic Image" />
    <div class="item-amount position-absolute">{{ amount }}</div>
  </div>
</template>

<script>
export default {
  name: 'StoneImage',
  props: {
    img: {
      type: String,
      required: true
    },
    amount: {
      type: Number,
      required: true
    },
  },
}
</script>
<style>
.item-icon[disabled=false] {
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
