<template>
  <article>
    <section>
      <div>TestRoute1</div>
      <div>{{$route.params}}</div>
      <div>{{id}}</div>
    </section>
  </article>
</template>

<script lang="ts">
  import {Vue, Component, p, Prop} from "av-ts";

  @Component
  class TestRoute1 extends Vue {
    @Prop id = p({
      type: String,
      required: true
    })
  }

  export default TestRoute1;
</script>