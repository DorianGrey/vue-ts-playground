<template>
  <!--
  <select v-model="currentLanguage" class="select" @change="langChanged">
    <option v-for="lang in languages" v-bind:value="lang.key" v-t="lang.value"></option>
  </select>
  -->

  <v-menu bottom left>
    <v-btn color="secondary" icon slot="activator" dark>
      <v-icon>language</v-icon>
    </v-btn>
    <v-list>
      <v-list-tile v-for="lang in languages" :key="lang.key" @click="langChanged(lang.key)">
        <v-list-tile-title v-t="lang.value" />
      </v-list-tile>
    </v-list>
  </v-menu>

</template>

<script lang="ts" src="./languageSelector.ts">
</script>

<style lang="scss">
@import "../../styles/colors";
@import "../../styles/typography";

select {
  height: $side-nav-width;
}

option {
  background-color: rgb(54, 54, 54);
}
</style>
