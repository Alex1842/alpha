<template>
      <div class="background">
    </div>
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
    position: fixed;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    background-image: url("/src/assets/images/background/bg_v2.png");
    background-size: 1170px;
    background-position: center bottom;
    background-repeat: no-repeat;
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
