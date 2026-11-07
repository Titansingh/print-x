#!/usr/bin/env node
// Cross-platform removal of build/cache directories relative to the current
// working directory. Usage: node scripts/clean.mjs dist .turbo
import { rm } from "node:fs/promises";
import { resolve } from "node:path";

const targets = process.argv.slice(2);

if (targets.length === 0) {
  console.error("Usage: clean.mjs <path> [...paths]");
  process.exit(1);
}

await Promise.all(
  targets.map((target) => rm(resolve(process.cwd(), target), { recursive: true, force: true })),
);
