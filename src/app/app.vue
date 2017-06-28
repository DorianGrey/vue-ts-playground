<template>

  <div id="app">
    <nav class="navbar navbar-toggleable-md navbar-inverse bg-primary navbar-fixed-top">
      <button class="navbar-toggler navbar-toggler-right" type="button" data-toggle="collapse"
              data-target="#navbarColor01" aria-controls="navbarColor01" aria-expanded="false"
              aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <!--<a class="navbar-brand" href="#" data-vivaldi-spatnav-clickable="1">Navbar</a>-->

      <div class="collapse navbar-collapse" id="navbarColor01">
        <ul class="navbar-nav mr-auto">
          <li>
            <div class="app-info">Demo App</div>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/input-test">Input Test</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/todo-list/42">Todo list</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/gallery">Gallery</router-link>
          </li>
        </ul>
        <!--
        <form class="form-inline">
          <input class="form-control mr-sm-2" type="text" placeholder="Search">
          <button class="btn btn-secondary my-2 my-sm-0" type="submit">Search</button>
        </form>
        -->
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
      color: $color-light-grey;
      display: block;
      font-weight: 600;

      &:hover, &.router-link-active {
        color: $color-white;
      }
    }
  }

</style>
