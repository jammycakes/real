import { AST } from "./types";
import { JavaScript as JS } from "./platforms/javascript";

export const Real = {
  parse(source: string): AST {
    throw new Error("Not implemented: Real.parse");
  },

  JavaScript: JS
};

export default Real;
