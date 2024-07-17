<template>
  <div class="item d-flex row flex-grow-1 align-items-center">
    <div class="col-3">
      <StoneImage :img="stoneImg" :stoneId="stoneId" />
    </div>
    <div class="col-6 d-flex flex-row" style="padding: 0">
      <div class="position-relative" style="width: 100%">
        <div class="item-info flex-column">
          <div class="item-name">{{ getStoneNameById(stoneId) }}</div>
          <StoneSellProgress :stoneId="stoneId" :progress="progress" />
        </div>
      </div>
    </div>
    <div class="col-3">
      <StoneLevel v-if="upgradeContition" :stoneId="stoneId" :background="levelWave" />
      <StoneLevelUpgrade v-if="this.stoneId != 0" :stoneId="stoneId" />
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import StoneImage from "./StoneComponents/StoneImage.vue";
import StoneLevel from "./StoneComponents/StoneLevel.vue";
import StoneLevelUpgrade from "./StoneComponents/StoneLevelUpgrade.vue";
import StoneSellProgress from "./StoneComponents/StoneSellProgress.vue";
export default {
  name: "StoneItem",
  components: {
    StoneImage,
    StoneLevel,
    StoneLevelUpgrade,
    StoneSellProgress,
  },
  props: {
    stoneImg: {
      type: String,
      required: true,
    },
    stoneId: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      progress: 0,
      isProgressing: false,
      intervalId: null,
    };
  },
  computed: {
    ...mapGetters(["tierMap", "getTierById", "getStoneNameById", "getChanceType"]),

    levelWave() {
      const currentTier = this.getTierById(this.stoneId);
      const color = this.tierMap[currentTier] || "black";
      const svgData = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path fill="${color}" fill-opacity="1" d="M0,160L48,170.7C96,181,192,203,288,218.7C384,235,480,245,576,229.3C672,213,768,171,864,138.7C960,107,1056,85,1152,85.3C1248,85,1344,107,1392,117.3L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path></svg>`;
      const encodedSVG = encodeURIComponent(svgData);
      const background = `linear-gradient(to bottom, rgba(0, 0, 255, 0) 40%, ${color} 53%), url('data:image/svg+xml;utf8,${encodedSVG}') repeat-x`;
      return { "--background": background };
    },
    upgradeContition() {
      
      if (this.stoneId == 0 && this.getChanceType == 0) {
        return false;
      }
      return true;
    },
  },
};
</script>
<style>
.item {
  padding: 14px;
  background-image: url("/src/assets/images/background/workerbg.png");
  background-repeat: no-repeat;
  width: 450px;
  max-width: calc(100vw - 40px);
  margin-left: 0 !important;
  background-size: 100% 100%;
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
  font-size: 16px;
  font-weight: bold;
}
</style>
