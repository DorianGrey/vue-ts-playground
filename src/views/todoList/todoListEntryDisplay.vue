<template>
  <v-flex xs10 offset-xs1>
    <v-card>
      <v-card-title primary-title>
        <div>
          <h3>{{todo.headline}}</h3>
          <div>{{todo.description}}</div>
          <v-chip>
            <div v-t="{path: 'todo-entry.created', args: {date: $d(todo.created, 'long')}}"></div>
          </v-chip>
          <v-chip>
            <div v-t="{path: 'todo-entry.deadline-value', args: {date: $d(todo.deadline, 'long')}}"></div>
          </v-chip>
        </div>
      </v-card-title>

      <v-card-actions>
        <v-btn @click="setEditable(todo.id)">
          <v-icon>input</v-icon>
        </v-btn>
        <v-btn @click="deleteTodo(todo.id)">
          <v-icon>delete</v-icon>
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-flex>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";

import { TodoModel } from "./state/types";
import { TODO_MODULE_MUTATIONS, TodoSpace } from "./state/todo.state";

@Component
export default class TodoListEntryDisplay extends Vue {
  @TodoSpace.Mutation(TODO_MODULE_MUTATIONS.SET_EDITABLE)
  readonly setEditable: (target: number) => void;

  @TodoSpace.Mutation(TODO_MODULE_MUTATIONS.DELETE)
  readonly deleteTodo: (target: number) => void;

  @Prop({ type: Object, required: true })
  todo: TodoModel;
}
</script>

<style scoped>
</style>
