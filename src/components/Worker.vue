<template>
  <div>
    <div class="item" @click="startProgress" :disabled="coins < worker.price || isProgressing">
      <div class="item-icon">
        <img :src="workerImg" alt="Dynamic Image" />
      </div>
      <div class="item-info">
        <div class="item-name">{{ worker.name }}</div>
        <div class="item-price">{{ worker.price }}</div>
        <div class="item-amount">{{ worker.amount }}</div>
      </div>
    </div>
    <div id="progress-bar-container">
      <div id="progress-bar" :style="{ width: progress + '%' }"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'VWorker',
  props: {
    worker: {
      type: Object,
      required: true
    },
    workerImg: {
      type: String,
      required: true
    },
    coins: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      progress: 0,
      isProgressing: false,
      intervalId: null
    };
  },
  methods: {
    payWorker() {
      if (this.coins >= this.worker.price) {
        this.$emit('pay', this.worker.id, this.worker.price);
      }
    },
    rewardWorker() {
      this.$emit('reward', this.worker.id, this.worker.earn);
    },
    startProgress() {
      if (this.coins < this.worker.price || this.isProgressing) return;
      this.payWorker();
      this.progress = 0;
      this.isProgressing = true;

      const intervalDuration = 100;
      const progressIncrement = 100 / (this.worker.speed * 1000 / intervalDuration);

      this.intervalId = setInterval(() => {
        this.progress += progressIncrement;

        if (this.progress >= 100) {
          this.progress = 100;
          clearInterval(this.intervalId);
          this.rewardWorker();
          setTimeout(() => {
            this.progress = 0;
            this.isProgressing = false;
          }, 500);
        }
      }, intervalDuration);
    }
  },
  emits: ['pay', 'reward']
};
</script>

<style scoped>
.item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
  border-bottom: 1px solid #c1a772;
  cursor: pointer;
}

.item[disabled=true] {
  opacity: 0.2;
}

.item:last-child {
  border-bottom: none;
}

.item-icon {
  width: 40px;
  height: 40px;
  margin-right: 10px;
}

.item-icon img {
  max-height: 40px;
}

.item-info {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.item-name {
  font-size: 18px;
  font-weight: bold;
}

.item-price {
  font-size: 16px;
  color: #a57843;
}

.item-amount {
  font-size: 16px;
  color: #666;
}

#progress-bar-container {
  width: 100%;
  background-color: #e0e0e0;
  border-radius: 25px;
  overflow: hidden;
  margin-top: 10px;
}

#progress-bar {
  height: 10px;
  background-color: #76c7c0;
  transition: width 0.1s linear;
  border-radius: 25px 0 0 25px;
}
</style>
