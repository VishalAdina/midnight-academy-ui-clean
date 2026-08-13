import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const isProduction = process.env.NODE_ENV === 'production';

    const errorResponse: Record<string, unknown> = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: 'Internal server error',
    };

    if (exception instanceof HttpException) {
      const resp = exception.getResponse();
      if (typeof resp === 'string') {
        errorResponse.message = resp;
      } else if (typeof resp === 'object' && resp !== null) {
        const objResp = resp as Record<string, unknown>;
        if ('message' in objResp) {
          errorResponse.message = objResp.message;
        }
      }
    } else if (!isProduction && exception instanceof Error) {
      errorResponse.message = exception.message;
      errorResponse.stack = exception.stack;
    }

    response.status(status).json(errorResponse);
  }
}
