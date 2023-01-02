```sh
git clone https://github.com/tbjgolden/entropack.git cool-package-name
cd cool-package-name
npx find-repl entropack cool-package-name
rm -rf .git
git init
npm install
```

---

# entropack

![banner](banner.svg)

![npm](https://img.shields.io/npm/v/entropack)
![npm type definitions](https://img.shields.io/npm/types/entropack)
![license](https://img.shields.io/npm/l/entropack)
[![install size](https://packagephobia.com/badge?p=entropack)](https://packagephobia.com/result?p=entropack)

A npm library that does exactly what it says on the tin.

## Table of Contents

## Background

- Cover motivation.
- Cover abstract dependencies.
- Cover compatible versions of Node, npm and ECMAScript.
- Cover similar packages and alternatives.

## Install

This package is available from the `npm` registry.

```sh
npm install entropack
```

## Usage

```sh
npx entropack ...
```

Supports JavaScript + TypeScript:

```ts
import { foo } from "entropack";

foo();
```

Can also be imported via `require("entropack")`.

## API

...

## Credits

...

## Contributing

- State where users can ask questions.
- State whether PRs are accepted.
- List any requirements for contributing; for instance, having a sign-off on commits.

Dev environment requires:

- node >= 16.14.0
- npm >= 6.8.0
- git >= 2.11

## Licence

Apache-2.0
