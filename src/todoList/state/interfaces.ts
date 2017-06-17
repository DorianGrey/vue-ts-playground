export interface TodoModel {
  id: number;
  headline: string;
  description: string;
  deadline: Date;
  created: Date;
}

export interface TodoState {
  todoList: TodoModel[];
}
