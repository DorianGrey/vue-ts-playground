<template>

  <div id="app">
    <nav class="nav">

      <div class="nav-left app-info">Demo App</div>

      <!-- Dropdown menu for mobile (i.e. < 768px width). -->
      <span class="nav-toggle" :class="{'is-active': isMenuOpen}" @click="openMenu()">
        <span></span>
        <span></span>
        <span></span>
      </span>

      <div class="nav-right nav-menu" :class="{'is-active': isMenuOpen}">
        <router-link class="nav-item" to="/input-test">Input Test</router-link>
        <router-link class="nav-item" to="/todo-list/42">Todo list</router-link>
        <router-link class="nav-item" to="/gallery">Gallery</router-link>
      </div>
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

    .app-info {
      line-height: 35px;
      font-style: italic;
      margin-right: 2rem;
    }

    a {
      background-color: $color-black;
      color: $color-dark-grey;
      font-weight: 600;

      &:hover, &.router-link-active {
        color: $color-white;
      }
    }
  }

</style>
