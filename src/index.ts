import {
  Inject,
  Injectable,
  type LoggerService,
  Optional,
} from "@nestjs/common";
import { type Logger, zario } from "zario";

/** Optional Nest injection token for an application-owned Zario instance. */
export const ZARIO_LOGGER = Symbol.for("nestjs-zario.logger");

/** Nest logger supporting structured values, context, stack traces and shutdown. */
@Injectable()
export class NestZarioLogger implements LoggerService {
  private readonly logger: Logger;
  private readonly ownsLogger: boolean;

  constructor(@Optional() @Inject(ZARIO_LOGGER) logger?: Logger) {
    this.ownsLogger = logger === undefined;
    this.logger = logger ?? zario({ prefix: "[NestJS]" });
  }

  log(message: unknown, ...params: unknown[]): void {
    this.write("info", message, params);
  }
  error(message: unknown, ...params: unknown[]): void {
    this.write("error", message, params);
  }
  warn(message: unknown, ...params: unknown[]): void {
    this.write("warn", message, params);
  }
  debug(message: unknown, ...params: unknown[]): void {
    this.write("debug", message, params);
  }
  verbose(message: unknown, ...params: unknown[]): void {
    this.write("boring", message, params);
  }
  fatal(message: unknown, ...params: unknown[]): void {
    this.write("fatal", message, params);
  }

  private write(level: string, input: unknown, params: unknown[]): void {
    const remaining = [...params];
    const metadata: Record<string, unknown> = {};
    // Nest appends context to optional parameters. error(message, stack, context)
    // keeps the trace separate; a lone stack string is also supported.
    const last = remaining.at(-1);
    if (
      typeof last === "string" &&
      !(level === "error" && remaining.length === 1 && /\n\s*at\s/.test(last))
    ) {
      metadata.context = remaining.pop();
    }
    if (level === "error" && typeof remaining[0] === "string")
      metadata.trace = remaining.shift();
    for (const value of remaining) {
      if (value && typeof value === "object" && !(value instanceof Error))
        Object.assign(metadata, value);
    }
    const extras = remaining.filter(
      (value) => !value || typeof value !== "object" || value instanceof Error,
    );
    if (extras.length) metadata.params = extras;
    if (input instanceof Error)
      this.logger.logWithLevel(level, input, metadata);
    else if (input && typeof input === "object")
      this.logger.logWithLevel(level, "", { ...input, ...metadata });
    else this.logger.logWithLevel(level, String(input), metadata);
  }

  flush(): Promise<void> {
    return this.logger.flush();
  }
  close(): Promise<void> {
    return this.logger.close();
  }

  /** Nest shuts down only the logger this service created; injected loggers are flushed. */
  onApplicationShutdown(): Promise<void> {
    return this.ownsLogger ? this.close() : this.flush();
  }
}
