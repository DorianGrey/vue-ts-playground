<template>
  <section>
    <h2>All todos</h2>
    <todo-entry v-for="todo in todoList" :key="todo.id" :todo="todo" class="inverse-colored"></todo-entry>

    <h2>Expired todos</h2>
    <todo-entry v-for="todo in expiredTodos" :key="todo.id" :todo="todo" class="inverse-colored"></todo-entry>
  </section>
</template>

<script lang="ts" src="./todoList.ts"></script>

<style lang="scss">
  @import "../styles/typography";

  .new-todo-block {
    width: 50%;
    margin: auto;
    border: 1px dotted $color-medium-grey;
    position: relative;

    form {
      width: 100%;

      input, select, textarea {
        width: 100%;
        min-width: 100%;
        margin-bottom: .5rem;
      }

      .todo-creation-controls {
        width: 100%;
        justify-content: space-around;
      }
    }
  }
</style>