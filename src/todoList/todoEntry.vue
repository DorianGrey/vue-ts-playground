<template>
  <div class="inverse-colored todo-view">
    <div class="todo-entry" v-if="!editable">
      <div class="row headline">
        <div class="h3">{{todo.headline}}</div>
        <div class="todo-controls">
          <i class="fa fa-edit" @click="setEditable(true)"></i>
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
    <div class="new-todo-block column" v-if="editable">
      <form v-on:submit.prevent="onSubmit" novalidate>
        <input placeholder="Title"
               v-validate.initial="'required'"
               type="text"
               name="title"
               v-model="targetTodo.headline"
               :class="{invalid: errors.has('title')}"
        >
        <textarea
          placeholder="Description"
          v-validate.initial="'required'"
          name="description"
          v-model="targetTodo.description"
          :class="{invalid: errors.has('description')}"
        ></textarea>
        <div class="row todo-creation-controls">
          <button type="submit" class="btn btn-primary" :disabled="errors.any()">
            {{targetTodo.id ? 'Create' : 'Submit'}}
          </button>
          <button type="button" class="btn btn-secondary" @click="setEditable(false)">
            Cancel
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script lang="ts" src="./todoEntry.ts"></script>

<style lang="scss">
  @import "../styles/typography";

  .todo-view {
    min-width: $min-page-width;
    margin: .25rem auto;
    width: 50%;
    padding: 1em;

    border: 1px solid $color-medium-grey;
  }

  .todo-entry {
    .headline {
      justify-content: space-between;
      padding-bottom: .5rem;
    }

    .content {
      justify-content: space-between;
    }
  }

  .new-todo-block {
    width: 50%;
    margin: auto;
    position: relative;

    form {
      width: 100%;

      input, select, textarea {
        width: 100%;
        min-width: 100%;
        margin-bottom: .5rem;

        &.invalid {
          box-shadow: 0 0 6px $color-red;
        }
      }

      .todo-creation-controls {
        width: 100%;
        justify-content: space-around;
      }
    }
  }
</style>