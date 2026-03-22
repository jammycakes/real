# Copilot instructions — REAL project

Purpose: quick, actionable guidance for AI coding agents working on REAL.

Core principles

- Spec-first: the authoritative language definition is in [spec](spec).
- Small, explicit changes only: prefer TODOs over guessing new behaviour.
- Keep code readable and modular; avoid extra dependencies.

Architecture & important paths

- Pipeline: Parser → AST → Compiler → Runtime.
- Key locations:
	- [spec](spec) — language spec (source of truth)
	- [implementations/typescript/src/parser](implementations/typescript/src/parser)
	- [implementations/typescript/src/ast](implementations/typescript/src/ast)
	- [implementations/typescript/src/compiler](implementations/typescript/src/compiler)
	- [implementations/typescript/src/runtime](implementations/typescript/src/runtime)
	- [fixtures](fixtures) — conformance cases
	- [examples](examples) — sample .real files (e.g. [examples/james-variants.real](examples/james-variants.real))

Behavioral rules agents must follow

- Do not implement behaviour not defined in [spec](spec). If the spec is unclear, add a TODO and explain the ambiguity in the PR.
- Preserve the separation of concerns: parsing, AST normalization, compilation, and runtime test execution should remain distinct.
- Tests are embedded in `.real` files (inside `test { ... }`) and are executed during compilation; changes that affect compilation must ensure these tests still pass.

Developer workflows (practical steps)

- Use pnpm in the TypeScript implementation: `cd implementations/typescript && pnpm install` (AGENTS.md recommends `pnpm`).
- Build the TS implementation: `pnpm build` (runs `tsc` per [implementations/typescript/package.json](implementations/typescript/package.json)).
- Run the built compiler: `pnpm start` runs `node dist/index.js` (entry: [implementations/typescript/src/index.ts](implementations/typescript/src/index.ts)).
- To validate changes, run the compiler against files in [fixtures](fixtures) and [examples](examples) so compilation-driven tests execute.

Project-specific conventions & patterns

- The code mirrors language structure: expect small modules for grammar parsing, AST node definitions, compilation passes, and runtime/test executor.
- Avoid introducing new CLI flags or engine-specific extensions without updating the spec first.
- Naming: prefer descriptive names (no cryptic abbreviations); functions should be small and single-purpose.

Integration points

- Fragment expansion → AST normalization before compilation to target regex engines.
- Compiler outputs a target-engine regex and the runtime executes tests found in `.real` files; CI expects compilation to fail when tests fail.

When editing code

- Run `pnpm build` and then run the compiler on representative fixtures/examples.
- Add unit-like fixtures under [fixtures](fixtures) when adding features or fixing bugs.
- Keep changes minimal and document rationale in TODOs or PR descriptions when spec changes are needed.
- Respect the repository .editorconfig (Markdown wrapped to 100 columns).


Where to look for examples

- `examples/james-variants.real` demonstrates test blocks and typical grammar.
- Follow file layout under `implementations/typescript/src/` to locate the corresponding code to change.

Ask for clarification

- If any behaviour in the spec is ambiguous or a required runtime is missing, leave a clear TODO and ask the maintainers in the PR description.
