# nestjs-zario

NestJS custom logger service for Zario.

## Installation

```bash
npm install nestjs-zario
```

Make sure you also have `zario` and `@nestjs/common` installed.

## Usage

In your NestJS bootstrap file (`main.ts`):

```typescript
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestZarioLogger } from 'nestjs-zario';
import { Logger } from 'zario';

async function bootstrap() {
  const logger = new Logger();

  const app = await NestFactory.create(AppModule, {
    logger: new NestZarioLogger(logger),
  });
  
  await app.listen(3000);
}
bootstrap();
```
