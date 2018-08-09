import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";

import { createNewTodo } from "./state/creators";
import { TodoModel } from "./state/interfaces";
import { TODO_MODULE_ACTIONS } from "./state/todo.state";
import { I18N_MODULE_ACTIONS } from "../../i18n/state/i18n.state";
import { LanguagePack } from "../../i18n/languagePack";

@Component
export default class TodoEntry extends Vue {
  @Prop({ type: Object, required: false })
  todo: TodoModel;

  @Prop({
    type: Boolean,
    required: false
  })
  initialEditable: boolean;

  @Prop({
    type: Function,
    required: false
  })
  afterSubmit: () => void;

  @Prop({
    type: Function,
    required: false
  })
  afterCancel: () => void;

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

  // Lifecycle
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
