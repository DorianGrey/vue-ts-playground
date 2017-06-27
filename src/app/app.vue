<template>
  <div id="app">
    <header>
      <h2>Demo App</h2>
    </header>
    <nav>
      <ul>
        <li>
          <router-link to="/input-test">Input Test</router-link>
        </li>
        <li>
          <router-link to="/todo-list/42">Todo list</router-link>
        </li>
        <li>
          <router-link to="/gallery">Gallery</router-link>
        </li>
      </ul>
    </nav>
    <router-view></router-view>
  </div>
</template>

<script lang="ts" src="./app.ts"></script>

<style lang="scss">
  @import "../styles/colors";
  @import "../styles/typography";

  #app {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: $color-blacksmoke;
    margin-top: calc(#{$header-height} + .5rem);

    nav {
      width: 100%;

      ul {
        padding: 0;
        display: flex;

        li {
          flex-basis: 33%;
          margin: 0 10px;
        }
      }
    }

    a {
      color: $color-white;
      display: block;
      background-color: $color-light-grey;
      border-radius: 3px;
      line-height: 40px;
      font-weight: 600;

      &:hover {
        background-color: darken($color-light-grey, 15%);
      }

      &.router-link-active {
        background-color: $color-red;

        &:hover {
          background-color: darken($color-red, 15%);
        }
      }
    }
  }

  header {
    background-color: $color-black;
    color: $color-white;
    position: fixed;
    height: $header-height;
    line-height: $header-height;
    width: 100%;
    top: 0;
    left: 0;
    border-bottom: 1px solid $color-lightblack;

    text-align: center;

    display: flex;
    justify-content: space-around;
  }

</style>
