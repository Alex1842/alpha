<template>
  <div class="d-flex flex-column item">
    <div class="row flex-grow-1 align-items-center">
      <div class="col-3">
        <StoneImage
          :img="stoneImg"
          :stoneId="stone.id"
          :disabled="isProgressing || stone.amount < 1"
        />
      </div>
      <div class="col-6 d-flex flex-row" style="padding: 0">
        <div class="position-relative" style="width: 100%">
          <div class="item-info flex-column">
            <div class="item-name">{{ stone.name }}</div>
            <StoneProgress
              :stoneId="stone.id"
              :progress="progress"
              :currentEarn="currentEarn"
            />
          </div>
        </div>
      </div>
      <div class="col-3">
        <StoneLevel
          :id="stone.id"
          :level="stone.level"
          :chance="chance"
          :background="levelWave"
        />
        <StoneLevelUpgrade :id="stone.id" :coins="coins" :currentPrice="currentPrice" />
      </div>
    </div>
  </div>
</template>
<script>
import { mapActions, mapGetters } from "vuex";
import StoneImage from "./StoneComponents/StoneImage.vue";
import StoneLevel from "./StoneComponents/StoneLevel.vue";
import StoneLevelUpgrade from "./StoneComponents/StoneLevelUpgrade.vue";
import StoneProgress from "./StoneComponents/StoneProgress.vue";
export default {
  name: "StoneItem",
  components: {
    StoneImage,
    StoneLevel,
    StoneLevelUpgrade,
    StoneProgress,
  },
  props: {
    stone: {
      type: Object,
      required: true,
    },
    stoneImg: {
      type: String,
      required: true,
    },
    coins: {
      type: Number,
      required: true,
    },
    chance: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  data() {
    return {
      progress: 0,
      isProgressing: false,
      intervalId: null,
      tier: 0,
      tierMap: {
        0: "red",
        1: "green",
        2: "blue",
        3: "yellow",
        4: "pink",
      },
    };
  },
  mounted() {
    this.setProgressLevel();
  },
  computed: {
    ...mapGetters(["stoneById", "tierMap", "currentTier"]),
    currentPrice() {
      return this.calculatePrice(this.stone.price, 1.15, this.stone.level);
    },
    currentEarn() {
      return this.calculateEarn(this.stone.earn, 1.05, this.stone.level);
    },
    currentChance() {
      return this.currentTier.tier * 0.1;
    },
    /* currentTier() {
      const level = this.stone.level;
      const maxLevel = this.stone.levelCap;
      const tier = Math.floor(level / maxLevel);
      let percentage = 50 - ((level % maxLevel) / maxLevel) * 50;
      if (level !== 0 && level % maxLevel === 0) {
        percentage = 0;
      }
      return { percentage, tier };
    }, */
    levelWave() {
      const currentTier = this.currentTier(this.stone.id);
      if (!currentTier) return { "--background": "black" };
      const color = this.tierMap[currentTier.tier] || "black";
      const svgData = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path fill="${color}" fill-opacity="1" d="M0,160L48,170.7C96,181,192,203,288,218.7C384,235,480,245,576,229.3C672,213,768,171,864,138.7C960,107,1056,85,1152,85.3C1248,85,1344,107,1392,117.3L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path></svg>`;
      const encodedSVG = encodeURIComponent(svgData);
      const background = `linear-gradient(to bottom, rgba(0, 0, 255, 0) 40%, ${color} 53%), url('data:image/svg+xml;utf8,${encodedSVG}') repeat-x`;
      
      console.log("disz",this)
      return { "--background": background };
    },
  },
  methods: {
    ...mapActions(["sellStone", "setProgressLevel"]),
    upgradeStone() {
      if (this.coins >= this.currentPrice) {
        this.$emit("upgrade", this.stone.id, this.currentPrice);
        this.setProgressLevel();
      }
    },
    getMoney() {
      this.$emit("reward", this.stone.id, this.currentEarn);
    },
    sellStone() {
      if (this.isProgressing || this.stone.amount < 1) return;
      this.progress = 0;
      this.isProgressing = true;

      const intervalDuration = 100;
      const progressIncrement = 100 / ((this.stone.speed * 1000) / intervalDuration);
      this.intervalId = setInterval(() => {
        this.progress += progressIncrement;

        if (this.progress >= 100) {
          this.getMoney();
          this.progress = 100;
          clearInterval(this.intervalId);
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
    setProgressLevel() {
      this.setProgressLevel({ stoneId: this.stone.id });
      const progressContainer = document.getElementById(
        `progress-container-${this.stone.id}`
      );
      const progressWave = progressContainer.querySelector(".progress-wave");
      const currentTier = this.currentTier(this.stone.id);
      const percentage = currentTier.percentage;
      const newTier = currentTier.tier;
      this.$emit("updateProbs");
      if (percentage >= 0) {
        progressWave.style.transform = `translateY(${percentage}%)`;
        if (percentage === 0) {
          this.tier = newTier;
          setTimeout(function () {
            progressWave.style.transform = `translateY(50%)`;
            progressContainer.classList.add("upgraded");
            progressContainer.addEventListener("animationend", function () {
              progressContainer.classList.remove("upgraded");
            });
          }, 200);
        }
      }
    },
  },
  emits: ["reward", "upgrade", "updateProbs"],
};
</script>
<style>
.item {
  padding: 14px;
  background-image: url("/src/assets/images/background/workerbg.png");

  background-repeat: no-repeat;
  width: 495px;
  max-width: calc(100vw - 40px);
}

.item:last-child {
  border-bottom: none;
}

*[disabled="true"] {
  opacity: 0.2;
}

.item-info {
  display: flex;
  flex-grow: 1;
  justify-content: space-between;
  padding: 0;
}

.item-name {
  font-size: 18px;
  font-weight: bold;
}
</style>
