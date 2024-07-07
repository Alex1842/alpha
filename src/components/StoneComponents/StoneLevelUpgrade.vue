<template>
  <div class="item-upgrade position-absolute" v-if="id > 0"
    :disabled="coins < currentPrice"> 
    ↑
    {{ currentPrice.toFixed(2) }}&nbsp;$
    </div>
</template>

<script>
export default {
  name: 'StoneLevelUpgrade',
  props: {
    id: {
      type: Number,
      required: true
    },
    coins: {
      type: Number,
      required: true
    },
    currentPrice: {
      type: Number,
      required: true
    }
  },
}
</script>
<style>

.item-upgrade {
  font-size: 20px;
  background: bisque;
  border-radius: 3px;
  position: absolute;
  cursor: pointer;
  right: -60px;
  bottom: 0;
  transform: rotate(343deg);
  z-index: 1;

}
</style>
