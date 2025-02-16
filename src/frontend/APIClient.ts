import { ApplicationData, FormSubmission } from '../shared/data';

type HTTPMethod = 'delete' | 'get' | 'head' | 'patch' | 'post' | 'put';

interface RequestOptions<T> {
  url: string;
  method?: HTTPMethod;
  headers?: HeadersInit;
  payload?: T;
}

class RequestError extends Error {
  public override name = 'RequestError';
  public constructor(public readonly code: number) {
    super(`Request failed with status code ${code}`);
  }
}

export class APIClient {
  public async getData(): Promise<ApplicationData[]> {
    return await this.request<ApplicationData[]>(`/api/data`);
  }

  public async postEntry(entry: FormSubmission) {
    await this.request({
      url: `/api/data`,
      method: `post`,
      payload: entry,
    });
  }

  public async deleteEntry(id: string) {
    await this.request({
      url: `/api/data/${id}`,
      method: 'delete',
    });
  }

  public async newUser(username: string, password: string) {
    await this.request({
      url: `/api/signup`,
      method: `post`,
      payload: {
        username,
        password,
      },
    });
  }

  public async authenticate(username: string, password: string) {
    await this.request({
      url: `/api/login`,
      method: 'post',
      payload: {
        username,
        password,
      },
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
  public async request<T extends object | void = void>(
    opts: RequestOptions<object | undefined> | string,
  ): Promise<T> {
    opts = typeof opts === 'object' ? opts : { url: opts };

    const { payload, url, headers: initialHeaders = {}, method = 'get' } = opts;

    const headers = new Headers(initialHeaders);

    if (payload) {
      headers.append('Content-Type', 'application/json; charset=utf-8');
    }

    const response = await fetch(url, {
      body: payload ? JSON.stringify(payload) : undefined,
      headers,
      method: method.toUpperCase(),
    });

    const { status } = response;
    const body = await response.text();

    let parsedResponse: unknown;

    if (body !== '') {
      parsedResponse = JSON.parse(body, restoreDate) as unknown;
    }

    if (status >= 200 && status <= 299) {
      return parsedResponse as T;
    }

    throw new RequestError(status);
  }
}

// JSON is so cool except for this BS.

const isoDateMatch = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?Z$/;

const restoreDate = (_key: string, value: unknown) => {
  if (typeof value === 'string' && isoDateMatch.test(value)) {
    return new Date(value);
  }

  return value;
};
