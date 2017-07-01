<template>
  <div class="card todo-view">

    <!-- Block visible in case of an existing todo. -->
    <div class="card-content" v-if="!editable">

      <div class="card-header">
        <p class="card-header-title">{{todo.headline}}</p>
        <div class="card-header-icon">
          <span class="icon"><i class="fa fa-edit" @click="setEditable(true)"></i></span>
          <span class="icon"><i class="fa fa-close"></i></span>
        </div>
      </div>

      <div class="card-content">
        <div>{{todo.description}}</div>
      </div>

      <footer class="card-footer">
        <div class="card-footer-item">Created: {{$d(todo.created, 'long')}}</div>
        <div class="card-footer-item">Deadline: {{$d(todo.deadline, 'long')}}</div>
      </footer>

    </div>

    <!-- Block visible in case of a new todo. -->

    <div class="new-todo-block" v-if="editable">
      <form v-on:submit.prevent="onSubmit" novalidate>
        <input placeholder="Title"
               v-validate.initial="'required'"
               type="text"
               name="title"
               v-model="targetTodo.headline"
               class="input"
               :class="{'is-danger': errors.has('title')}"
        >
        <textarea
          placeholder="Description"
          v-validate.initial="'required'"
          name="description"
          v-model="targetTodo.description"
          class="textarea"
          :class="{'is-danger': errors.has('description')}"
        ></textarea>

        <footer class="card-footer todo-creation-controls">
          <button type="submit" class="button is-primary card-footer-item" :disabled="errors.any()">
            {{targetTodo.id ? 'Create' : 'Submit'}}
          </button>
          <button type="button" class="button is-secondary card-footer-item" @click="setEditable(false)">
            Cancel
          </button>
        </footer>
      </form>
    </div>
  </div>
</template>

<script lang="ts" src="./todoEntry.ts"></script>

<style lang="scss">
  @import "../styles/typography";

  .todo-view {
    min-width: $min-page-width;
    width: 75%;
    margin: .25rem auto;
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
    }
  }
</style>