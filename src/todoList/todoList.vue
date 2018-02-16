<template>
  <div id="todo-list">
    <v-toolbar>
      <v-toolbar-title v-t="'todo-list.headline'" />
    </v-toolbar>
    <v-tabs v-model="activeTab" centered grow>
      <v-tab @click="setActiveTab('active')" class="grey darken-1" href="#active">
        <span v-t="'todo-list.active'"></span>
      </v-tab>
      <v-tab @click="setActiveTab('expired')" class="grey darken-1" href="#expired">
        <span v-t="'todo-list.expired'"></span>
      </v-tab>

      <v-tabs-slider color="cyan"></v-tabs-slider>

      <v-tab-item id="active">
        <v-layout column id="todo-list">
          <todo-entry v-for="todo in todoList" :key="todo.id" :todo="todo" />

          <button class="button is-light new-todo" @click="showNewTodoBlock" v-if="!newTodoEditable">
            <v-icon>add_circle_outline</v-icon>
          </button>

          <todo-entry :initialEditable="true" :afterSubmit="hideNewTodoBlock" :afterCancel="hideNewTodoBlock"
                      v-if="newTodoEditable" />
        </v-layout>

      </v-tab-item>

      <v-tab-item id="expired">
        <todo-entry v-for="todo in expiredTodos" :key="todo.id" :todo="todo" />
      </v-tab-item>
    </v-tabs>
  </div>
</template>

<script lang="ts" src="./todoList.ts"></script>

<style lang="scss">
  @import "../styles/typography";

  #todo-list {
    width: 100%;

    > * {
      margin-top: 1rem;
      margin-bottom: 1rem;
    }
  }

  .new-todo {
    min-width: 250px;
    max-width: 900px;
    margin: auto;
    font-size: 3em;
    text-align: center;

    i {
      font-size: 1.5em;
    }
  }

</style>