# Draggy

A lightweight drag&drop library built with TypeScript.

## Install

```bash
npm i @sebkolind/draggy
```

## Usage

```js
import { draggy } from "@sebkolind/draggy";

draggy({
  // `target` can be a selector, an element or an array of elements
  target: ".column",
  // or, document.querySelector(".column")
  // or, document.querySelectorAll(".column")
});
```
