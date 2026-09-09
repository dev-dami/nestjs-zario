import "reflect-metadata";
import { describe, expect, test } from "bun:test";
import { Test } from "@nestjs/testing";
import { zario } from "zario";
import { NestZarioLogger, ZARIO_LOGGER } from "../src/index.js";

function fixture() {
  const logs: Record<string, unknown>[] = [];
  const root = zario({
    level: "boring",
    json: true,
    timestamp: false,
    transports: [
      {
        write(data, formatter) {
          logs.push(JSON.parse(formatter.format(data)));
        },
      },
    ],
  });
  return { logs, root, logger: new NestZarioLogger(root) };
}

describe("Nest adapter on Bun", () => {
  test("supports structured messages, optional metadata and context", async () => {
    const { logger, logs } = fixture();
    logger.log({ event: "saved" }, { id: 1 }, "Service");
    logger.warn(42, "Numbers");
    logger.fatal("fatal", "Service");
    expect(logs[0]).toMatchObject({
      event: "saved",
      id: 1,
      context: "Service",
    });
    expect(logs[1]).toMatchObject({ message: "42", context: "Numbers" });
    expect(logs[2]).toMatchObject({ level: "fatal" });
    await logger.close();
  });

  test("preserves Error diagnostics and legacy stack/context arguments", async () => {
    const { logger, logs } = fixture();
    const error = new Error("failed");
    logger.error(error, error.stack, "Service");
    logger.error("failed", error.stack);
    expect(logs[0]).toMatchObject({
      err: { message: "failed" },
      trace: error.stack,
      context: "Service",
    });
    expect(logs[1]).toMatchObject({ trace: error.stack });
    await logger.close();
  });

  test("Nest can construct the service without a Logger provider", async () => {
    const module = await Test.createTestingModule({
      providers: [NestZarioLogger],
    }).compile();
    expect(module.get(NestZarioLogger)).toBeInstanceOf(NestZarioLogger);
    await module.close();
  });

  test("injected logger is flushed, not closed, at Nest shutdown", async () => {
    const { root } = fixture();
    const module = await Test.createTestingModule({
      providers: [NestZarioLogger, { provide: ZARIO_LOGGER, useValue: root }],
    }).compile();
    await module.close();
    expect(root.isClosed()).toBe(false);
    await root.close();
  });
});
