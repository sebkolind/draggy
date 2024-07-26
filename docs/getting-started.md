# Getting Started

## Installation

::: code-group

```sh [npm]
npm add @sebkolind/draggy
```

```sh [pnpm]
pnpm add @sebkolind/draggy
```

```sh [yarn]
yarn add @sebkolind/draggy
```

```sh [bun]
bun add @sebkolind/draggy
```

:::

## Quick Start

Here's a basic example to initialize on all elements with the `.container` class.
This will use the default configuration. You can read more about the options available [here](./options.md).

```ts
import { draggy } from "@sebkolind/draggy";

draggy({
  target: ".container",
});
```
