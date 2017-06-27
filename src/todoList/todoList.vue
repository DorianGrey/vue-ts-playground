<template>
  <section>
    <div class="todos">
      <h2>All todos</h2>
      <todo-entry v-for="todo in todoList" :key="todo.id" :todo="todo"></todo-entry>

      <h2>Expired todos</h2>
      <todo-entry v-for="todo in expiredTodos" :key="todo.id" :todo="todo"></todo-entry>

    </div>
    <div class="new-todo inverse-colored" @click="showNewTodoBlock" v-if="!newTodoEditable">
      <i class="fa fa-plus-circle"></i>
    </div>
    <todo-entry :initialEditable="true" v-if="newTodoEditable"></todo-entry>
  </section>
</template>

<script lang="ts" src="./todoList.ts"></script>

<style lang="scss">
  @import "../styles/typography";

  .todos {
    margin-bottom: 3rem;
  }

  .new-todo {
    width: 50%;
    margin: auto;
    font-size: 3em;
    text-align: center;
    border: 1px dotted $color-medium-grey;
    color: $color-medium-grey;
    cursor: pointer;

    transition:
      background-color .25s ease,
      color .25s ease;

    &:hover {
      background-color: $color-light-grey;
      color: $color-black;
    }

    i, i::before {
      background-color: transparent;
    }
  }

  .new-todo-block {
    width: 50%;
    margin: auto;
    border: 1px dotted $color-medium-grey;
    position: relative;
  }
</style>