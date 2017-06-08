<template>
  <div>TestRoute2</div>
</template>

<script lang="ts">
  import {Vue, Component, p, Prop} from "av-ts";

  @Component
  class TestRoute2 extends Vue {
    @Prop id = p({
      type:     String,
      required: true
    });
  }

  export default TestRoute2;
</script>