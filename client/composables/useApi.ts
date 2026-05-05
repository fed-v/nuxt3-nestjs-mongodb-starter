type HttpMethod = 'GET' | 'POST' | 'PATCH' | 'DELETE';

type ApiRequestOptions = {
  body?: unknown;
  query?: Record<string, string | number | boolean | null | undefined>;
  headers?: HeadersInit;
  token?: string | null;
  auth?: boolean;
};

export type ApiError = {
  status: number;
  message: string;
  details?: unknown;
};

function normalizeApiError(error: unknown): ApiError {
  if (typeof error === 'object' && error !== null) {
    const fetchError = error as {
      status?: number;
      statusCode?: number;
      statusMessage?: string;
      message?: string;
      data?: {
        message?: string | string[];
        error?: string;
      };
    };

    const message = fetchError.data?.message;

    return {
      status: fetchError.statusCode ?? fetchError.status ?? 500,
      message: Array.isArray(message)
        ? message.join(', ')
        : message ?? fetchError.data?.error ?? fetchError.statusMessage ?? fetchError.message ?? 'Something went wrong.',
      details: fetchError.data,
    };
  }

  return {
    status: 500,
    message: 'Something went wrong.',
  };
}

export function useApi() {
  const config = useRuntimeConfig();
  const authToken = useCookie<string | null>('auth_token');

  async function request<T>(method: HttpMethod, endpoint: string, options: ApiRequestOptions = {}) {
    const headers = new Headers(options.headers);

    if (!headers.has('Accept')) {
      headers.set('Accept', 'application/json');
    }

    if (options.body && !headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }

    const token = options.token ?? authToken.value;

    if (options.auth !== false && token) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    try {
      return await $fetch<T>(endpoint, {
        baseURL: config.public.apiBase,
        method,
        body: options.body as BodyInit | Record<string, unknown> | null | undefined,
        query: options.query,
        headers,
      });
    } catch (error) {
      throw normalizeApiError(error);
    }
  }

  return {
    get: <T>(endpoint: string, options?: ApiRequestOptions) => request<T>('GET', endpoint, options),
    post: <T>(endpoint: string, body?: unknown, options?: ApiRequestOptions) => request<T>('POST', endpoint, { ...options, body }),
    patch: <T>(endpoint: string, body?: unknown, options?: ApiRequestOptions) => request<T>('PATCH', endpoint, { ...options, body }),
    delete: <T>(endpoint: string, options?: ApiRequestOptions) => request<T>('DELETE', endpoint, options),
  };
}
