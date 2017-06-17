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
        <div>{{$d(todo.created, 'long')}}</div>
        <div>{{$d(todo.deadline, 'long')}}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" src="./todoEntry.ts"></script>

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