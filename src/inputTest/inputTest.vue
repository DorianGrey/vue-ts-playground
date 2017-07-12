<template>
  <article>
    <section>
      <div>You entered: {{inputText}}</div>
      <input type="text" v-model="inputText">
    </section>
  </article>
</template>

<script lang="ts" src="./inputTest.ts"></script>