import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private readonly log: Logger = new Logger(LoggerMiddleware.name);

  use(req: Request, res: Response, next: NextFunction) {
    this.log.log(
      `Request ${req.path} from ${req.ip} user: ${req.session?.userId || '-'}`,
    );
    next();
  }
}
