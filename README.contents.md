What should be included in this lib?

===

entropack (string manip) (types) (node+web)

- EXCLUSIONS
  - cli-oriented stuff
  - english-specific stuff
  - filesystem-specific stuff
  - features that have a low usage:bytes ratio
  - stuff with a Stage 2+ equivalent
- tdd development :O support generic iterables instead of array?
- prioritise use-case oriented fns over sugar
  - define this
- sort from most simple to least

---

needs more research:

stdlibs in other langs

Should add?

- deep-extend / deepmerge
- diff
- validate types
  - perhaps a slimmed down version of npm:runtypes
  - or just json focused - a slimmed down npm:ajv
- \*util-inspect-stable-stringify
- \*object-path-but-with-ts (or at least try to solve the problem better)
- some simple datetime manip
- common-tags::{ html, safeHtml }
- \*readHex readRgb readHsl readHwb readClr
- normalize-url
- normalizeEmail
- boxen (perhaps could be a utility for non-cli purposes, that the cli fn would use)
- deep-diff
- subset of ajv
- serialize-javascript
- memoize-one
- lru-cache
- string search algos (bitap - see fuse.js)
- word-wrap (but return string[] instead)
- unix memoryfs
