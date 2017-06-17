export interface TodoModel {
  id: number;
  headline: string;
  description: string;
  deadline: Date;
  created: Date;
}

export const initialTodoState: TodoModel[] = [
  {
    id:          1,
    headline:    "Test todo",
    description: "A lot of stuff to be done!",
    deadline:    new Date(),
    created:     new Date()
  }
];
