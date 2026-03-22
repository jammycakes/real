#!/usr/bin/env node
import * as fs from "fs";
import { Real } from "./index";

const args = process.argv.slice(2);
if (args.length === 0) {
  console.error("Usage: real <file.real>");
  process.exit(2);
}
const path = args[0];
try {
  const src = fs.readFileSync(path, "utf8");
  const ast = Real.parse(src);
  const regexes = Real.JavaScript.compile(ast);
  console.log(JSON.stringify(regexes, null, 2));
} catch (err) {
  console.error("Error:", (err && (err as Error).message) || err);
  process.exit(1);
}
