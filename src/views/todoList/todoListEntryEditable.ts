import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";
import { TodoModel } from "./state/types";
import { TODO_MODULE_MUTATIONS, TodoSpace } from "./state/todo.state";
import { I18N_MODULE_GETTERS, I18nSpace } from "@/i18n/state/i18n.state";
import { LanguagePack } from "@/i18n/languagePack";

@Component
export default class TodoListEntryDisplay extends Vue {
  @I18nSpace.Getter(I18N_MODULE_GETTERS.GET)
  readonly languagePack: LanguagePack;

  @TodoSpace.Mutation(TODO_MODULE_MUTATIONS.ADD)
  readonly addTodo: (target: TodoModel) => void;

  @TodoSpace.Mutation(TODO_MODULE_MUTATIONS.UPDATE)
  readonly updateTodo: (target: TodoModel) => void;

  @TodoSpace.Mutation(TODO_MODULE_MUTATIONS.DELETE)
  readonly deleteTodo: (target: number) => void;

  @TodoSpace.Mutation(TODO_MODULE_MUTATIONS.SET_READONLY)
  readonly setReadonly: (target: number) => void;

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

  @Prop({ type: Object, required: false })
  todo?: TodoModel;

  isValid: boolean = false;
  targetTodo: TodoModel = this.todo
    ? this.todo.copy()
    : TodoModel.newSkeleton();

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
    this.pendingTodo = this.targetTodo.copy();
    this.updateDeadlineModel();
  }

  onSubmit(): void {
    if (this.pendingTodo) {
      this.pendingTodo.deadline = this.determineDeadline();
      this.targetTodo = this.pendingTodo.copy();
    }
    // If `this.todo` already is a `todo` object,
    // we need to send an UPDATE instead of an ADD.
    if (this.targetTodo.id) {
      this.updateTodo(this.targetTodo);
    } else {
      this.addTodo(
        new TodoModel(
          this.targetTodo.headline,
          this.targetTodo.description,
          this.targetTodo.deadline
        )
      );
    }

    if (this.afterSubmit) {
      this.afterSubmit();
    }

    this.signalExitEditMode();
  }

  onCancel(): void {
    if (this.pendingTodo) {
      this.targetTodo = this.pendingTodo.copy();
      this.pendingTodo = null;
    }

    if (this.afterCancel) {
      this.afterCancel();
    }

    this.signalExitEditMode();
  }

  isUpcomingDate(formattedDate: string): boolean {
    const date = new Date(formattedDate);
    return date.getTime() >= this.todayStart;
  }

  signalExitEditMode() {
    this.setReadonly(this.targetTodo.id);
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
