<template>
  <carousel-3d
    :controls-visible="true"
    :clickable="true"
    :height="500"
    :width="900"
  >
    <slide v-for="(s, idx) in imgSlides" :index="idx" :key="s.src">
      <figure>
        <img :src="s.src" />
        <!--
            Note: Using v-t here does not work in a reactive way under these circumstances,
            thus we fall back to $t.
          -->
        <figcaption>{{ $t(s.desc) }}</figcaption>
      </figure>
    </slide>
  </carousel-3d>

  <!--
    <div>I am an asynchronously loaded component!</div>
    <img src="../static/nethskie-2015-09-02-1521.jpg" />
    -->
</template>

<script lang="ts" src="./gallery.ts"></script>
<style lang="scss">
@import "../../styles/colors";

.wrapper {
  height: 100%;
  width: 100%;
}

.carousel-3d-container figure {
  margin: 0;
}

.carousel-3d-container figcaption {
  position: absolute;
  background-color: rgba(0, 0, 0, 0.5);
  color: #ffffff;
  bottom: 0;
  padding: 15px;
  font-size: 12px;
  min-width: 100%;
  box-sizing: border-box;
}

a.prev,
a.next {
  background: transparent !important;
  color: $color-white !important;

  &:hover {
    background: transparent !important;
  }
}
</style>
