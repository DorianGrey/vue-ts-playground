<template>
  <article>
    <section>
      <div>You entered: {{inputText}}</div>
      <input v-model="inputText">
    </section>
  </article>
</template>

<script lang="ts">
  import {Vue, Component} from "av-ts";

  @Component
  class InputTest extends Vue {
    inputText: string = "bass";
  }

  export default InputTest;
</script>