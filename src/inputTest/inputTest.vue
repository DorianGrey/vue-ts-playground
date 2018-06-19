<template>
  <div>
    <v-text-field
      name="input-1"
      :label="$t('input-test.help')"
      v-model="inputText"
      dark
    />
    <div v-t="{path: 'input-test.label', args:{text: inputText}}" class="output"></div>
  </div>
</template>

<script lang="ts">
  import { Component, Vue } from "av-ts";

  @Component
  export default class InputTest extends Vue {
    inputText: string = "bass";
  }

</script>