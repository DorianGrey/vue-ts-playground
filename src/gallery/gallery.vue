<template>
  <article>
    <carousel-3d :controls-visible="true" :clickable="true" :height="380" :width="600">
      <slide :index="0">
        <figure>
          <img src="../static/gallery/20160709150245_1.jpg">
          <figcaption>
            While doing quests for in the "Hearts of Stone" extension...
          </figcaption>
        </figure>
      </slide>

      <slide :index="1">
        <figure>
          <img src="../static/gallery/20170319154359_1.jpg">
          <figcaption>
            Sunset in Toussaint
          </figcaption>
        </figure>
      </slide>

      <slide :index="2">
        <figure>
          <img src="../static/gallery/20170319162423_1.jpg">
          <figcaption>
            Toussaint: A view of Beauclair from river side
          </figcaption>
        </figure>
      </slide>

      <slide :index="3">
        <figure>
          <img src="../static/gallery/20170329193830_1.jpg">
          <figcaption>
            Toussaint: The statue of Majoran
          </figcaption>
        </figure>
      </slide>

      <slide :index="4">
        <figure>
          <img src="../static/gallery/20170331194617_1.jpg">
          <figcaption>
            Toussaint: Beauclair after sunrise, from far distance
          </figcaption>
        </figure>
      </slide>

      <slide :index="5">
        <figure>
          <img src="../static/gallery/20170406211004_1.jpg">
          <figcaption>
            Toussaint: The miniature city in the fairy land in "Beyond Hill and Dale..."
          </figcaption>
        </figure>
      </slide>
    </carousel-3d>

    <!--
    <div>I am an asynchronously loaded component!</div>
    <img src="../static/nethskie-2015-09-02-1521.jpg" />
    -->
  </article>
</template>

<script lang="ts" src="./gallery.ts"></script>
<style lang="scss">
  @import "../styles/colors.scss";

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

    &:hover {
      background: transparent !important;
    }
  }

</style>