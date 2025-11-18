import { BaseResource, ListQuery, OperationOptions } from "./base.js";
import {
  PaginatedResponse,
  Project,
  ProjectInput,
  ProjectStatus,
  Task,
  Template,
} from "../types.js";
import { HttpClient } from "../httpClient.js";

export interface ProjectFilter {
  status?: ProjectStatus | ProjectStatus[];
  templateId?: string;
  customerId?: string;
  ownerId?: string;
  tag?: string;
  search?: string;
  startDate?: { from?: string; to?: string };
  endDate?: { from?: string; to?: string };
}

export type ListProjectsQuery = ListQuery<ProjectFilter> & {
  include?: {
    tasks?: boolean;
    taskLists?: boolean;
    template?: boolean;
    customer?: boolean;
  };
};

export interface CloneProjectInput {
  projectId: string;
  name?: string;
  startDate?: string;
}

export interface ProjectSummary {
  id: string;
  name: string;
  status: ProjectStatus;
  health?: "red" | "yellow" | "green";
  taskCount?: number;
  overdueTasks?: number;
}

export class ProjectsResource extends BaseResource<Project, ProjectInput> {
  constructor(client: HttpClient) {
    super(client, "/projects");
  }

  override list(
    query?: ListProjectsQuery,
    options?: OperationOptions,
  ): Promise<PaginatedResponse<Project>> {
    return this.request<PaginatedResponse<Project>>({
      path: "",
      query,
      ...(options ?? {}),
    }).then((response) => response.data);
  }

  archive(projectId: string, options?: OperationOptions): Promise<Project> {
    return this.request<Project>({
      method: "POST",
      path: `/${projectId}/archive`,
      ...(options ?? {}),
    }).then((response) => response.data);
  }

  unarchive(projectId: string, options?: OperationOptions): Promise<Project> {
    return this.request<Project>({
      method: "POST",
      path: `/${projectId}/unarchive`,
      ...(options ?? {}),
    }).then((response) => response.data);
  }

  clone(payload: CloneProjectInput, options?: OperationOptions): Promise<Project> {
    return this.request<Project>({
      method: "POST",
      path: "/clone",
      body: payload,
      ...(options ?? {}),
    }).then((response) => response.data);
  }

  summary(options?: OperationOptions): Promise<ProjectSummary[]> {
    return this.request<ProjectSummary[]>({
      path: "/summary",
      ...(options ?? {}),
    }).then((response) => response.data);
  }

  listTasks(
    projectId: string,
    query?: ListQuery<Record<string, unknown>>,
    options?: OperationOptions,
  ): Promise<PaginatedResponse<Task>> {
    return this.request<PaginatedResponse<Task>>({
      path: `/${projectId}/tasks`,
      query,
      ...(options ?? {}),
    }).then((response) => response.data);
  }

  listTemplates(options?: OperationOptions): Promise<Template[]> {
    return this.request<Template[]>({
      path: "/templates",
      ...(options ?? {}),
    }).then((response) => response.data);
  }
}
