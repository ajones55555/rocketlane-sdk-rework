# Rocketlane TypeScript SDK

A fully-typed, zero-dependency SDK for interacting with the [Rocketlane public API](https://developer.rocketlane.com/reference/tasks). The client wraps every public resource, respects Rocketlane's dotted query parameter format, and automatically injects the `x-api-key` header that Rocketlane expects instead of a Bearer token.

## Features

- 🌐 Works in both Node.js (>= 18) and modern browsers via the native `fetch` API
- 🔐 Handles Rocketlane's custom authentication headers (`x-api-key` + optional `x-workspace-id`)
- 🧭 Query helper that converts nested objects into Rocketlane's period-delimited query params (`filter.status`, `include.assignees`, etc.)
- 🧱 Resource-specific helpers for tasks, projects, customers, templates, task lists, forms, users, teams, and time entries
- 🧾 Automatic pagination metadata + convenience wrappers for bulk actions (assignments, status updates, etc.)
- ⚠️ Rich `RocketlaneError` objects with HTTP status codes and server-provided details

## Installation

```bash
npm install rocketlane-sdk
```

> **Note:** The SDK has no runtime dependencies. TypeScript typings are generated during `npm run build`.

## Quick start

```ts
import { RocketlaneClient } from "rocketlane-sdk";

const client = new RocketlaneClient({
  apiKey: process.env.ROCKETLANE_API_KEY!,
  workspaceId: "acme-implementation", // optional
  baseUrl: "https://api.rocketlane.com/v1", // default value
});

// list tasks with Rocketlane's dotted query format
const tasks = await client.tasks.list({
  filter: {
    projectId: "proj_123",
    status: ["in_progress", "blocked"],
    due: { to: new Date().toISOString() },
  },
  include: { assignees: true, checklist: true },
  limit: 50,
});

// update a task
await client.tasks.update("task_42", {
  name: "Kick-off call",
  status: "completed",
});

// add a comment using Rocketlane's special resources
await client.tasks.addComment("task_42", {
  body: "Waiting on customer availability.",
  isInternal: true,
});
```

### Dry-run any request

Pass `dryRun: true` to any operation (or configure it at the client level) to log the exact `curl` command without executing the
request:

```ts
const preview = new RocketlaneClient({
  apiKey: process.env.ROCKETLANE_API_KEY!,
  dryRun: true,
  dryRunLogger: (command) => console.info(`[rocketlane] ${command}`),
});

await preview.tasks.update("task_42", { status: "completed" });
// logs: [rocketlane] curl -X PATCH 'https://api.rocketlane.com/v1/tasks/task_42' -H 'x-api-key: ...' --data '{...}'

// You can also scope it to a single call:
await client.projects.create({ name: "Demo" }, { dryRun: true });
```

### Handling errors

Every non-2xx response throws a `RocketlaneError` that contains the HTTP status code and any error payload returned by Rocketlane:

```ts
try {
  await client.projects.delete("proj_missing");
} catch (error) {
  if (error instanceof RocketlaneError) {
    console.error(error.status, error.details);
  }
}
```

## Resources

| Resource | Module | Highlights |
| --- | --- | --- |
| Tasks | `client.tasks` | Filtering, dotted includes, bulk status changes, assignments, comments, checklists, time-entry linking |
| Projects | `client.projects` | Archive/unarchive, clone, task listing, summary snapshots, template discovery |
| Customers | `client.customers` | Health filtering and project rollups |
| Task lists | `client.taskLists` | Nested task CRUD inside a list |
| Templates | `client.templates` | Category/tag filtering plus publish helper |
| Time entries | `client.timeEntries` | Date-range filtering and approvals |
| Forms | `client.forms` | Retrieve submitted form responses scoped by project/customer |
| Users | `client.users` | Invite/activate/deactivate members |
| Teams | `client.teams` | Member management helpers |

Every resource inherits the base CRUD helpers (`list`, `retrieve`, `create`, `update`, `delete`) while adding bespoke helpers documented above.

## Query helper

Need to build Rocketlane's nested query params manually? Import the helper directly:

```ts
import { buildQueryString } from "rocketlane-sdk";

const qs = buildQueryString({
  filter: { status: "in_progress", due: { to: "2024-05-01" } },
  include: { assignees: true },
});

// => ?filter.status=in_progress&filter.due.to=2024-05-01&include.assignees=true
```

## Development scripts

```bash
npm run lint   # type-check
npm run build  # emit dist/ with ESM + declaration files
```

## License

MIT © 2025
