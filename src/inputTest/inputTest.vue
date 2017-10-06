<template>
  <article>
    <section>
      <div v-t="{path: 'input-test.label', args:{text: inputText}}"></div>
      <input type="text" v-model="inputText" class="input">
    </section>
  </article>
</template>

<script lang="ts" src="./inputTest.ts"></script>