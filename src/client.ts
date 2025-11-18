import { HttpClient, HttpClientOptions } from "./httpClient.js";
import {
  CustomersResource,
  FormsResource,
  ProjectsResource,
  TaskListsResource,
  TasksResource,
  TeamsResource,
  TemplatesResource,
  TimeEntriesResource,
  UsersResource,
} from "./resources/index.js";

export type RocketlaneClientOptions = HttpClientOptions;

export class RocketlaneClient {
  public readonly tasks: TasksResource;
  public readonly projects: ProjectsResource;
  public readonly customers: CustomersResource;
  public readonly taskLists: TaskListsResource;
  public readonly templates: TemplatesResource;
  public readonly timeEntries: TimeEntriesResource;
  public readonly teams: TeamsResource;
  public readonly users: UsersResource;
  public readonly forms: FormsResource;

  private readonly http: HttpClient;

  constructor(options: RocketlaneClientOptions) {
    this.http = new HttpClient(options);
    this.tasks = new TasksResource(this.http);
    this.projects = new ProjectsResource(this.http);
    this.customers = new CustomersResource(this.http);
    this.taskLists = new TaskListsResource(this.http);
    this.templates = new TemplatesResource(this.http);
    this.timeEntries = new TimeEntriesResource(this.http);
    this.teams = new TeamsResource(this.http);
    this.users = new UsersResource(this.http);
    this.forms = new FormsResource(this.http);
  }

  withWorkspace(workspaceId: string): RocketlaneClient {
    return new RocketlaneClient({
      ...this.getOptions(),
      workspaceId,
    });
  }

  private getOptions(): HttpClientOptions {
    return { ...this.http.options };
  }
}
