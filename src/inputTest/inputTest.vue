<template>
  <article>
    <section>
      <div>{{$t('input-test.label')}}: {{inputText}}</div>
      <input type="text" v-model="inputText" class="input">
    </section>
  </article>
</template>

<script lang="ts" src="./inputTest.ts"></script>