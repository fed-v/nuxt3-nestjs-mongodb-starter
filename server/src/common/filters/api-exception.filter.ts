import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ApiErrorResponse } from '../interfaces/api-response.interface';

type ExceptionResponse = {
  code?: string;
  message?: string | string[];
  error?: string;
  details?: unknown;
};

@Catch()
export class ApiExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    const request = context.getRequest<Request>();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    const exceptionResponse = this.getExceptionResponse(exception);

    const body: ApiErrorResponse = {
      success: false,
      error: {
        code: exceptionResponse.code ?? this.getErrorCode(status),
        message: this.getErrorMessage(status, exceptionResponse),
        details: exceptionResponse.details,
      },
      timestamp: new Date().toISOString(),
      path: request.url,
    };

    response.status(status).json(body);
  }

  private getExceptionResponse(exception: unknown): ExceptionResponse {
    if (!(exception instanceof HttpException)) {
      return {
        message: 'Internal server error',
      };
    }

    const response = exception.getResponse();

    if (typeof response === 'string') {
      return {
        message: response,
      };
    }

    return response as ExceptionResponse;
  }

  private getErrorMessage(
    status: number,
    exceptionResponse: ExceptionResponse,
  ): string {
    if (Array.isArray(exceptionResponse.message)) {
      return exceptionResponse.message.join(', ');
    }

    if (exceptionResponse.message) {
      return exceptionResponse.message;
    }

    return exceptionResponse.error ?? this.getDefaultMessage(status);
  }

  private getErrorCode(status: number): string {
    switch (status) {
      case HttpStatus.BAD_REQUEST:
        return 'BAD_REQUEST';
      case HttpStatus.UNAUTHORIZED:
        return 'UNAUTHORIZED';
      case HttpStatus.FORBIDDEN:
        return 'FORBIDDEN';
      case HttpStatus.NOT_FOUND:
        return 'NOT_FOUND';
      default:
        return status >= 500 ? 'INTERNAL_ERROR' : 'API_ERROR';
    }
  }

  private getDefaultMessage(status: number): string {
    switch (status) {
      case HttpStatus.BAD_REQUEST:
        return 'Bad request';
      case HttpStatus.UNAUTHORIZED:
        return 'Unauthorized';
      case HttpStatus.FORBIDDEN:
        return 'Forbidden';
      case HttpStatus.NOT_FOUND:
        return 'Not found';
      default:
        return status >= 500 ? 'Internal server error' : 'Request failed';
    }
  }
}
