import { BaseResource, ListQuery, OperationOptions } from "./base.js";
import {
  Attachment,
  BulkResult,
  Comment,
  PaginatedResponse,
  Task,
  TaskAssignment,
  TaskInput,
  TaskPriority,
  TaskStatus,
} from "../types.js";
import { HttpClient } from "../httpClient.js";

export interface TaskFilter {
  projectId?: string;
  taskListId?: string;
  status?: TaskStatus | TaskStatus[];
  priority?: TaskPriority | TaskPriority[];
  assigneeId?: string;
  watcherId?: string;
  tag?: string;
  search?: string;
  due?: {
    from?: string;
    to?: string;
  };
  start?: {
    from?: string;
    to?: string;
  };
  customFields?: Record<string, string | number | boolean>;
}

export type ListTasksQuery = ListQuery<TaskFilter> & {
  include?: {
    assignees?: boolean;
    watchers?: boolean;
    checklist?: boolean;
    customFields?: boolean;
    timeEntries?: boolean;
  };
};

export interface CommentInput {
  body: string;
  attachments?: Attachment[];
  isInternal?: boolean;
}

export interface ChecklistItemInput {
  id?: string;
  label: string;
  isDone?: boolean;
}

export interface UpdateChecklistInput {
  items: ChecklistItemInput[];
}

export class TasksResource extends BaseResource<Task, TaskInput> {
  constructor(client: HttpClient) {
    super(client, "/tasks");
  }

  override list(
    query?: ListTasksQuery,
    options?: OperationOptions,
  ): Promise<PaginatedResponse<Task>> {
    return this.request<PaginatedResponse<Task>>({
      path: "",
      query,
      ...(options ?? {}),
    }).then((response) => response.data);
  }

  bulkUpdateStatus(
    taskIds: string[],
    status: TaskStatus,
    options?: OperationOptions,
  ): Promise<BulkResult<Task>> {
    return this.request<BulkResult<Task>>({
      method: "POST",
      path: "/bulk/status",
      body: {
        taskIds,
        status,
      },
      ...(options ?? {}),
    }).then((response) => response.data);
  }

  assign(assignments: TaskAssignment[], options?: OperationOptions): Promise<BulkResult<TaskAssignment>> {
    return this.request<BulkResult<TaskAssignment>>({
      method: "POST",
      path: "/assignments",
      body: { assignments },
      ...(options ?? {}),
    }).then((response) => response.data);
  }

  addComment(taskId: string, payload: CommentInput, options?: OperationOptions): Promise<Comment> {
    return this.request<Comment>({
      method: "POST",
      path: `/${taskId}/comments`,
      body: payload,
      ...(options ?? {}),
    }).then((response) => response.data);
  }

  listComments(taskId: string, options?: OperationOptions): Promise<Comment[]> {
    return this.request<Comment[]>({
      path: `/${taskId}/comments`,
      ...(options ?? {}),
    }).then((response) => response.data);
  }

  updateChecklist(
    taskId: string,
    payload: UpdateChecklistInput,
    options?: OperationOptions,
  ): Promise<Task> {
    return this.request<Task>({
      method: "PUT",
      path: `/${taskId}/checklist`,
      body: payload,
      ...(options ?? {}),
    }).then((response) => response.data);
  }

  linkTimeEntry(taskId: string, timeEntryId: string, options?: OperationOptions): Promise<void> {
    return this.request<void>({
      method: "POST",
      path: `/${taskId}/time-entries`,
      body: { timeEntryId },
      ...(options ?? {}),
    }).then(() => undefined);
  }
}
