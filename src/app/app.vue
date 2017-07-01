<template>

  <div id="app">
    <nav class="nav">

      <div class="nav-left nav-item app-info">
        <i class="fa fa-bookmark" aria-hidden="true"></i>
        <span>Demo App</span>
      </div>

      <!-- Dropdown menu for mobile (i.e. < 768px width). -->
      <span class="nav-toggle" :class="{'is-active': isMenuOpen}" @click="openMenu($event)">
        <span></span>
        <span></span>
        <span></span>
      </span>

      <div class="nav-right nav-menu" :class="{'is-active': isMenuOpen}">
        <router-link class="nav-item" to="/input-test">
          <i class="fa fa-keyboard-o" aria-hidden="true"></i>
          Input Test
        </router-link>
        <router-link class="nav-item" to="/todo-list/42">
          <i class="fa fa-calendar" aria-hidden="true"></i>
          Todo list
        </router-link>
        <router-link class="nav-item" to="/gallery">
          <i class="fa fa-picture-o" aria-hidden="true"></i>
          Gallery
        </router-link>
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

    nav {
      .app-info {
        line-height: 28px;

        i {
          margin-right: 10px;
          vertical-align: sub;
        }

        span {
          font-style: italic;
        }
      }

      a {
        background-color: $color-black;
        color: $color-dark-grey;
        font-weight: 600;

        &:hover, &.router-link-active {
          color: $color-white;
        }

        i {
          margin-right: 5px;
        }
      }
    }
  }

</style>
