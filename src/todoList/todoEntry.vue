<template>
  <v-flex xs10 offset-xs1>

    <!-- Block visible in case of an existing todo. -->
    <v-card v-if="!editable">
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
        <v-btn @click="setEditable(true)">
          <v-icon>input</v-icon>
        </v-btn>
        <v-btn @click="onDelete()">
          <v-icon>delete</v-icon>
        </v-btn>
      </v-card-actions>
    </v-card>

    <!-- Block visible in case of a new todo. -->
    <v-card v-if="editable">
      <v-card-title>
        <v-form v-model="isValid">
          <!-- Headline -->
          <v-text-field
            :label="$t('todo-entry.title')"
            v-model="pendingTodo.headline"
            v-validate.initial="'required'"
            data-vv-name="title"
            :error-messages="errors.collect('title')">
          </v-text-field>
          <!-- Description -->
          <v-text-field
            multi-line
            :label="$t('todo-entry.description')"
            v-model="pendingTodo.description"
            v-validate.initial="'required'"
            data-vv-name="description"
            :error-messages="errors.collect('description')">
          </v-text-field>

          <!-- Deadline pickers -->
          <v-layout wrap>
            <!-- Date picker modal -->
            <v-dialog
              persistent
              v-model="modals.date"
              ref="dateDialog"
              lazy
              full-width
              width="290px"
              :return-value.sync="deadlineModel.date"
            >
              <v-text-field
                slot="activator"
                :label="$t('todo-entry.deadline-date')"
                v-model="deadlineModel.date"
                prepend-icon="event"
                readonly
                v-validate.initial="'required'"
                data-vv-name="date"
                :error-messages="errors.collect('date')"
              />
              <v-date-picker
                v-model="deadlineModel.date"
                :autosave="!pendingTodo.id"
                scrollable
                actions
                :allowed-dates="isUpcomingDate"
                :first-day-of-week="languagePack.firstDayOfWeek"
                :locale="languagePack.language">
                  <v-spacer />
                  <v-btn flat color="primary" @click="modals.date = false" v-t="'cancel'" />
                  <v-btn flat color="primary" @click="$refs.dateDialog.save(deadlineModel.date)" v-t="'save'"/>
              </v-date-picker>
            </v-dialog>

            <!-- Time picker modal -->
            <v-dialog
              persistent
              ref="timeDialog"
              v-model="modals.time"
              lazy
              full-width
              width="290px"
              :return-value.sync="deadlineModel.time"
            >
              <v-text-field
                slot="activator"
                :label="$t('todo-entry.deadline-time')"
                v-model="deadlineModel.time"
                prepend-icon="access_time"
                readonly
                v-validate.initial="'required'"
                data-vv-name="time"
                :error-messages="errors.collect('time')"
              />
              <v-time-picker
                v-model="deadlineModel.time"
                actions
                :autosave="!pendingTodo.id"
                :format="languagePack.timeFormat">
                <v-spacer />
                <v-btn flat color="primary" @click="modals.time = false" v-t="'cancel'"/>
                <v-btn flat color="primary" @click="$refs.timeDialog.save(deadlineModel.time)" v-t="'save'"/>
              </v-time-picker>
            </v-dialog>

          </v-layout>
        </v-form>
      </v-card-title>
      <v-card-actions>
        <v-btn @click="onSubmit()" :disabled="errors.any()">
          {{ $t('todo-entry.' + (pendingTodo.id ? 'update' : 'submit')) }}
        </v-btn>
        <v-btn @click="onCancel()">
          {{ $t('cancel') }}
        </v-btn>
      </v-card-actions>
    </v-card>

  </v-flex>
</template>

<script lang="ts">
  import { Component, Lifecycle, p, Prop, Vue } from "av-ts";

  import { createNewTodo } from "./state/creators";
  import { TodoModel } from "./state/interfaces";
  import { TODO_MODULE_ACTIONS } from "./state/todo.state";
  import { I18N_MODULE_ACTIONS } from "../i18n/state/i18n.state";
  import { LanguagePack } from "../i18n/languagePack";

  @Component
  export default class TodoEntry extends Vue {
    @Prop
    todo = p({
      type: Object,
      required: false
    }) as TodoModel;

    @Prop
    initialEditable = p({
      type: Boolean,
      required: false
    }) as boolean;

    @Prop
    afterSubmit = p({
      type: Function,
      required: false
    });

    @Prop
    afterCancel = p({
      type: Function,
      required: false
    });

    isValid: boolean = false;

    editable = this.initialEditable || false;
    targetTodo: TodoModel = this.todo
      ? { ...this.todo }
      : ({
        headline: "",
        description: ""
      } as TodoModel);

    pendingTodo: TodoModel | null = null;

    deadlineModel = {
      date: null as string | null,
      time: null as string | null
    };

    modals = {
      date: false,
      time: false
    };

    readonly todayStart = new Date().setHours(0, 0, 0, 0);

    @Lifecycle
    beforeMount(): void {
      if (this.editable) {
        this.pendingTodo = { ...this.targetTodo };
        this.updateDeadlineModel();
      }
    }

    get languagePack(): LanguagePack {
      return this.$store.getters[I18N_MODULE_ACTIONS.GET];
    }

    setEditable(newValue: boolean): void {
      this.editable = newValue;
      // We need a copy of the current model to properly deal with edit/cancel steps.
      if (this.editable) {
        this.pendingTodo = { ...this.targetTodo };
        this.updateDeadlineModel();
      }
    }

    onSubmit(): void {
      if (this.pendingTodo) {
        this.pendingTodo.deadline = this.determineDeadline();
        this.targetTodo = { ...this.pendingTodo };
      }
      this.setEditable(false);
      // If `this.todo` already is a `todo` object,
      // we need to send an UPDATE instead of an ADD.
      if (this.targetTodo.id) {
        this.$store.commit(TODO_MODULE_ACTIONS.UPDATE, this.targetTodo);
      } else {
        this.$store.commit(
          TODO_MODULE_ACTIONS.ADD,
          createNewTodo(
            this.targetTodo.headline,
            this.targetTodo.description,
            this.targetTodo.deadline
          )
        );
      }

      if (this.afterSubmit) {
        this.afterSubmit();
      }
    }

    onDelete(): void {
      if (this.targetTodo.id) {
        this.$store.commit(TODO_MODULE_ACTIONS.DELETE, this.targetTodo.id);
      }
    }

    onCancel(): void {
      if (this.pendingTodo) {
        this.targetTodo = { ...this.pendingTodo };
        this.pendingTodo = null;
      }
      this.setEditable(false);

      if (this.afterCancel) {
        this.afterCancel();
      }
    }

    isUpcomingDate(formattedDate: string): boolean {
      const date = new Date(formattedDate);
      return date.getTime() >= this.todayStart;
    }

    private updateDeadlineModel() {
      if (this.pendingTodo && this.pendingTodo.deadline) {
        const minutes = this.pendingTodo.deadline.getMinutes();
        const [hours, suffix] = this.determineTimeSuffix(
          this.pendingTodo.deadline.getHours()
        );
        this.deadlineModel.time = `${hours}:${minutes}${suffix}`;
        this.deadlineModel.date = this.pendingTodo.deadline
          .toISOString()
          .split("T", 1)[0];
      }
    }

    private determineTimeSuffix(hours: number): [number, string] {
      if (this.languagePack.timeFormat === "24hr") {
        if (hours > 12) {
          return [hours - 12, "pm"];
        } else if (hours === 0) {
          return [12, "am"];
        } else {
          return [hours, "am"];
        }
      } else {
        return [hours, ""];
      }
    }

    private determineDeadline(): Date {
      const date = this.deadlineModel.date as string;
      const time = this.deadlineModel.time as string;

      let targetDate = new Date(date);

      const parsed = /(\d?\d):(\d\d)(am|pm)?/;
      const match: RegExpMatchArray | null = time.match(parsed);
      if (match) {
        let hours = parseInt(match[1], 10);
        const minutes = parseInt(match[2], 10);
        const amPm = match[3];
        switch (amPm) {
          case "am":
            if (hours === 12) {
              // Special case: There is no
              hours = 0;
            }
            break;
          case "pm":
            hours += 12;
            break;
          default:
            break;
        }

        targetDate = new Date(targetDate.setHours(hours, minutes));
      }

      return targetDate;
    }
  }

</script>

<style lang="scss">

  form {
    width: 100%;
  }

</style>