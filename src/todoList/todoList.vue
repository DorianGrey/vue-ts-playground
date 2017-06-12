<template>
  <section>
    <h2>All todos</h2>
    <todoEntry v-for="todo in todoList" :key="todo.id" :todo="todo" class="inverse-colored"></todoEntry>

    <h2>Expired todos</h2>
    <todoEntry v-for="todo in expiredTodos" :key="todo.id" :todo="todo" class="inverse-colored"></todoEntry>
  </section>
</template>

<script lang="ts">
  import {Vue, Component, p, Prop} from "av-ts";
  import {TodoModel} from "./todo.state";
  import TodoEntry from "./todoEntry.vue";

  @Component({
    components: {
      todoEntry: TodoEntry
    }
  })
  class TestRoute2 extends Vue {
    @Prop id = p({
      type:     String,
      required: true
    }) as string;

    get todoList(): TodoModel[] {
      return this.$store.getters.allTodos;
    }

    get expiredTodos(): TodoModel[] {
      return this.$store.getters.expiredTodos;
    }
  }

  export default TestRoute2;
</script>

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