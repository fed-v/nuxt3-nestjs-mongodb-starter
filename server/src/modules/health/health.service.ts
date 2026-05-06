import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

type HealthCheck = {
  status: 'up' | 'down';
};

export type HealthResponse = {
  status: 'ok';
  uptime: number;
  checks: {
    api: HealthCheck;
    database: HealthCheck;
  };
};

@Injectable()
export class HealthService {
  constructor(@InjectConnection() private readonly connection: Connection) {}

  check(): HealthResponse {
    const isDatabaseConnected = this.connection.readyState === 1;

    if (!isDatabaseConnected) {
      throw new ServiceUnavailableException({
        code: 'HEALTH_CHECK_FAILED',
        message: 'Database connection is unavailable',
        details: {
          api: 'up',
          database: 'down',
        },
      });
    }

    return {
      status: 'ok',
      uptime: process.uptime(),
      checks: {
        api: {
          status: 'up',
        },
        database: {
          status: 'up',
        },
      },
    };
  }
}
