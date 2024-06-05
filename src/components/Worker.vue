<template>
  <div>
    <span>
      {{ worker.name }}: <strong> {{ worker.amount }}</strong>
    </span>
    <button class="buyButton" @click="payWorker" :disabled="coins < worker.price"> 💲</button>
  </div>
</template>

<script>
export default {
  name: 'CWorker',
  props: {
    worker: {
      type: Object,
      required: true
    },
    coins: {
      type: Number,
      required: true
    }
  },
  emits: ['pay'],
  methods: {
    payWorker() {
      if (this.coins >= this.worker.price) {
        this.$emit('pay', this.worker.id, this.worker.price);
      }
    }
  }
}
</script>

<style>
.buyButton{
  margin-left: 20px;
}
</style>
