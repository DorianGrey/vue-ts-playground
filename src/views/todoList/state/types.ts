import isNumber from "lodash-es/isNumber";

let todoId = 1;

export class TodoModel {
  id: number;

  static newSkeleton(): TodoModel {
    return new TodoModel(
      "",
      "",
      (null as any) as Date,
      (null as any) as Date,
      true,
      0
    );
  }

  constructor(
    public headline: string,
    public description: string,
    public deadline: Date,
    public created: Date = new Date(),
    public editable: boolean = false,
    id?: number
  ) {
    if (isNumber(id)) {
      this.id = id;
    } else {
      this.id = todoId;
      todoId++;
    }
  }

  withEditMode(editable: boolean): TodoModel {
    return new TodoModel(
      this.headline,
      this.description,
      this.deadline,
      this.created,
      editable,
      this.id
    );
  }

  copy(
    headline: string = this.headline,
    description: string = this.description,
    deadline: Date = this.deadline,
    created: Date = this.created,
    editable: boolean = this.editable
  ): TodoModel {
    return new TodoModel(
      headline,
      description,
      deadline,
      created,
      editable,
      this.id
    );
  }
}

export interface TodoState {
  todoList: TodoModel[];
}
