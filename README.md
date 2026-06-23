# nestjs-zario

NestJS custom logger service implementation powered by Zario.

## Installation

Install `nestjs-zario` along with its peer dependencies `zario` and `@nestjs/common` in your application:

```bash
# Using npm
npm install nestjs-zario zario @nestjs/common

# Using bun
bun add nestjs-zario zario @nestjs/common

# Using pnpm
pnpm add nestjs-zario zario @nestjs/common
```

### Local Development / Linking

To link a local clone of `nestjs-zario` to your application during development, reference its absolute path:

```bash
bun add file:/path/to/nestjs-zario
```

## Usage

To override the default NestJS logging system, instantiate `NestZarioLogger` and pass it to `NestFactory.create` during application bootstrap.

### Application Bootstrap (`main.ts`)

```typescript
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestZarioLogger } from 'nestjs-zario';
import { Logger } from 'zario';

async function bootstrap() {
  // Initialize your Zario Logger configuration
  const zarioLogger = new Logger({
    level: 'debug',
    timestamp: true,
    colorize: true
  });

  const app = await NestFactory.create(AppModule, {
    // Override the default NestJS logger
    logger: new NestZarioLogger(zarioLogger),
  });
  
  await app.listen(3000);
}
bootstrap();
```

## Configuration

The `NestZarioLogger` constructor accepts an optional `Logger` instance:

```typescript
constructor(logger?: Logger)
```

If no `Logger` instance is provided, `NestZarioLogger` will automatically instantiate a new `Logger` with `{ prefix: '[NestJS]' }`.

## Log Level Mapping

NestJS log methods are translated into Zario's core levels as follows:

| NestJS Logger Method | Zario Log Level |
| :--- | :--- |
| `log` | `info` |
| `warn` | `warn` |
| `error` | `error` |
| `debug` | `debug` |
| `verbose` | `boring` |

## License

MIT
