- tdd development
- support generic iterables instead of array?
- 80% rule

---

data structures first

- [x] List (ArrayList-esque)
- [ ] Dict (predictable serialisation, sorted keys)
- [ ] JSON+
  - removeJsonComments
  - isStringSafeJsonChild
    - checks for circular deps
    - checks for unserialisable types
  - isStringSafeJson
    - isStringSafeJsonChild && checks root type is obj or arr
  - JSON.stringify() - check invalid json types (but allows undefined)
  - JSON.parse() - strips js comments, then parses, swaps nulls for undefined
- [ ] tuple() (type-safe alternative to `as const`)
- [ ] Dates
  - IsoDate
    - constructor (IsoDate or ISO string)
    - get {millis,seconds,minutes,hours,days,weeks,months,years,offsetMinutes}
    - set {millis,seconds,minutes,hours,days,weeks,months,years,offsetMinutes}
    - add and sub done via setters += -=
  - startOf{Second,Minute,Hour,Day,Week,Month,Year}
  - endOf{Second,Minute,Hour,Day,Week,Month,Year}
  - each{Second,Minute,Hour,Day,Week,Month,Year}InInterval
  - Date.toTzString(tz)
  - parseDateTimeTz
  - isDateTimeTz
  - parseDateTime
  - isDateTime (str, exact = false) exact=true -> fails w/ extra tz
  - parseDateTz
  - isDateTz (str, exact = false) exact=true -> fails w/ extra time
  - parseTimeTz
  - isTimeTz (str, exact = false) exact=true -> fails w/ extra date
  - parseDate
  - isDate (str, exact = false) exact=true -> fails w/ extra time or tz
  - parseTime
  - isTime (str, exact = false) exact=true -> fails w/ extra date or tz
  - parseTz
  - isTz (str, exact = false) exact=true -> fails w/ extra date or time
  - changeTz

---

- [ ] stripAnsiEscapes
- [ ] ensureUnixLineEndings
- [ ] ensureStartsWith
- [ ] ensureEndsWith
- [ ] String.toCodePoints (for of + codePointAt with string)
- [ ] String.toChars (for of + codePointAt with string)
- [ ] String.reverse (for of + codePointAt with string)
- [ ] String.isCharEscaped
- [ ] encodeCssEscapes decodeCssEscapes
- [ ] encodeHtmlEntities decodeHtmlEntities (adapt npm:he)
- [ ] getStringBytes (JS (i.e. utf16) string => UTF-8 byte counter (equiv to buffer.byteLength))
- [ ] encodeBase64 decodeBase64
- [ ] encodeBase64Url decodeBase64Url
- [ ] encodeHex decodeHex
- [ ] getType // with null fix
- [ ] getTypeBuiltIns // with detection for built-in instances
      (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects)
- [ ] Utility Types
  - `Primitive` - Matches any primitive value.
  - `EmptyObject` - Represents a strictly empty plain object, the `{}` value.
  - `Except` - Create a type from an object type without certain keys. This is a stricter version of
    `Omit`.
  - `Writable` - Create a type that strips `readonly` from all or some of an object's keys. The
    inverse of `Readonly<T>`.
  - `Merge` - Merge two types into a new type. Keys of the second type overrides keys of the first
    type.
  - `MergeDeep` - Merge two objects or two arrays/tuples recursively into a new type.
  - `OmitIndexSignature` - Omit any index signatures from the given object type, leaving only
    explicitly defined properties.
  - `PickIndexSignature` - Pick only index signatures from the given object type, leaving out all
    explicitly defined properties.
  - `PartialDeep` - Create a deeply optional version of another type. Use `Partial<T>` if you only
    need one level deep.
  - `PartialOnUndefinedDeep` - Create a deep version of another type where all keys accepting
    `undefined` type are set to optional.
  - `ReadonlyDeep` - Create a deeply immutable version of an `object`/`Map`/`Set`/`Array` type. Use
    `Readonly<T>` if you only need one level deep.
  - `LiteralUnion` - Create a union type by combining primitive types and literal types without
    sacrificing auto-completion in IDEs for the literal type part of the union. Workaround for
    Microsoft/TypeScript#29729.
  - `SetOptional` - Create a type that makes the given keys optional.
  - `SetRequired` - Create a type that makes the given keys required.
  - `SetNonNullable` - Create a type that makes the given keys non-nullable.
  - `ValueOf` - Create a union of the given object's values, and optionally specify which keys to
    get the values from.
  - `ConditionalExcept` - Like `Omit` except it removes properties from a shape where the values
    extend the given `Condition` type.
  - `Stringified` - Create a type with the keys of the given type changed to `string` type.
  - `IterableElement` - Get the element type of an `Iterable`/`AsyncIterable`. For example, an array
    or a generator.
  - `Entry` - Create a type that represents the type of an entry of a collection.
  - `Entries` - Create a type that represents the type of the entries of a collection.
  - `SetReturnType` - Create a function type with a return type of your choice and the same
    parameters as the given function type.
  - `Simplify` - Useful to flatten the type output to improve type hints shown in editors. And also
    to transform an interface into a type to aide with assignability.
  - `Get` - Get a deeply-nested property from an object using a key path, like Lodash's `.get()`
    function.
  - `StringKeyOf` - Get keys of the given type as strings.
  - `Schema` - Create a deep version of another object type where property values are recursively
    replaced into a given value type.
    - `ReplaceValuesWith` `DeepReplaceValuesWith`
  - `Exact` - Create a type that does not allow extra properties.
  - `OptionalKeysOf` - Extract all optional keys from the given type.
  - `RequiredKeysOf` - Extract all required keys from the given type.
  - `Spread` - (but obj only) Mimic the type inferred by TypeScript when merging two objects or two
    arrays/tuples using the spread syntax.
  - `IsEqual` - Returns a boolean for whether the two given types are equal.
  - `Jsonify` - Transform a type to one that is assignable to the `JsonValue` type.
  - `Jsonifiable` - Matches a value that can be losslessly converted to JSON.
  - `JsonPrimitive` - Matches a JSON primitive.
  - `JsonObject` - Matches a JSON object.
  - `JsonArray` - Matches a JSON array.
  - `JsonValue` - Matches any valid JSON value.
  - `Promisable` - Create a type that represents either the value or the value wrapped in
    `PromiseLike`.
  - `AsyncReturnType` - Unwrap the return type of a function that returns a `Promise`.
  - `Asyncify` - Create an async version of the given function type.
  - `Trim` - Remove leading and trailing spaces from a string.
  - `Split` - Represents an array of strings split using a given character or character set.
  - `Replace` - Represents a string with some or all matches replaced by a replacement.
  - `Includes` - Returns a boolean for whether the given array includes the given item.
  - `Join` - Join an array of strings and/or numbers using the given string as a delimiter.
  - `CamelCase` - Convert a string literal to camel-case (`fooBar`).
  - `CamelCasedProperties` - Convert object properties to camel-case (`fooBar`).
  - `CamelCasedPropertiesDeep` - Convert object properties to camel-case recursively (`fooBar`).
  - above variations for `KebabCase`
  - above variations for `PascalCase`
  - above variations for `SnakeCase`
  - above variations for `ScreamingSnakeCase`
  - above variations for `TitleCase`
  - above variations for custom `DelimiterCase`
  - `PackageJson` - Type for npm's `package.json` file. It also includes support for TypeScript
    Declaration Files.
  - `TsConfigJson` - Type for TypeScript's `tsconfig.json` file.
  - `Dictionary<number>` vs `Record<string, number>`) from `Record`
  - `Nullish`
- [ ] delay
- [ ] waitUntil
- [ ] debounce
- [ ] throttle
- [ ] escapeRegExp
- [ ] toMs(2, 'days') fromMs(64000, 'format')
- [ ] toUnprefixedUnit('2kW') => [2000, 'W'] toPrefixedUnit(2000, 'W')
- [ ] stripIndent`...`
- [ ] stripIndents`...`
- [ ] oneLine`...`
- [ ] oneLineTrim`...`
- [ ] random ??= random(crypto) ?? random(Math.random)
- [ ] equal (optional depth param, default Infinity)
- [ ] equiv (optional depth param, default Infinity)
- [ ] parseRegExp ("/sios/g" => ["sios", "g"])
- [ ] isHttpsUrl
- [ ] isIp
- [ ] isIpV4
- [ ] isIpV6
- [ ] dfsNode
- [ ] bfsNode
- [ ] dfsEdge
- [ ] bfsEdge
- [ ] unixGlob (python stdlib? minimatch etc)
- [ ] Object.hasKey
- [ ] Object.clone
      (https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm,
      https://github.com/ungap/structured-clone)
- [ ] Object.stringify (compatible with Structured clone algorithm, check for standards)
- [ ] Object.parse (compatible with Structured clone algorithm)
- [ ] unique
- [ ] uniqueEqual
- [ ] uniqueEquiv
- [ ] ellipsis
- [ ] camelCase
- [ ] pascalCase
- [ ] kebabLowerCase
- [ ] kebabUpperCase
- [ ] snakeLowerCase
- [ ] snakeUpperCase
- [ ] Array.find(arr, selector).min | getters | max,maxValue,min,minValue,sum,product,mean
- [ ] Array.groupBy(selector) => Array.prototype.group // groupToMap
- [ ] Array.order() // sort but no mutation, multiple sort functions
- [ ] Array.without()
- [ ] transpose()
- [ ] cellsToEntries()
- [ ] compose()
- [ ] invert() (special case compose with boolean)
- [ ] isNullish() (is null or undefined)
- [ ] default() (is null or undefined)
- [ ] Array.chunk()
- [ ] Map.setIfNotExists() Array.setIfNotExists() // <- Array.p.at()
- [ ] ensureArray
- [ ] Object.entries()
- [ ] Object.fromEntries()
- [ ] range()
- [ ] shuffle()
- [ ] reversed()
- [ ] String.repeat()
- [ ] Array.repeat()
- [ ] partApply()
- [ ] Object.size()
- [ ] Math.sum()
- [ ] Math.product()
- [ ] Math.mean()
- [ ] Math.clamp()
- [ ] memoAll()
- [ ] memoLast(n = 1)
- [ ] arg1()
- [ ] arg2()
- [ ] arg3()
- [ ] arg4()
- [ ] arg(n: number)
- [ ] String.trimStart
- [ ] String.trimEnd
- [ ] String.trim
- [ ] Array.trimStart
- [ ] Array.trimEnd
- [ ] Array.trim
- [ ] i(x) => x
- [ ] isNull()
- [ ] NULL
- [ ] NOOP
- [ ] String.isUpperCase()
- [ ] String.isLowerCase()
- [ ] isLowerAZ()
- [ ] isUpperAZ()
- [ ] isAZ()
- [ ] isLowerAZ09()
- [ ] isUpperAZ09()
- [ ] isAZ09()
- [ ] isAscii()
- [ ] isDataURI()
- [ ] readDataURI()
- [ ] isEmail()
- [ ] readEmail()
- [ ] isHex()
- [ ] isOctal()
- [ ] isSemVer()
- [ ] readSemVer()
- [ ] isSlug()
- [ ] isValidPassword()
- [ ] readValidPassword()
- [ ] isURL()
- [ ] readURL()
- [ ] isUUID()
- [ ] ensureNoControlChars()
- [ ] isFloat()
- [ ] readFloat()
- [ ] isInt()
- [ ] readInt()
- [ ] median()
- [ ] quantiles()
- [ ] stdev()
- [ ] variance()
- [ ] correlation()
- [ ] linearRegression()
