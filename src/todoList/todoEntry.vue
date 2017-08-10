<template>
  <div class="card todo-view">

    <!-- Block visible in case of an existing todo. -->
    <div class="card-content" v-if="!editable">

      <div class="card-header">
        <p class="card-header-title">{{todo.headline}}</p>
        <div class="card-header-icon">
          <span class="icon"><i class="fa fa-edit" @click="setEditable(true)"></i></span>
          <span class="icon"><i class="fa fa-close" @click="onDelete()"></i></span>
        </div>
      </div>

      <div class="card-content">
        <div>{{todo.description}}</div>
      </div>

      <footer class="card-footer">
        <div class="card-footer-item">{{$t('todo-entry.created')}}: {{$d(todo.created, 'long')}}</div>
        <div class="card-footer-item">{{$t('todo-entry.deadline')}}: {{$d(todo.deadline, 'long')}}</div>
      </footer>

    </div>

    <!-- Block visible in case of a new todo. -->

    <div class="new-todo-block" v-if="editable">
      <form v-on:submit.prevent="onSubmit" novalidate>
        <input
          :placeholder="$t('todo-entry.title')"
          v-validate.initial="'required'"
          type="text"
          name="title"
          v-model="pendingTodo.headline"
          class="input"
          :class="{'is-danger': errors.has('title')}"
        >
        <textarea
          :placeholder="$t('todo-entry.description')"
          v-validate.initial="'required'"
          name="description"
          v-model="pendingTodo.description"
          class="textarea"
          :class="{'is-danger': errors.has('description')}"
        ></textarea>
        <input
          type="text"
          v-validate.initial="'required'"
          :placeholder="$t('todo-entry.deadline')"
          name="deadline"
          required
          class="input"
          :class="{'is-danger': errors.has('deadline')}"
          id="deadlineInput"
        >

        <footer class="card-footer todo-creation-controls">
          <button type="submit" class="button is-primary card-footer-item" :disabled="errors.any()">
            {{$t( 'todo-entry.' + (pendingTodo.id ? 'update' : 'submit'))}}
          </button>
          <button type="button" class="button is-warning card-footer-item" @click="onCancel()">
            {{$t('todo-entry.cancel')}}
          </button>
        </footer>
      </form>
    </div>
  </div>
</template>

<script lang="ts" src="./todoEntry.ts"></script>

<style lang="scss">
  @import "~flatpickr/dist/themes/airbnb";
  @import "../styles/typography";

  .todo-view {
    min-width: $min-page-width;
    width: 75%;
    margin: 0.25rem auto;
  }

  .new-todo-block {
    max-width: 800px;
    margin: auto;
    position: relative;

    form {
      width: 100%;

      input, select, textarea {
        width: 100%;
        min-width: 100%;
        margin-bottom: 0.5rem;

        &.invalid {
          box-shadow: 0 0 6px $color-red;
        }
      }

      .todo-creation-controls button {
        padding-bottom: 0;
        padding-top: 0;
      }
    }
  }

  .flatpickr-month {
    height: 35px;
  }
</style>