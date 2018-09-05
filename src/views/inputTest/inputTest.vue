<template>
  <div>
    <v-text-field
      name="input-1"
      :label="$t('input-test.help')"
      v-model="inputText"
      dark
    />
    <div v-t="{path: 'input-test.label', args:{text: invertedInputText}}" class="output"></div>
  </div>
</template>

<script lang="ts" src="./inputTest.ts">
</script>
