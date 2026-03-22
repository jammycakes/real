# 1. Introduction

REAL (Regular Expression Alternative Language) is an alternative syntax for
regular expressions, designed with readability, testability and maintainability
in mind. Conventional regular expressions can be very difficult to read and
maintain, limiting the use of some of the rich behaviours that they have to offer.
REAL attempts to fix that.

Example:

```real
regex james-variants {
  ignore-case
  start-of-string

  "j"
  one-of {
    "am"
    one-of {
      "es"
      "ie"
    }
    sequence {
      "im"
      optional one-of {
        ( "bo" "b"? )
        "my"
      }
    }
  }

  end-of-string

  test {
    it "should match common variants of James" {
      match "james"
      match "jamie"
      match "jim"
      match "jimbo"
      match "jimbob"
      match "jimmy"
    }

    it "should be case insensitive" {
      match "JAMES"
      match "Jamie"
      match "jImBo"
    }

    it "should not match other spurious variants" {
      no-match "jiminy"
      no-match "jimborino"
      no-match "jamesie"
    }
  }
}
```

compiles to this expression:

```javascript
/^j(?:am(?:es|ie)|im(?:bob?|my)?)$/i
```

# 2. Preliminaries

## 2.1. REAL documents and encoding

A REAL document consists of a sequence of Unicode code points.
REAL documents can be held in-memory as a string, saved as a file,
or otherwise serialised for transimssion over the wire.

REAL documents are saved with the extension `.real`. They SHOULD
be saved as UTF-8 documents without a byte order mark; however, if
a Unicode byte order mark is present, conforming parsers MUST use
the byte order mark to establish the encoding.

Conforming parsers MUST interpret documents without a byte order mark
as UTF-8. Parsers are not expected to support non-Unicode encodings.

Parsers MAY impose practical limits on the size of a REAL file, for
example due to memory constraints.

## 2.2. Characters and lines

For the purpose of this specification, a "character" means a Unicode
code point. Some code points (for example combining accents) may not match a
user's intuitive notion of a single grapheme, but all code points count
as characters here.

A "line" is a sequence of zero or more characters other than line feed
(U+000A) or carriage return (U+000D), followed by a line ending or the
end of file. A "line ending" is one of:

- a line feed (U+000A)
- a carriage return (U+000D) not followed by a line feed
- a carriage return followed by a line feed (CRLF)

A line that contains no characters, or only spaces (U+0020) or tabs
(U+0009), is a blank line.

The following character classes are used in this spec:

- Unicode whitespace: any character in the Unicode `Zs` general
  category, or one of U+0009 (tab), U+000A (line feed), U+000C (form
  feed), or U+000D (carriage return).
- Unicode whitespace (sequence): one or more Unicode whitespace
  characters.
- Tab: U+0009.
- Space: U+0020.
- ASCII control character: any code point in U+0000–U+001F or U+007F.
- ASCII punctuation character: characters in the ranges
  U+0021–U+002F, U+003A–U+0040, U+005B–U+0060, and U+007B–U+007E.
- Unicode punctuation character: any character in the Unicode `P`
  (Punctuation) or `S` (Symbol) general categories.

## 2.3. Directives, blocks, tokens and string literals

At the most fundamental level, a REAL document consists of a series of statements.
Statements can be either blocks (containing nested statements) or directives
(single-line instructions).
