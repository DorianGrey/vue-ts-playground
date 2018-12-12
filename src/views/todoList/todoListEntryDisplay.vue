<template>
  <v-flex xs10 offset-xs1>
    <v-card>
      <v-card-title primary-title>
        <div>
          <h3>{{ todo.headline }}</h3>
          <div>{{ todo.description }}</div>
          <v-chip>
            <div
              v-t="{
                path: 'todo-entry.created',
                args: { date: $d(todo.created, 'long') }
              }"
            ></div>
          </v-chip>
          <v-chip>
            <div
              v-t="{
                path: 'todo-entry.deadline-value',
                args: { date: $d(todo.deadline, 'long') }
              }"
            ></div>
          </v-chip>
        </div>
      </v-card-title>

      <v-card-actions>
        <v-btn @click="setEditable(todo.id)"> <v-icon>input</v-icon> </v-btn>
        <v-btn @click="deleteTodo(todo.id)"> <v-icon>delete</v-icon> </v-btn>
      </v-card-actions>
    </v-card>
  </v-flex>
</template>

<script lang="ts" src="./todoListEntryDisplay.ts"></script>

<style scoped></style>
