import {
  AST,
  BlockBodyNode,
  BlockNode,
  BlockSignatureNode,
  DirectiveNode,
  StatementNode
} from "../ast";

interface ParsedLine {
  text: string;
  lineNumber: number;
}

export class ParseError extends Error {
  readonly line: number;

  constructor(message: string, line: number) {
    super(`${message} (line ${line})`);
    this.name = "ParseError";
    this.line = line;
  }
}

class Parser {
  private readonly lines: ParsedLine[];
  private index: number;

  constructor(source: string) {
    this.lines = source.split(/\r\n|\n|\r/).map((rawLine, index) => ({
      text: stripComment(rawLine),
      lineNumber: index + 1
    }));
    this.index = 0;
  }

  parseDocument(): AST {
    const body = this.parseBlockBody(false);
    return {
      type: "document",
      body
    };
  }

  private parseBlockBody(expectClosingBrace: boolean): BlockBodyNode {
    const statements: StatementNode[] = [];

    while (true) {
      this.skipIgnoredLines();

      if (this.index >= this.lines.length) {
        if (expectClosingBrace) {
          const lastLine = this.lines.length === 0 ? 1 : this.lines[this.lines.length - 1].lineNumber;
          throw new ParseError("Unclosed block, expected '}'", lastLine);
        }

        break;
      }

      const line = this.lines[this.index];
      const trimmed = line.text.trim();

      if (trimmed === "}") {
        if (!expectClosingBrace) {
          throw new ParseError("Unexpected closing brace", line.lineNumber);
        }

        this.index += 1;
        return {
          type: "block-body",
          statements
        };
      }

      statements.push(this.parseStatement());
    }

    return {
      type: "block-body",
      statements
    };
  }

  private parseStatement(): StatementNode {
    const line = this.lines[this.index];
    const text = line.text;
    const trimmed = text.trim();

    if (trimmed === "{") {
      throw new ParseError("Missing block signature before '{'", line.lineNumber);
    }

    const inlineBracePosition = findTopLevelCharacter(text, "{");
    if (inlineBracePosition >= 0) {
      const signatureText = text.slice(0, inlineBracePosition).trim();
      const trailing = text.slice(inlineBracePosition + 1).trim();

      if (signatureText.length === 0) {
        throw new ParseError("Missing block signature before '{'", line.lineNumber);
      }

      if (trailing.length > 0) {
        throw new ParseError("Unexpected content after '{'", line.lineNumber);
      }

      this.index += 1;
      return this.createBlock(signatureText, this.parseBlockBody(true));
    }

    const nextSignificantIndex = this.findNextSignificantLineIndex(this.index + 1);
    if (nextSignificantIndex !== null) {
      const nextTrimmed = this.lines[nextSignificantIndex].text.trim();
      if (nextTrimmed === "{") {
        const signatureText = trimmed;
        this.index = nextSignificantIndex + 1;
        return this.createBlock(signatureText, this.parseBlockBody(true));
      }
    }

    this.index += 1;
    return this.createDirective(trimmed);
  }

  private findNextSignificantLineIndex(startIndex: number): number | null {
    for (let index = startIndex; index < this.lines.length; index += 1) {
      if (this.lines[index].text.trim().length > 0) {
        return index;
      }
    }

    return null;
  }

  private skipIgnoredLines(): void {
    while (this.index < this.lines.length && this.lines[this.index].text.trim().length === 0) {
      this.index += 1;
    }
  }

  private createDirective(text: string): DirectiveNode {
    return {
      type: "directive",
      text
    };
  }

  private createBlock(signatureText: string, body: BlockBodyNode): BlockNode {
    const signature: BlockSignatureNode = {
      type: "block-signature",
      text: signatureText
    };

    return {
      type: "block",
      signature,
      body
    };
  }
}

export function parseDocument(source: string): AST {
  return new Parser(source).parseDocument();
}

function stripComment(line: string): string {
  let mode: "none" | "single" | "double" | "slash" | "pipe" | "backtick" | "group" = "none";

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    const previous = index > 0 ? line[index - 1] : "";

    switch (mode) {
      case "single":
        if (char === "'" && previous !== "\\") {
          mode = "none";
        }
        break;
      case "double":
        if (char === '"' && previous !== "\\") {
          mode = "none";
        }
        break;
      case "slash":
        if (char === "/") {
          mode = "none";
        }
        break;
      case "pipe":
        if (char === "|") {
          mode = "none";
        }
        break;
      case "backtick":
        if (char === "`") {
          mode = "none";
        }
        break;
      case "group":
        if (char === "]") {
          mode = "none";
        }
        break;
      case "none":
        if (char === "#") {
          return line.slice(0, index);
        }
        if (char === "'") {
          mode = "single";
        } else if (char === '"') {
          mode = "double";
        } else if (char === "/") {
          mode = "slash";
        } else if (char === "|") {
          mode = "pipe";
        } else if (char === "`") {
          mode = "backtick";
        } else if (char === "[") {
          mode = "group";
        }
        break;
    }
  }

  return line;
}

function findTopLevelCharacter(line: string, target: string): number {
  let mode: "none" | "single" | "double" | "slash" | "pipe" | "backtick" | "group" = "none";

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    const previous = index > 0 ? line[index - 1] : "";

    switch (mode) {
      case "single":
        if (char === "'" && previous !== "\\") {
          mode = "none";
        }
        break;
      case "double":
        if (char === '"' && previous !== "\\") {
          mode = "none";
        }
        break;
      case "slash":
        if (char === "/") {
          mode = "none";
        }
        break;
      case "pipe":
        if (char === "|") {
          mode = "none";
        }
        break;
      case "backtick":
        if (char === "`") {
          mode = "none";
        }
        break;
      case "group":
        if (char === "]") {
          mode = "none";
        }
        break;
      case "none":
        if (char === target) {
          return index;
        }
        if (char === "'") {
          mode = "single";
        } else if (char === '"') {
          mode = "double";
        } else if (char === "/") {
          mode = "slash";
        } else if (char === "|") {
          mode = "pipe";
        } else if (char === "`") {
          mode = "backtick";
        } else if (char === "[") {
          mode = "group";
        }
        break;
    }
  }

  return -1;
}
