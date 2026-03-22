import { AST } from "./types";
import { JavaScript as JS } from "./platforms/javascript";
import { parseDocument } from "./parser";

export const Real = {
  parse(source: string): AST {
    return parseDocument(source);
  },

  JavaScript: JS
};

export default Real;
