What should be included in this lib?

===

entropack (string manip) (types) (node+web)

- EXCLUSIONS
  - cli-oriented stuff
  - english-specific stuff
  - filesystem-specific stuff
  - features that have a low usage:bytes ratio
- string
  - escaping things
  - is char \_? (mathiasbeyens-stuff)
  - crlf to lf
  - strip ansi
  - is char escaped?
  - is this the start of a url encoded char?
  - remove / / comments
  - remove / \* \* / comments
  - slugify
  - reverseString
  - to/from Base64String/Base64URLString/HexString (iconv-lite?)
    - uint8Array => base64url
  - compressString
    - string => https://github.com/daniel-sudz/lzw-lite => Uint8Array
  - lz77 encode decode
  - huffman encode decode
  - hash (BLAKE2s https://github.com/dcposch/blakejs/blob/master/blake2s.js)
  - ensurestartswith ensureendswith
- types
  - validate types
  - json type
  - the core stuff from type-fest
  - utility types (entries, other tuple methods?)
  - helpers that feel like they are missing from either JS/TS
  - array/obj helpers should be added here
  - other misc helpers like timeouts should be added here
  - parse string types (iso date, int, float, etc)
  - regex type stuff
  - domain specific validation (npm: is)
    - email
    - url
    - ip (npm:ip)
  - domain specific tools
    - npm:content-type
- misc npm libs

  - cookie
  - escape-string-regexp
  - bytes
  - ms
  - validate-npm-package-name
  - json-stable-stringify (also json-stringify-safe)
  - escape-html (also html-entities)
  - common-tags::{ stripIndent, stripIndents, oneLine, oneLineTrim, id as noop }
  - shell-quote
  - sanitize-html
  - nanoid
  - each char (keycode,
    https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/charAt#getting_whole_characters)

- utilities

  - \*noop
  - \*random ??= random(crypto) ?? random(Math.random)
  - type-is
  - shallowequal deepequal
  - glob fns
  - walk (maybe bfs, dfs?)

- lodash
  - \_.cloneDeep / clone
    (https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm)
  - \_.uniq
  - \_.truncate (clamp ...)
  - \_.once
  - \_.camelCase
  - \_.isEqual (is deep equal)
  - \_.kebabCase
  - (a way of defaulting a new value into a map would be nice)
  - \_.isMatch (is deep subshape)
  - \_.pick (if there's a type safe way to do it)
  - \_.snakeCase
  - \_.omit (if there's a type safe way to do it)
  - \_.has (Object.hasOwn ...)
  - \_.groupBy
  - \_.upperFirst
  - \_.flow (rename to compose) (special case invert boolean)
  - \_.without
  - \_.isNil (is null || undefined)
  - \_.capitalize
  - \_.deburr (remove accents from latin characters)
  - \_.chunk
  - \_.orderBy (badname)
  - \_.maxBy
  - \_.zip (transpose? + to object? if there's a type safe way to do it)
  - \_.fromPairs (this is like entries => obj, very useful)
  - \_.invert
  - \_.castArray (badname, arr is Arr ? arr : [arr])
  - \_.startCase
  - \_.compact (badname)
  - \_.range
  - \_.sampleSize
  - \_.shuffle
  - \_.pad (balanced padstart and padend)
  - (a way to clearly iterate in reverse)
  - _.repeat, _.times (would be nice both for building string and arr)
  - \_.hasIn (in a typesafe way)
  - (a way to invert by a specific key, building an array)
  - \_.partition
  - _.findLast, _.findLastIndex (not in node 16)
  - \_.sample (badname: randomFrom?)
  - \_.partial
  - _.sumBy, _.minBy, .maxBy, .sortBy, _.countBy, _.meanBy (can anything be done with this?)
  - \_.words
  - \_.size (number of keys in object)
  - \_.sum
  - \_.clamp
  - \_.matches (maybe? but should only be for filter)
  - \_.ary (unary binary ternary?)
  - _.takeWhile (and reverse: _.dropWhile)
  - \_.inRange
  - \_.stubTrue (badname: identity)
  - \_.mean

===

candidates:

- deep-extend / deepmerge
- diff
- \*util-inspect-stable-stringify
- \*object-path-but-with-ts (or at least try to solve the problem better)
- some simple datetime manip
- common-tags::{ html, safeHtml }
- \*readHex readRgb readHsl readHwb readClr
- normalize-url
- boxen (perhaps could be a utility for non-cli purposes, that the cli fn would use)
- deep-diff
- serialize-javascript
- memoize-one
- lru-cache
- string search algos (bitap - see fuse.js)
- word-wrap (but return string[] instead)
