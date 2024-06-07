<template>
  <div>
    <div class="container d-flex flex-column item">
      <div class="row flex-grow-1">
        <div class="col-md-3">
          <!-- <div class="item-icon" @click="startProgress" :disabled="coins < currentPrice || isProgressing"> -->
          <div class="item-icon" @click="getGem" :disabled="isProgressing">
            <img class="floating-element" :src="workerImg" alt="Dynamic Image" />
          </div>
        </div>
        <div class="col-md-9 d-flex flex-column">
          <div class="row flex-grow-1">
            <div class="col-md-8 bordered">
              <div class="item-info">
                <div class="item-name">{{ worker.name }}</div>
              </div>
            </div>
            <div class="col-md-4 bordered">
              <div class="item-upgrade" v-if="worker.id > 0" @click="upgradeWorker" :disabled="coins < currentPrice" > ↑ {{ currentPrice.toFixed(2) }} $</div>
              <div class="item-amount"><!-- {{ worker.amount }} --></div>
            </div>
          </div>
          <div class="row flex-grow-1">
            <div class="col-md-12 bordered">
              <div id="progress-bar-container">
                <div id="progress-bar" :style="{ width: progress + '%' }">
                  <div class="item-price"> {{ currentEarn.toFixed(2) }} $</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>export default {
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
    upgradeWorker() {
      if (this.coins >= this.currentPrice) {
        this.$emit('upgrade', this.worker.id, this.currentPrice);
      }
    },
    rewardWorker() {
      this.$emit('reward', this.worker.id, this.currentEarn);
    },
    getGem(){
      if (this.isProgressing) return;
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
          }, 100);
        }
      }, intervalDuration);
    },
    calculatePrice(basePrice, growthRate, currentOwned) {
      return basePrice * Math.pow(growthRate, currentOwned);
    },
    calculateEarn(baseEarn, growthRate, currentOwned) {
      return baseEarn * Math.pow(growthRate, currentOwned);
    }
  },
  computed: {
    currentPrice() {
      if (this.worker.id == 0) {
        return this.worker.price
      }
      return this.calculatePrice(this.worker.price, 1.15, this.worker.amount);
    },
    currentEarn() {
      if (this.worker.id == 0) {
        return this.worker.earn
      }
      return this.calculateEarn(this.worker.earn, 1.05, this.worker.amount);
    }
  },
  emits: ['upgrade', 'reward']
};</script>

<style scoped>
.item {
  padding: 20px 37px;
  background-image: url("/src/assets/images/background/workerbg.png");
  background-size: cover;
}


.item:last-child {
  border-bottom: none;
}

.item-icon {
  cursor: pointer;
}

*[disabled=true] {
  opacity: 0.2;
}

.item-icon img {
  border: 3px solid #692222;
  outline: 1px solid #fdd627;
  outline-offset: -5px;
  max-height: 80px;
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
  font-size: 33px;
  color: #a57843;
}
.item-upgrade{
  font-size: 20px;
    background: bisque;
    border-radius: 3px;
    position: absolute;
    cursor: pointer;
}

.item-amount {
  font-size: 16px;
  color: #666;
}

#progress-bar-container {
  width: 300px;
    background-color: rgb(58 0 0 / 66%);
    border-radius: 7px;
    overflow: hidden;
    border: 2px solid rgb(130 174 16 / 26%);
}

#progress-bar {
  height: 40px;
  background-color: #f8c928;
  transition: width 0.1s linear;
}
</style>
<style>
.floating-element {
    border-radius: 10px;
    animation: float 2s ease-in-out infinite;
}
@keyframes float {
    50% {
      transform: scale(1.05);
    }
}</style>