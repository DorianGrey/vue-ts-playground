<template>
  <v-tabs v-model="activeTab" centered grow>
    <v-toolbar>
      <v-toolbar-title v-t="'todo-list.headline'" />
    </v-toolbar>

    <v-tabs-bar>
      <v-tabs-item @click="setActiveTab('active')" class="grey darken-1" href="#active">
        <span v-t="'todo-list.active'"></span>
      </v-tabs-item>
      <v-tabs-item @click="setActiveTab('expired')" class="grey darken-1" href="#expired">
        <span v-t="'todo-list.expired'"></span>
      </v-tabs-item>

      <v-tabs-slider color="cyan"></v-tabs-slider>
    </v-tabs-bar>

    <v-tabs-items>
      <v-tabs-content id="active">
        <v-layout column id="todo-list">
          <todo-entry v-for="todo in todoList" :key="todo.id" :todo="todo" />

          <button class="button is-light new-todo" @click="showNewTodoBlock" v-if="!newTodoEditable">
            <v-icon>add_circle_outline</v-icon>
          </button>

          <todo-entry :initialEditable="true" :afterSubmit="hideNewTodoBlock" :afterCancel="hideNewTodoBlock"
                      v-if="newTodoEditable" />
        </v-layout>

      </v-tabs-content>

      <v-tabs-content id="expired">
        <todo-entry v-for="todo in expiredTodos" :key="todo.id" :todo="todo" />
      </v-tabs-content>
    </v-tabs-items>
  </v-tabs>
</template>

<script lang="ts" src="./todoList.ts"></script>

<style lang="scss">
  @import "../styles/typography";

  #todo-list {
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