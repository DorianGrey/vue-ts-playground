<template>
  <div id="app">
    <nav class="nav">

      <div class="nav-left nav-item app-info">
        <i class="fa fa-bookmark" aria-hidden="true"></i>
        <span v-t="'header.demo-app'"></span>
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
          <span v-t="'header.input-test'"></span>
        </router-link>
        <router-link class="nav-item" to="/todo-list/42">
          <i class="fa fa-calendar" aria-hidden="true"></i>
          <span v-t="'header.todo-list'"></span>
        </router-link>
        <router-link class="nav-item" to="/gallery">
          <i class="fa fa-picture-o" aria-hidden="true"></i>
          <span v-t="'header.gallery'"></span>
        </router-link>
      </div>
    </nav>

    <router-view></router-view>

    <footer class="footer">
      <div class="container">
        <div class="tile is-ancestor">
          <div class="tile is-parent is-vertical">
            <div class="tile" v-t="'powered.tech'"></div>
            <div class="tile">
              <a class="icon" href="https://github.com/vuejs/vue" target="_blank" rel="noopener">
                <i class="fa fa-github"></i>
              </a>
              Vuejs + related libraries
            </div>
            <div class="tile">
              <a class="icon" href="https://github.com/GoogleChrome/workbox" target="_blank" rel="noopener">
                <i class="fa fa-github"></i>
              </a>
              Workbox
            </div>
          </div>
          <div class="tile is-parent is-vertical">
            <div class="tile" v-t="'powered.ui'"></div>
            <div class="tile">
              <a class="icon" href="https://github.com/jgthms/bulma" target="_blank" rel="noopener">
                <i class="fa fa-github"></i>
              </a>
              Bulma
            </div>
            <div class="tile">
              <a class="icon" href="https://github.com/jenil/bulmaswatch" target="_blank" rel="noopener">
                <i class="fa fa-github"></i>
              </a>
              bulmaswatch
            </div>
            <div class="tile">
              <a class="icon" href="https://github.com/rafaelpimpa/buefy" target="_blank" rel="noopener">
                <i class="fa fa-github"></i>
              </a>
              Buefy
            </div>
          </div>
        </div>

        <div class="container has-text-centered">
          <div class="tile is-ancestor">
            <div class="tile">
              <a class="icon" href="https://github.com/DorianGrey/vue-ts-playground" target="_blank" rel="noopener">
                <i class="fa fa-github"></i>
              </a>
              Project page
            </div>
            <div class="tile">
              <language-selector></language-selector>
            </div>
          </div>
        </div>


      </div>
    </footer>
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
    min-height: 100%;

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
