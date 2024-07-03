<template>
  <div>
    <div class="container d-flex flex-column item">
      <div class="row flex-grow-1 align-items-center">
        <div class="col-3">
          <div class="item-icon position-relative" @click="getGem" :disabled="isProgressing">
            <img class="floating-element" :src="workerImg" alt="Dynamic Image" />
            <div class="item-amount position-absolute">{{ worker.amount }}</div>
          </div>
        </div>
        <div class="col-9 d-flex flex-column">
          <div class="row position-relative">
            <div class="item-info">
              <div class="item-name">{{ worker.name }}</div>
              <div :id="'progress-container-' + worker.id" class="progress-container level-0">
                <div class="progress-wave"></div>
                <div class="item-level">
                  lvl.
                  <span>{{ worker.level }}</span>
                </div>
              </div>
              <div class="item-upgrade position-absolute" v-if="worker.id > 0" @click="upgradeWorker"
                :disabled="coins < currentPrice"> ↑
                {{ currentPrice.toFixed(2) }}&nbsp;$</div>
            </div>

          </div>
          <div class="row">
            <div class="col-md-12 bordered">
              <div id="progress-bar-container">
                <div id="progress-bar" :style="{ width: progress + '%' }">
                  <div class="item-price"> {{ currentEarn.toFixed(2) }}&nbsp;$</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
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
    upgradeWorker() {
      if (this.coins >= this.currentPrice) {
        this.$emit('upgrade', this.worker.id, this.currentPrice);

        this.setProgressLevel(this.worker.level, 20);
      }
    },
    rewardWorker() {
      this.$emit('reward', this.worker.id, this.currentEarn);
    },
    getGem() {
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
    },
    setProgressLevel(level, maxLevel) {
      const progressContainer = document.getElementById(`progress-container-${this.worker.id}`);
      const progressWave = progressContainer.querySelector('.progress-wave');
      const percentage = 50 - ((level / maxLevel) * 50);

      console.log(percentage);
      if (percentage >= 0) {
        progressWave.style.transform = `translateY(${percentage}%)`;
      }
    }
  },
  computed: {
    currentPrice() {
      if (this.worker.id == 0) {
        return this.worker.price;
      }
      return this.calculatePrice(this.worker.price, 1.15, this.worker.level);
    },
    currentEarn() {
      if (this.worker.id == 0) {
        return this.worker.earn;
      }
      return this.calculateEarn(this.worker.earn, 1.05, this.worker.level);
    }
  },
  emits: ['upgrade', 'reward']
};
</script>


<style scoped>
.item {
  padding: 20px 37px;
  background-image: url("/src/assets/images/background/workerbg.png");
  background-size: contain;
  background-repeat: no-repeat;
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

.item-info {
  display: flex;
  flex-direction: row;
  flex-grow: 1;
  justify-content: space-between;
}

.item-level {
  height: 5vw;
  min-height: 30px;
  max-height: 50px;
  width: 75px;
  left: 50%;
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);

  span {
    font-size: 36px
  }
}

@media only screen and (max-width: 600px) {

  .item-level {

    span {
      font-size: 24px
    }
  }
}

.item-name {
  font-size: 18px;
  font-weight: bold;
}

.item-price {
  font-size: 20px;
  color: #a57843;
}

.item-upgrade {
  font-size: 20px;
  background: bisque;
  border-radius: 3px;
  position: absolute;
  cursor: pointer;
  right: -60px;
  bottom: 0;
  transform: rotate(343deg);
}


#progress-bar-container {
  background-color: rgb(58 0 0 / 66%);
  border-radius: 7px;
  overflow: hidden;
  border: 2px solid rgb(130 174 16 / 26%);
  min-width: 200px;
  width: 42vw;
  max-width: 280px;
}

#progress-bar {
  min-height: 24px;
  height: calc(4vw);
  max-height: 27px;
  background-color: #f8c928;
  transition: width 0.1s linear;
  text-align: left;
}
</style>
<style>
.floating-element {
  border-radius: 10px;
  animation: float 2s ease-in-out infinite;
}


.progress-container {
  width: 100px;
  height: 56px;
  border: 3px solid #000;
  border-radius: 5px;
  overflow: hidden;
  position: relative;
  background-color: rgba(255, 255, 255, 0.5);
  margin: -12px 0 5px 0;
}

.progress-wave {
  position: absolute;
  bottom: 0;
  width: 200%;
  height: 200%;
  background: linear-gradient(to bottom, rgba(0, 0, 255, 0) 50%, rgba(119, 212, 81, 0.8) 60%), url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path fill="%2377d451" fill-opacity="1" d="M0,160L48,170.7C96,181,192,203,288,218.7C384,235,480,245,576,229.3C672,213,768,171,864,138.7C960,107,1056,85,1152,85.3C1248,85,1344,107,1392,117.3L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path></svg>') repeat-x;
  background-size: 50% 100px;
  animation: wave 2s linear infinite;
  transform: translateY(100%);
}

@keyframes wave {
  0% {
    background-position: 0 0;
  }

  100% {
    background-position: 100% 0;
  }
}

@keyframes float {
  50% {
    transform: scale(1.05);
  }
}
</style>