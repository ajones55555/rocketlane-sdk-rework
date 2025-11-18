import { buildQueryString, QueryParams } from "./query.js";

export type FetchLike = (input: RequestInfo, init?: RequestInit) => Promise<Response>;

export interface HttpClientOptions {
  apiKey: string;
  workspaceId?: string;
  baseUrl?: string;
  fetch?: FetchLike;
  timeoutMs?: number;
  defaultHeaders?: Record<string, string>;
  apiKeyHeaderName?: string;
  workspaceHeaderName?: string;
  dryRun?: boolean;
  dryRunLogger?: (command: string) => void;
}

export interface RequestOptions {
  method?: string;
  path: string;
  query?: QueryParams;
  body?: unknown;
  headers?: Record<string, string>;
  signal?: AbortSignal;
  dryRun?: boolean;
  dryRunLogger?: (command: string) => void;
}

export interface HttpResponse<T> {
  data: T;
  status: number;
  headers: Headers;
}

export class RocketlaneError<T = unknown> extends Error {
  public readonly status: number;
  public readonly details?: T;

  constructor(message: string, status: number, details?: T) {
    super(message);
    this.name = "RocketlaneError";
    this.status = status;
    this.details = details;
  }
}

export class HttpClient {
  public readonly options: Readonly<HttpClientOptions>;
  private readonly baseUrl: string;
  private readonly fetchImpl: FetchLike;
  private readonly apiKey: string;
  private readonly workspaceId?: string;
  private readonly timeoutMs?: number;
  private readonly defaultHeaders: Record<string, string>;
  private readonly apiKeyHeader: string;
  private readonly workspaceHeader: string;
  private readonly dryRunDefault: boolean;
  private readonly dryRunLogger?: (command: string) => void;

  constructor(options: HttpClientOptions) {
    if (!options.apiKey) {
      throw new Error("Rocketlane API key is required");
    }

    this.options = { ...options };
    const base = options.baseUrl ?? "https://api.rocketlane.com/v1";
    this.baseUrl = base.endsWith("/") ? base : `${base}/`;
    this.apiKey = options.apiKey;
    this.workspaceId = options.workspaceId;
    this.fetchImpl = options.fetch ?? globalThis.fetch?.bind(globalThis);
    this.timeoutMs = options.timeoutMs;
    this.defaultHeaders = options.defaultHeaders ?? {};
    this.apiKeyHeader = options.apiKeyHeaderName ?? "x-api-key";
    this.workspaceHeader = options.workspaceHeaderName ?? "x-workspace-id";
    this.dryRunDefault = Boolean(options.dryRun);
    this.dryRunLogger = options.dryRunLogger;

    if (!this.fetchImpl) {
      throw new Error("A fetch implementation must be provided when running outside environments that offer global fetch");
    }
  }

  async request<T>({
    method = "GET",
    path,
    query,
    body,
    headers,
    signal,
    dryRun,
    dryRunLogger,
  }: RequestOptions): Promise<HttpResponse<T>> {
    const url = new URL(path.replace(/^\//, ""), this.baseUrl);
    const queryString = buildQueryString(query);
    const requestUrl = `${url}${queryString}`;

    const controller = new AbortController();
    const timeoutId = this.timeoutMs
      ? setTimeout(() => controller.abort(), this.timeoutMs)
      : undefined;

    const mergedSignal = signal
      ? this.mergeSignals(signal, controller.signal)
      : controller.signal;

    const headerInit: Record<string, string> = {
      [this.apiKeyHeader]: this.apiKey,
      ...(this.workspaceId ? { [this.workspaceHeader]: this.workspaceId } : {}),
      ...this.defaultHeaders,
      ...headers,
    };

    if (!(body instanceof FormData)) {
      headerInit["content-type"] = headerInit["content-type"] ?? "application/json";
    }

    const finalHeaders = new Headers(headerInit);

    const serializedBody = body instanceof FormData ? body : body === undefined ? undefined : JSON.stringify(body);

    const isDryRun = dryRun ?? this.dryRunDefault;
    const dryLogger = dryRunLogger ?? this.dryRunLogger ?? ((command: string) => console.log(command));

    if (isDryRun) {
      const curl = this.buildCurlCommand(method, requestUrl, finalHeaders, serializedBody);
      dryLogger(curl);
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      return { data: undefined as T, status: 0, headers: new Headers() };
    }

    const response = await this.fetchImpl(requestUrl, {
      method,
      headers: finalHeaders,
      body: serializedBody,
      signal: mergedSignal,
    }).finally(() => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    });

    const data = await this.parseResponse<T>(response);

    return { data, status: response.status, headers: response.headers };
  }

  private async parseResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      let message = response.statusText || "Rocketlane request failed";
      let details: unknown;
      try {
        details = await response.json();
        const errorMessage = (details as Record<string, unknown>)?.["message"];
        if (typeof errorMessage === "string") {
          message = errorMessage;
        }
      } catch {
        details = await response.text();
      }

      throw new RocketlaneError(message, response.status, details);
    }

    if (response.status === 204) {
      return undefined as T;
    }

    const contentType = response.headers.get("content-type") ?? "";

    if (contentType.includes("application/json")) {
      return (await response.json()) as T;
    }

    return (await response.text()) as T;
  }

  private mergeSignals(...signals: AbortSignal[]): AbortSignal {
    const controller = new AbortController();

    const onAbort = () => controller.abort();
    signals.forEach((signal) => {
      if (signal.aborted) {
        controller.abort(signal.reason);
      } else {
        signal.addEventListener("abort", onAbort, { once: true });
      }
    });

    return controller.signal;
  }

  private buildCurlCommand(
    method: string,
    url: string,
    headers: Headers,
    body?: BodyInit | null,
  ): string {
    const parts: string[] = [`curl -X ${method.toUpperCase()} '${escapeSingleQuotes(url)}'`];

    headers.forEach((value, key) => {
      parts.push(`-H '${escapeSingleQuotes(`${key}: ${value}`)}'`);
    });

    if (body instanceof FormData) {
      parts.push("--form '[form-data omitted]'");
    } else if (typeof body === "string") {
      parts.push(`--data '${escapeSingleQuotes(body)}'`);
    }

    return parts.join(" \\\n  ");
  }
}

function escapeSingleQuotes(value: string): string {
  return value.replace(/'/g, "'\\''");
}
