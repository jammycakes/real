# Copilot Instructions

This repository implements **REAL (Regular Expression Alternative Language)**.

## Key Guidelines

* Follow the language specification in `/spec`
* Prefer simple, readable TypeScript
* Do not introduce behaviour not defined in the spec
* Avoid external dependencies unless absolutely necessary

## Architecture

* Parser → AST → Compiler → Runtime
* Tests are executed during compilation (not separately)
* Keep parsing, compilation, and runtime concerns separate

## Style

* Use clear, descriptive names
* Keep functions small and focused
* Avoid clever or overly abstract solutions
* Mirror the structure of the language in the code

## Important

* Do not guess missing language features
* If behaviour is unclear, leave TODO comments instead of inventing logic
