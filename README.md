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
  // `string | Element | Element[] | NodeListOf<Element>`
  target: ".column",
});
```

## Options

```js
import { draggy } from "@sebkolind/draggy";

draggy({
  target: ".column",
  // (optional)
  // NOTE: Overrides the default validation behavior
  // Can be used to guard dropzones from being droppable. For example, if you
  // have dropzones that are not related, but `target` is ".column" which
  // exists in all the dropzones.
  isDropzone: (event) => event.target.classList.contains("dropzone"),
  // (optional)
  onStart: (event) => console.log("On drag start"),
  // (optional)
  onLeave: (event) => console.log("On leaving a valid drop target"),
  // (optional)
  onEnd: (event) => console.log("On drag end"),
  // (optional)
  onOver: (event) =>
    console.log("On hovering draggable over a valid drop target"),
  // (optional)
  onDrop: (event) => console.log("On drop"),
});
```
