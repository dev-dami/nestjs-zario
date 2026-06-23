import { Injectable, LoggerService } from '@nestjs/common';
import { Logger } from 'zario';

@Injectable()
export class NestZarioLogger implements LoggerService {
  private logger: Logger;

  constructor(logger?: Logger) {
    this.logger = logger || new Logger({ prefix: '[NestJS]' });
  }

  log(message: any, context?: string) {
    this.logger.info(message, context ? { context } : undefined);
  }

  error(message: any, trace?: string, context?: string) {
    this.logger.error(message, {
      context,
      trace: trace || undefined,
    });
  }

  warn(message: any, context?: string) {
    this.logger.warn(message, context ? { context } : undefined);
  }

  debug(message: any, context?: string) {
    this.logger.debug(message, context ? { context } : undefined);
  }

  verbose(message: any, context?: string) {
    this.logger.boring(message, context ? { context } : undefined);
  }
}
