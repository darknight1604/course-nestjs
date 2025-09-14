import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger(LoggerMiddleware.name);
  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl } = req;

    this.logger.log(`[${new Date().toISOString()}] ${method} ${originalUrl}`);
    next();
  }
}
