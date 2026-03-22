import assert from "node:assert/strict";
import test from "node:test";

import { Real } from "../real";
import { parseDocument, ParseError } from "./index";

function directive(text: string) {
  return {
    type: "directive",
    text
  } as const;
}

type TestDirective = ReturnType<typeof directive>;
interface TestBlock {
  readonly type: "block";
  readonly signature: {
    readonly type: "block-signature";
    readonly text: string;
  };
  readonly body: {
    readonly type: "block-body";
    readonly statements: Array<TestDirective | TestBlock>;
  };
}

function block(signatureText: string, statements: Array<TestDirective | TestBlock>): TestBlock {
  return {
    type: "block",
    signature: {
      type: "block-signature",
      text: signatureText
    },
    body: {
      type: "block-body",
      statements
    }
  } as const;
}

test("parses directives as single-line statements", () => {
  const ast = parseDocument(`ignore-case
start-of-string
"jamie"
`);

  assert.deepEqual(ast, {
    type: "document",
    body: {
      type: "block-body",
      statements: [directive("ignore-case"), directive("start-of-string"), directive('"jamie"')]
    }
  });
});

test("parses nested blocks with signatures and block bodies", () => {
  const ast = parseDocument(`regex james-variants {
  ignore-case
  one-of {
    "james"
    "jamie"
  }
}
`);

  assert.deepEqual(ast, {
    type: "document",
    body: {
      type: "block-body",
      statements: [
        block("regex james-variants", [
          directive("ignore-case"),
          block("one-of", [directive('"james"'), directive('"jamie"')])
        ])
      ]
    }
  });
});

test("parses block signatures whose opening brace is on a later line", () => {
  const ast = parseDocument(`it "should match james or jamie"

# comment between signature and body is ignored
{
  match "james"
  match "jamie"
}
`);

  assert.deepEqual(ast.body.statements, [
    block("it \"should match james or jamie\"", [directive('match "james"'), directive('match "jamie"')])
  ]);
});

test("ignores comments outside quoted forms but keeps # inside literals", () => {
  const ast = parseDocument([
    '"# this is not a comment"',
    "/# nor is this/",
    "|# nor this|",
    "`# nor this either`",
    "[# not a comment]",
    "one-of { # this is a comment",
    '  "jamie" # trailing comment',
    "}",
    ""
  ].join("\n"));

  assert.deepEqual(ast.body.statements, [
    directive('"# this is not a comment"'),
    directive("/# nor is this/"),
    directive("|# nor this|"),
    directive("`# nor this either`"),
    directive("[# not a comment]"),
    block("one-of", [directive('"jamie"')])
  ]);
});

test("supports escaped quotes in string literals while stripping comments", () => {
  const ast = parseDocument(`'james\\'s room' # trailing comment
"quote: \\\"x\\\"" # trailing comment
`);

  assert.deepEqual(ast.body.statements, [directive("'james\\'s room'"), directive('"quote: \\\"x\\\""')]);
});

test("throws for missing block signature before opening brace", () => {
  assert.throws(() => parseDocument(`{
  "x"
}
`), (error: unknown) => {
    assert.ok(error instanceof ParseError);
    assert.match(error.message, /Missing block signature/);
    return true;
  });
});

test("throws for unexpected closing brace at document level", () => {
  assert.throws(() => parseDocument(`}
`), (error: unknown) => {
    assert.ok(error instanceof ParseError);
    assert.match(error.message, /Unexpected closing brace/);
    return true;
  });
});

test("throws for unclosed blocks", () => {
  assert.throws(() => parseDocument(`one-of {
  "james"
`), (error: unknown) => {
    assert.ok(error instanceof ParseError);
    assert.match(error.message, /Unclosed block/);
    return true;
  });
});

test("Real.parse delegates to parser", () => {
  const ast = Real.parse(`directive-one
directive-two
`);

  assert.deepEqual(ast.body.statements, [directive("directive-one"), directive("directive-two")]);
});
