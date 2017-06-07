<template>
  <div id="app">
    <h1>Demo App</h1>
    <h2>Essential Links</h2>
    <nav>
      <ul>
        <li>
          <router-link to="/testRoute1/42">TestRoute 1</router-link>
        </li>
        <li>
          <router-link to="/testRoute2">TestRoute 2</router-link>
        </li>
        <li>
          <router-link to="/asyncTest">Async Test</router-link>
        </li>
      </ul>
    </nav>
    <router-view></router-view>
  </div>
</template>

<script>
  import {Vue, Component} from "av-ts";

  @Component
  class App extends Vue {
  }

  export default App;
</script>

<style lang="scss" scoped>
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e51;
    margin-top: 60px;
  }

  h1, h2 {
    font-weight: normal;
  }

  ul {
    list-style-type: none;
    padding: 0;
    li {
      display: inline-block;
      margin: 0 10px;
    }
  }

  a {
    color: #42b983;
  }
</style>
