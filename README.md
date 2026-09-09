# nestjs-zario

A NestJS logger service backed by Zario, with structured fields, Error diagnostics,
context, trace strings, and shutdown hooks. Supports Nest 10/11; tested on Bun.

```bash
bun add nestjs-zario zario @nestjs/common
```

```ts
import { NestFactory } from '@nestjs/core';
import { NestZarioLogger } from 'nestjs-zario';
import { AppModule } from './app.module';

const logger = new NestZarioLogger();
const app = await NestFactory.create(AppModule, { logger });
await app.listen(3000);
// At shutdown: await app.close(); await logger.close();
```

A manually created bootstrap logger is owned by your application. To have Nest
manage the service lifecycle, register it in a module and use the DI instance.
The optional `ZARIO_LOGGER` token accepts an existing logger:

```ts
import { Module } from '@nestjs/common';
import { NestZarioLogger, ZARIO_LOGGER } from 'nestjs-zario';
import { zario } from 'zario';

@Module({
  providers: [
    { provide: ZARIO_LOGGER, useFactory: () => zario({ json: true }) },
    NestZarioLogger,
  ],
  exports: [NestZarioLogger],
})
export class LoggingModule {}
```

Use `app.useLogger(app.get(NestZarioLogger))` after creating the app with
`bufferLogs: true`. A DI-created service closes its own logger on application
shutdown; an injected logger is only flushed, leaving ownership with its provider.

## Calls

```ts
logger.log('saved', { userId: 42 }, 'UserService');
logger.log({ event: 'saved', userId: 42 }, 'UserService');
logger.error(new Error('failed'), 'UserService');
logger.error('failed', 'Error: failed\n    at handler (...)', 'UserService');
```

`log` maps to `info`, `verbose` to `boring`; `warn`, `error`, `debug`, and `fatal`
keep their levels. The final string parameter is context; error calls additionally
accept a stack/trace string. Non-object extra values are retained under `params`.
`flush()` and `close()` are awaitable.

The service follows Nest's [custom logger contract](https://docs.nestjs.com/techniques/logger).

## Development

Bun is the package manager and test runner. Keep the core checkout at `../../zario`:

```text
workspace/
  zario/
  zario-adapters/
    nestjs-zario/
```

Build the core first with `bun install --frozen-lockfile && bun run build` in
`workspace/zario`. Then in this adapter:

```bash
bun install --frozen-lockfile
bun run typecheck
bun run lint
bun test
bun run build
```

CI checks out and builds the pinned core revision before testing the adapter.
The relative development dependency stays out of the published runtime contract;
applications install the `zario` peer dependency normally. These changes require
Zario 0.9.0; publish the core before releasing this adapter.

## License

MIT
