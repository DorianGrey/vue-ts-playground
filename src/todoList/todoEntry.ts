import { Component, Lifecycle, p, Prop, Vue } from "av-ts";
import * as Flatpickr from "flatpickr";

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

  flatpickr: Flatpickr;
  flatpickrOptions: Flatpickr.Options = {
    enableTime: true,
    minDate: new Date(),
    onChange: this.setTodoDeadline.bind(this)
  };

  editable = this.initialEditable || false;
  targetTodo: TodoModel = this.todo
    ? { ...this.todo }
    : {
        headline: "",
        description: ""
      } as TodoModel;

  pendingTodo: TodoModel | null = null;

  unsubscribe: (() => void) | null = null;

  @Lifecycle
  beforeDestroy(): void {
    // Free up memory
    this.flatpickr && this.flatpickr.destroy();
    this.unsubscribe && this.unsubscribe();
  }

  @Lifecycle
  beforeMount(): void {
    if (this.editable) {
      this.pendingTodo = { ...this.targetTodo };
      Vue.nextTick(() => this.initFlatpicker());
    }
    this.$store.subscribe(() => {
      if (this.flatpickr) {
        this.flatpickr.destroy();
        this.initFlatpicker();
      }
    });
  }

  get languagePack(): LanguagePack {
    return this.$store.getters[I18N_MODULE_ACTIONS.GET];
  }

  setTodoDeadline(selectedDates: Date[]) {
    if (this.pendingTodo) {
      this.pendingTodo.deadline = selectedDates[0];
    }
  }

  setEditable(newValue: boolean): void {
    this.editable = newValue;
    // We need a copy of the current model to properly deal with edit/cancel steps.
    if (this.editable === true) {
      this.pendingTodo = { ...this.targetTodo };
      Vue.nextTick(() => this.initFlatpicker());
    } else {
      this.flatpickr && this.flatpickr.destroy();
    }
  }

  onSubmit(): void {
    if (this.pendingTodo) {
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

  private initFlatpicker(): void {
    if (this.pendingTodo) {
      this.flatpickrOptions.defaultDate = this.pendingTodo.deadline;
    }
    this.flatpickrOptions.dateFormat = this.languagePack.flatPickr.dateTimeFormat;
    this.flatpickrOptions.time_24hr = this.languagePack.flatPickr.useTimeFormat_24hrs;
    this.flatpickr = new Flatpickr(
      this.$el.querySelector("#deadlineInput") as HTMLElement,
      this.flatpickrOptions
    );
    // Call is required, since it won't recognize the change by flatpickr otherwise.
    this.$validator.validateAll();
  }
}
