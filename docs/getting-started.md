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

draggy({ target: ".container" });
```

```html
<!-- Drag items within a container -->
<div class="container">
  <div class="item">Item 1</div>
  <div class="item">Item 2</div>
  <div class="item">Item 3</div>
</div>

<!-- Drag items within a container, and to other .container's -->
<div class="container">
  <div class="item">Item 1</div>
  <div class="item">Item 2</div>
  <div class="item">Item 3</div>
</div>
<div class="container">
  <div class="item">Item 4</div>
  <div class="item">Item 5</div>
  <div class="item">Item 6</div>
</div>
<div class="container">
  <div class="item">Item 7</div>
  <div class="item">Item 8</div>
  <div class="item">Item 9</div>
</div>
```

### What does this do?

What this does is initialize Draggy on all elements with the class `.container`. This means that all children of `.container` will be draggable, and can be dropped on other `.container` elements if there are more than one. If only one `.container` element is found, the children can be dragged and dropped in the same container.

## Next Steps

You can customize Draggy to fit your needs. You can read more about the options available [here](./options.md). If you want to see some examples, you can find them in the sidebar under "Examples".

For example, you can integrate with [Vue](./examples/vue.md) or [React](./examples/react.md). Or, create a custom shadow element with [this example](./examples/custom-shadow.md).

If you have any questions, feel free to ask in the [Discussions](https://github.com/sebkolind/draggy/discussions) or open an [Issue](https://github.com/sebkolind/draggy/issues).
