<template>
  <div :id="'progress-container-' + stoneId" class="progress-container">
    <div class="progress-wave" :style="background"></div>
    <div class="item-level d-flex">
      <span :style="!isUpgradeAvailable(stoneId) ? { color: 'white' } : {}">{{
        calculatedChance
      }}</span>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
export default {
  name: "StoneLevel",
  props: {
    stoneId: {
      type: Number,
      required: true,
    },
    background: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      isProgressSet: false,
    };
  },
  computed: {
    ...mapGetters(["getChanceById", "isUpgradeAvailable"]),
    calculatedChance() {
      if (this.isUpgradeAvailable(this.stoneId)) {
        return (this.getChanceById(this.stoneId) * 100).toFixed() + "%";
      } else {
        return "MAX";
      }
    },
  },

  methods: {
    ...mapActions(["setProgressLevel"]),
  },
  mounted() {
    if (!this.isProgressSet) {
      this.setProgressLevel({ stoneId: this.stoneId });
      this.isProgressSet = true;
    }
  },
};
</script>
<style>
.item-level {
  height: 100%;
  justify-content: center;
  align-items: center;
  span {
    line-height: normal;
    font-size: 30px;
  }
}

@media only screen and (max-width: 600px) {
  .item-level {
    span {
      font-size: 24px;
    }
  }
}
.progress-container.upgraded:before {
  content: "";
  position: absolute;
  width: 100px;
  height: 100%;
  background-image: linear-gradient(
    120deg,
    rgba(255, 255, 255, 0) 30%,
    rgba(255, 255, 255, 0.8),
    rgba(255, 255, 255, 0) 70%
  );
  top: 0;
  left: -100px;
  animation: shine 1s linear;
}

@keyframes shine {
  0% {
    left: -100px;
  }

  20% {
    left: 100%;
  }

  100% {
    left: 100%;
  }
}

.progress-container {
  width: 100%;
  height: 56px;
  border: 3px solid #000;
  border-radius: 5px;
  overflow: hidden;
  position: relative;
  background-color: rgba(255, 255, 255, 0.5);
}

.progress-wave {
  position: absolute;
  bottom: -50px;
  width: 200%;
  height: 200%;
  background: var(--background);
  background-size: 50% 100px;
  animation: wave 2s linear infinite;
  transition: transform 0.1s ease-in;
  opacity: 0.5;
}

@keyframes wave {
  0% {
    background-position: 0 0;
  }

  100% {
    background-position: 100% 0;
  }
}
</style>
