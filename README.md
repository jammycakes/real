# REAL — Regular Expression Alternative Language

REAL is a structured language for writing **readable, maintainable regular expressions**.

Traditional regex syntax is powerful but notoriously difficult to read and maintain. REAL provides a clear, structured alternative that compiles to standard regular expressions while remaining easy for humans to understand.

REAL focuses on:

* **Readability** — patterns are structured instead of compressed
* **Maintainability** — fragments allow reuse of pattern components
* **Testability** — regex behaviour can be verified directly alongside the pattern
* **Portability** — REAL compiles to conventional regex engines


The goal is simple: **make regex real code instead of punctuation puzzles.**

---

# Example

A REAL definition:

```real
regex james-variants {
  ignore-case

  start-of-string

  "j"
  one-of {
    sequence {
      "am"
      one-of {
        ( "mycak"? "es" )
        "ie"
      }
    }
    "imbo"
  }

  end-of-string

  test {
    it "should match common variants of James" {
      match "james"
      match "jamie"
      match "jammycakes"
      match "jimbo"
    }

    it "should not match specifically excluded variant 'Jim'" {
      no-match "Jim"
    }

    it "should be case insensitive" {
      match "James"
      match "jamie"
      match "JIMBO"
    }
  }
}
```

Compiles approximately to:

```regex
/^j(?:am(?:(?:mycak)?es|ie)|imbo)$/i
```

# Project Goals

REAL aims to provide:

* a well-defined language specification
* reference implementations
* a conformance test suite
* documentation and examples
* tooling such as compilers and playgrounds

---

# Repository Layout

```
/spec
    Language specification

/docs
    User documentation and tutorials

/examples
    Example REAL files

/fixtures
    Conformance and test fixtures

/implementations
    Reference implementations
```

# Status

REAL is currently in **early development**. The language specification is evolving and the first reference implementation is in progress.

# License

This project is released under the MIT License.
