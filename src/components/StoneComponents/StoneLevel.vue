<template>
  <div :id="'progress-container-' + stoneId" class="progress-container">
    <div class="progress-wave" :style="background"></div>
    <div class="item-level">
      <span>{{ (getChanceById(stoneId) * 100).toFixed() }}%</span>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
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
  computed: {
    ...mapGetters(["getChanceById","getTierById"]),
    
  },
};
</script>
<style>
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
    font-size: 36px;
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
  bottom: -5px;
  width: 200%;
  height: 200%;
  background: var(--background);
  background-size: 50% 100px;
  animation: wave 2s linear infinite;
  transition: transform 0.1s ease-in;
  transform: translateY(100%);
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
