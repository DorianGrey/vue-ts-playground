<template>
    <carousel-3d :controls-visible="true" :clickable="true" :height="500" :width="900">
      <slide v-for="(s, idx) in imgSlides" :index="idx" :key="s.src">
        <figure>
          <img :src="s.src">
          <!--
            Note: Using v-t here does not in a reactive way under these circumstances,
            thus we fall back to $t.
          -->
          <figcaption>
            {{$t(s.desc)}}
          </figcaption>
        </figure>
      </slide>
    </carousel-3d>

    <!--
    <div>I am an asynchronously loaded component!</div>
    <img src="../static/nethskie-2015-09-02-1521.jpg" />
    -->
</template>

<script lang="ts">
  import { Component, Vue } from "av-ts";

  @Component
  export default class Gallery extends Vue {
    readonly imgSlides = [
      {
        src: require<string>("../static/gallery/20160709150245_1.jpg"),
        desc: "gallery.pic-q-host"
      },
      {
        src: require<string>("../static/gallery/20170319154359_1.jpg"),
        desc: "gallery.pic-beauclair-sunset"
      },
      {
        src: require<string>("../static/gallery/20170319162423_1.jpg"),
        desc: "gallery.pic-beauclair-river"
      },
      {
        src: require<string>("../static/gallery/20170329193830_1.jpg"),
        desc: "gallery.pic-beauclair-majoran"
      },
      {
        src: require<string>("../static/gallery/20170331194617_1.jpg"),
        desc: "gallery.pic-beauclair-sunrise"
      },
      {
        src: require<string>("../static/gallery/20170406211004_1.jpg"),
        desc: "gallery.pic-toussaint-bhad"
      }
    ];

    readonly slides = this.imgSlides.length;
  }

</script>

<style lang="scss">
  @import "../styles/colors.scss";

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
    color: #FFFFFF;
    bottom: 0;
    padding: 15px;
    font-size: 12px;
    min-width: 100%;
    box-sizing: border-box;
  }

  a.prev, a.next {
    background: transparent !important;
    color: $color-white !important;

    &:hover {
      background: transparent !important;
    }
  }

</style>