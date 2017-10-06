<template>
  <select v-model="currentLanguage" class="select" @change="langChanged">
    <option v-for="lang in languages" v-bind:value="lang.key" v-t="lang.value"></option>
  </select>
</template>

<script lang="ts" src="./languageSelector.ts"></script>

<style lang="scss">
  @import "../styles/colors";
  @import "../styles/typography";

  select {
    height: $side-nav-width;
  }

  option {
    background-color: rgb(54, 54, 54);
  }
</style>