<template>
  <div class="todo-entry">
    <div class="row headline">
      <div class="h3">{{todo.headline}}</div>
      <div class="todo-controls">
        <i class="fa fa-edit"></i>
        <i class="fa fa-close"></i>
      </div>
    </div>
    <div class="row content">
      <div>{{todo.description}}</div>
      <div class="column">
        <div>{{todo.created}}</div>
        <div>{{todo.deadline}}</div>
      </div>
    </div>
  </div>
</template>

<script>
  import {Vue, Component, p, Prop} from "av-ts";
  import {TodoModel} from "./todo.state";

  @Component
  export default class TodoEntry extends Vue {
    @Prop todo = p({
        type: Object,
        required: true
      }) as TodoModel;
  }
</script>

<style lang="scss">
  @import "../styles/typography";

  .todo-entry {
    min-width: $min-page-width;
    margin: .25rem auto;
    width: 50%;
    padding: 1em;

    border: 1px solid $color-medium-grey;

    .headline {
      justify-content: space-between;
      padding-bottom: .5rem;
    }

    .content {
      justify-content: space-between;
    }
  }
</style>