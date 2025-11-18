export interface PaginatedResponse<T> {
  data: T[];
  nextPageToken?: string;
  total?: number;
}

export interface PaginationInput {
  limit?: number;
  pageToken?: string;
}

export type SortDirection = "asc" | "desc";

export interface SortInput {
  sort?: Record<string, SortDirection>;
}

export interface WithAudit {
  createdAt?: string;
  createdBy?: string;
  updatedAt?: string;
  updatedBy?: string;
}

export interface CustomFieldValue {
  fieldId: string;
  value: string | number | boolean | string[] | number[] | null;
}

export interface Identifier {
  id: string;
}

export interface Task extends WithAudit {
  id: string;
  name: string;
  description?: string;
  status: TaskStatus;
  priority?: TaskPriority;
  startDate?: string;
  dueDate?: string;
  completedAt?: string;
  projectId: string;
  taskListId?: string;
  assigneeIds?: string[];
  watcherIds?: string[];
  tags?: string[];
  estimatedHours?: number;
  actualHours?: number;
  customFields?: CustomFieldValue[];
}

export type TaskStatus =
  | "not_started"
  | "in_progress"
  | "blocked"
  | "completed"
  | "archived";

export type TaskPriority = "low" | "medium" | "high" | "urgent";

export interface TaskInput {
  name: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  startDate?: string;
  dueDate?: string;
  projectId: string;
  taskListId?: string;
  assigneeIds?: string[];
  watcherIds?: string[];
  tags?: string[];
  estimatedHours?: number;
  customFields?: CustomFieldValue[];
}

export interface Project extends WithAudit {
  id: string;
  name: string;
  description?: string;
  ownerId?: string;
  customerId?: string;
  status: ProjectStatus;
  startDate?: string;
  endDate?: string;
  templateId?: string;
  tags?: string[];
  customFields?: CustomFieldValue[];
}

export type ProjectStatus = "draft" | "active" | "completed" | "archived" | "on_hold";

export interface ProjectInput {
  name: string;
  description?: string;
  ownerId?: string;
  customerId?: string;
  status?: ProjectStatus;
  startDate?: string;
  endDate?: string;
  templateId?: string;
  tags?: string[];
  customFields?: CustomFieldValue[];
}

export interface Customer extends WithAudit {
  id: string;
  name: string;
  domain?: string;
  primaryContactId?: string;
  health?: "red" | "yellow" | "green";
  tags?: string[];
  customFields?: CustomFieldValue[];
}

export interface CustomerInput {
  name: string;
  domain?: string;
  primaryContactId?: string;
  health?: "red" | "yellow" | "green";
  tags?: string[];
  customFields?: CustomFieldValue[];
}

export interface TaskList extends WithAudit {
  id: string;
  name: string;
  projectId: string;
  description?: string;
  order?: number;
}

export interface TaskListInput {
  name: string;
  description?: string;
  order?: number;
}

export interface Template extends WithAudit {
  id: string;
  name: string;
  description?: string;
  category?: string;
  tags?: string[];
}

export interface TemplateInput {
  name: string;
  description?: string;
  category?: string;
  tags?: string[];
}

export interface TimeEntry extends WithAudit {
  id: string;
  taskId?: string;
  projectId: string;
  userId: string;
  notes?: string;
  date: string;
  durationMinutes: number;
  billable?: boolean;
}

export interface TimeEntryInput {
  taskId?: string;
  projectId: string;
  userId: string;
  notes?: string;
  date: string;
  durationMinutes: number;
  billable?: boolean;
}

export interface Comment extends WithAudit {
  id: string;
  body: string;
  authorId: string;
  taskId?: string;
  projectId?: string;
  attachments?: Attachment[];
}

export interface Attachment {
  id: string;
  name: string;
  mimeType: string;
  size: number;
  url: string;
}

export interface FormResponse extends WithAudit {
  id: string;
  formId: string;
  projectId?: string;
  customerId?: string;
  submittedBy?: string;
  answers: Record<string, unknown>;
}

export interface FormResponseInput {
  formId: string;
  projectId?: string;
  customerId?: string;
  answers: Record<string, unknown>;
}

export interface User extends WithAudit {
  id: string;
  name: string;
  email: string;
  role: string;
  timezone?: string;
  locale?: string;
  isActive: boolean;
}

export interface Team extends WithAudit {
  id: string;
  name: string;
  description?: string;
  memberIds?: string[];
}

export interface TeamInput {
  name: string;
  description?: string;
  memberIds?: string[];
}

export interface InviteInput {
  email: string;
  role: string;
  timezone?: string;
  locale?: string;
}

export interface TaskAssignment {
  taskId: string;
  userId: string;
}

export interface BulkResult<T> {
  successes: T[];
  failures: Array<{ identifier: Identifier; error: string }>;
}
