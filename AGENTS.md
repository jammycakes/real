# AGENTS.md

## Overview

This repository contains the **REAL (Regular Expression Alternative Language)** project.

REAL is a structured language for defining readable, testable regular expressions that compile to standard regex engines.

This file provides guidance for automated agents and contributors working in this repository.

---

## Core Principles

* **Spec-first**: The `/spec` directory is the source of truth.
* **Clarity over cleverness**: Prefer simple, explicit code and structure.
* **Deterministic behaviour**: Compilation and test results must be predictable.
* **Minimalism**: Avoid unnecessary dependencies and abstractions.

---

## Repository Structure

```txt
/spec
/docs
/examples
/fixtures
/implementations
```

* `/spec` — language definition (authoritative)
* `/docs` — user-facing documentation
* `/examples` — human-readable sample `.real` files
* `/fixtures` — machine-checked test cases
* `/implementations` — reference implementations

---

## TypeScript Implementation

Location:

```
/implementations/typescript
```

Structure:

```txt
src/
  parser/      parsing REAL source into AST
  ast/         AST node definitions
  compiler/    regex generation and orchestration
  runtime/     test execution
```

Guidelines:

* Keep code readable and modular
* Avoid external runtime dependencies
* Follow the spec strictly
* Do not introduce behaviour not defined in `/spec`

---

## Compilation Model

Compilation must:

1. Parse the source file
2. Expand fragments
3. Build a normalized representation
4. Compile to a regex for a target engine
5. Execute all `test` blocks

Compilation **fails if any test fails**.

---

## Tests

* Tests are defined inside `.real` files using `test { ... }`
* There is no separate test runner command
* Tests run automatically during compilation

---

## Fixtures

The `/fixtures` directory contains shared conformance cases.

Implementations should:

* run fixtures to verify correctness
* produce consistent results across implementations

---

## Style Guidelines

* Prefer explicit naming over abbreviations
* Keep functions small and focused
* Avoid premature optimization
* Write code that mirrors the structure of the language

---

## Non-Goals (for now)

* Performance optimization
* Advanced regex features (e.g. lookbehind, captures)
* Engine-specific extensions
* Complex CLI tooling

---

## Contribution Guidelines

When contributing:

* Update the spec first if behaviour changes
* Keep implementations aligned with the spec
* Add or update examples and fixtures where relevant
* Avoid introducing breaking changes without clear justification

---

## Notes for Agents

* Do not infer behaviour not explicitly defined in the spec
* Do not "improve" syntax without discussion
* Prefer adding TODOs over guessing intended behaviour
* Keep changes minimal and incremental

---

## Tooling

Use pnpm for Node.js package management.

REAL is intentionally small and evolving. Prioritise correctness, clarity, and alignment with the spec above all else.
