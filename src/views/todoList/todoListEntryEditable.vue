<template>
  <v-flex xs10 offset-xs1>
    <v-card>
      <v-card-title>
        <v-form v-model="isValid">
          <!-- Headline -->
          <v-text-field
            :label="$t('todo-entry.title')"
            v-model="pendingTodo.headline"
            v-validate.initial="'required'"
            data-vv-name="title"
            :error-messages="errors.collect('title')"
          >
          </v-text-field>
          <!-- Description -->
          <v-textarea
            :label="$t('todo-entry.description')"
            v-model="pendingTodo.description"
            v-validate.initial="'required'"
            data-vv-name="description"
            :error-messages="errors.collect('description')"
          >
          </v-textarea>

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
                :locale="languagePack.language"
              >
                <v-spacer />
                <v-btn
                  flat
                  color="primary"
                  @click="modals.date = false"
                  v-t="'cancel'"
                />
                <v-btn
                  flat
                  color="primary"
                  @click="$refs.dateDialog.save(deadlineModel.date)"
                  v-t="'save'"
                />
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
                :format="languagePack.timeFormat"
              >
                <v-spacer />
                <v-btn
                  flat
                  color="primary"
                  @click="modals.time = false"
                  v-t="'cancel'"
                />
                <v-btn
                  flat
                  color="primary"
                  @click="$refs.timeDialog.save(deadlineModel.time)"
                  v-t="'save'"
                />
              </v-time-picker>
            </v-dialog>
          </v-layout>
        </v-form>
      </v-card-title>
      <v-card-actions>
        <v-btn @click="onSubmit()" :disabled="errors.any()">
          {{ $t("todo-entry." + (pendingTodo.id ? "update" : "submit")) }}
        </v-btn>
        <v-btn @click="onCancel()"> {{ $t("cancel") }} </v-btn>
      </v-card-actions>
    </v-card>
  </v-flex>
</template>

<script lang="ts" src="./todoListEntryEditable.ts"></script>

<style scoped>
form {
  width: 100%;
}
</style>
