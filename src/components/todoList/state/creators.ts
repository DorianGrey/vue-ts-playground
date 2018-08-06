import { TodoModel } from "./interfaces";

let todoId = 2;

export function createNewTodo(
  headline: string,
  description: string,
  deadline: Date
): TodoModel {
  todoId++;
  return {
    id: todoId,
    headline,
    description,
    deadline,
    created: new Date()
  };
}
