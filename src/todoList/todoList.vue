<template>
  <section>
    <div class="tabs is-centered is-medium is-toggle is-fullwidth">
      <ul>
        <li :class="{'is-active': activeTab === 'active'}" @click="setActiveTab('active')">
          <a>{{$t('todo-list.active')}}</a>
        </li>
        <li :class="{'is-active': activeTab === 'expired'}" @click="setActiveTab('expired')">
          <a>{{$t('todo-list.expired')}}</a>
        </li>
      </ul>
    </div>

    <!-- The 'active' tab - new todos can only be added here. -->
    <div v-if="activeTab === 'active'">
      <todo-entry v-for="todo in todoList" :key="todo.id" :todo="todo"></todo-entry>

      <button class="button is-light new-todo" @click="showNewTodoBlock" v-if="!newTodoEditable">
        <i class="fa fa-plus-circle"></i>
      </button>

      <todo-entry :initialEditable="true" :afterSubmit="hideNewTodoBlock" :afterCancel="hideNewTodoBlock" v-if="newTodoEditable"></todo-entry>

    </div>

    <!-- The 'expired' tab -->
    <div v-if="activeTab === 'expired'">
      <todo-entry v-for="todo in expiredTodos" :key="todo.id" :todo="todo"></todo-entry>
    </div>

  </section>
</template>

<script lang="ts" src="./todoList.ts"></script>

<style lang="scss">
  @import "../styles/typography";

  .todos {
    margin-bottom: 3rem;
  }

  .new-todo {
    width: 50%;
    min-width: $min-page-width;
    margin: auto;
    font-size: 3em;
    text-align: center;

    i {
      font-size: 1.5em;
    }
  }

</style>