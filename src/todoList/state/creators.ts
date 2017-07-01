import { TodoModel } from "./interfaces";

let todoId = 1;

export function createNewTodo(
  headline: string,
  description: string
): TodoModel {
  todoId++;
  return {
    id: todoId,
    headline,
    description,
    deadline: new Date(Date.now() + 3600000),
    created: new Date()
  };
}
