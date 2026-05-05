type HttpMethod = 'GET' | 'POST' | 'PATCH' | 'DELETE';

type ApiRequestOptions = {
  body?: unknown;
  query?: Record<string, string | number | boolean | null | undefined>;
  headers?: HeadersInit;
  token?: string | null;
  auth?: boolean;
};

type ApiSuccessResponse<T> = {
  success: true;
  data: T;
  message?: string;
  timestamp: string;
  path: string;
};

type ApiErrorResponse = {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
  timestamp: string;
  path: string;
};

type LegacyApiErrorResponse = {
  message?: string | string[];
  error?: string;
};

export type ApiError = {
  code: string;
  status: number;
  message: string;
  details?: unknown;
};

function isApiErrorResponse(data: unknown): data is ApiErrorResponse {
  return (
    typeof data === 'object' &&
    data !== null &&
    'success' in data &&
    data.success === false &&
    'error' in data
  );
}

function isLegacyApiErrorResponse(data: unknown): data is LegacyApiErrorResponse {
  return typeof data === 'object' && data !== null;
}

function normalizeApiError(error: unknown): ApiError {
  if (typeof error === 'object' && error !== null) {
    const fetchError = error as {
      status?: number;
      statusCode?: number;
      statusMessage?: string;
      message?: string;
      data?: ApiErrorResponse | LegacyApiErrorResponse;
    };

    if (isApiErrorResponse(fetchError.data)) {
      return {
        code: fetchError.data.error.code,
        status: fetchError.statusCode ?? fetchError.status ?? 500,
        message: fetchError.data.error.message,
        details: fetchError.data.error.details,
      };
    }

    const message = isLegacyApiErrorResponse(fetchError.data)
      ? fetchError.data.message
      : undefined;
    const legacyError = isLegacyApiErrorResponse(fetchError.data)
      ? fetchError.data.error
      : undefined;

    return {
      code: 'API_ERROR',
      status: fetchError.statusCode ?? fetchError.status ?? 500,
      message: Array.isArray(message)
        ? message.join(', ')
        : message ?? legacyError ?? fetchError.statusMessage ?? fetchError.message ?? 'Something went wrong.',
      details: fetchError.data,
    };
  }

  return {
    code: 'API_ERROR',
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
      const response = await $fetch<ApiSuccessResponse<T>>(endpoint, {
        baseURL: config.public.apiBase,
        method,
        body: options.body as BodyInit | Record<string, unknown> | null | undefined,
        query: options.query,
        headers,
      });

      return response.data;
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
