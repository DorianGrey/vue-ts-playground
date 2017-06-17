<template>
  <div id="app">
    <h1>Demo App</h1>
    <nav>
      <ul>
        <li>
          <router-link to="/input-test">Input Test</router-link>
        </li>
        <li>
          <router-link to="/todo-list/42">Todo list 2</router-link>
        </li>
        <li>
          <router-link to="/asyncTest">Async Test</router-link>
        </li>
      </ul>
    </nav>
    <router-view></router-view>
  </div>
</template>

<script lang="ts" src="./app.ts"></script>

<style lang="scss" scoped>
  @import "../styles/colors";

  #app {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: $color-blacksmoke;
    margin-top: .5rem
  }

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
</style>
