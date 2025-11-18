import { BaseResource, ListQuery, OperationOptions } from "./base.js";
import { PaginatedResponse, Task, TaskInput, TaskList, TaskListInput } from "../types.js";
import { HttpClient } from "../httpClient.js";

export interface TaskListFilter {
  projectId?: string;
  search?: string;
}

export type ListTaskListsQuery = ListQuery<TaskListFilter>;

export class TaskListsResource extends BaseResource<TaskList, TaskListInput> {
  constructor(client: HttpClient) {
    super(client, "/task-lists");
  }

  override list(
    query?: ListTaskListsQuery,
    options?: OperationOptions,
  ): Promise<PaginatedResponse<TaskList>> {
    return this.request<PaginatedResponse<TaskList>>({
      path: "",
      query,
      ...(options ?? {}),
    }).then((response) => response.data);
  }

  listTasks(
    taskListId: string,
    query?: ListQuery<Record<string, unknown>>,
    options?: OperationOptions,
  ): Promise<PaginatedResponse<Task>> {
    return this.request<PaginatedResponse<Task>>({
      path: `/${taskListId}/tasks`,
      query,
      ...(options ?? {}),
    }).then((response) => response.data);
  }

  createTask(taskListId: string, payload: TaskInput, options?: OperationOptions): Promise<Task> {
    return this.request<Task>({
      method: "POST",
      path: `/${taskListId}/tasks`,
      body: payload,
      ...(options ?? {}),
    }).then((response) => response.data);
  }
}
