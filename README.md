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

### Basic Usage (Zero Configuration)

You can register the logger service directly in your bootstrap file without importing the core `zario` package. It will automatically initialize a default Zario Logger instance.

```typescript
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestZarioLogger } from 'nestjs-zario';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    // Override the default NestJS logger
    logger: new NestZarioLogger(),
  });
  
  await app.listen(3000);
}
bootstrap();
```

### Custom Logger Usage

If you need to configure custom settings (such as log level or colors), initialize a Zario `Logger` instance and pass it to the `NestZarioLogger` constructor.

```typescript
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestZarioLogger } from 'nestjs-zario';
import { Logger } from 'zario';

async function bootstrap() {
  // Initialize custom Zario Logger
  const customLogger = new Logger({
    level: 'debug',
    timestamp: true,
    colorize: true
  });

  const app = await NestFactory.create(AppModule, {
    // Override the default NestJS logger with custom configuration
    logger: new NestZarioLogger(customLogger),
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
