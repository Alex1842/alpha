<template>
      <div class="background">
       <!--  <div class="water"></div> -->
    </div>

    <svg class="svgBg">
      <filter id="turbulence" x="0" y="0" width="100%" height="100%">
        <feTurbulence id="sea-filter" numOctaves="5" seed="5" baseFrequency="0.2 0.2"></feTurbulence>
        <feDisplacementMap scale="20" in="SourceGraphic"></feDisplacementMap>
        <animate xlink:href="#sea-filter" attributeName="baseFrequency" dur="120s" 
        keyTimes="0;0.5;1" values="0.02 0.06;0.04 0.08;0.02 0.06" repeatCount="indefinite"/>
      </filter>
    </svg>
</template>

<script>
export default {
  name: 'CBackground',
}
</script>
<style>
body {
    margin: 0;
}

.svgBg{
  height: 0;
}

.background {
    position: absolute;
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    width: 100vw;
    background-image: url("/src/assets/images/background/bg.png");
    background-size: cover;
}

.background .water {
    position: absolute;
    background-image: url("/src/assets/images/IMG_1064-map.png");
    background-size: cover;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    filter: url("#turbulence");
}
</style>
