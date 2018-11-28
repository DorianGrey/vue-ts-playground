<template>
  <div id="todo-list">
    <v-toolbar> <v-toolbar-title v-t="'todo-list.headline'" /> </v-toolbar>
    <v-tabs v-model="activeTab" centered grow>
      <v-tab
        @click="setActiveTab('active');"
        class="grey darken-1"
        href="#active"
      >
        <span v-t="'todo-list.active'"></span>
      </v-tab>
      <v-tab
        @click="setActiveTab('expired');"
        class="grey darken-1"
        href="#expired"
      >
        <span v-t="'todo-list.expired'"></span>
      </v-tab>

      <v-tabs-slider color="cyan"></v-tabs-slider>

      <v-tab-item value="active">
        <v-layout column id="todo-list">
          <div v-for="todo in todoList" :key="todo.id">
            <todo-list-entry-display v-if="!todo.editable" :todo="todo" />
            <todo-list-entry-editable v-if="todo.editable" :todo="todo" />
          </div>

          <button
            class="button is-light new-todo"
            @click="showNewTodoBlock"
            v-if="!newTodoEditable"
          >
            <v-icon>add_circle_outline</v-icon>
          </button>

          <todo-list-entry-editable
            :afterSubmit="hideNewTodoBlock"
            :afterCancel="hideNewTodoBlock"
            v-if="newTodoEditable"
          />
        </v-layout>
      </v-tab-item>

      <v-tab-item value="expired">
        <div v-for="todo in expiredTodos" :key="todo.id">
          <todo-list-entry-display :todo="todo" />
        </div>
      </v-tab-item>
    </v-tabs>
  </div>
</template>

<script lang="ts" src="./todoList.ts"></script>

<style lang="scss" scoped>
@import "../../../src/styles/typography";

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
