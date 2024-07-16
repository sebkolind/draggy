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
  target: ".column", // or a node list, or an array of nodes
});
```

## Advanced Usage

```js
import { draggy } from "@sebkolind/draggy";

draggy({
  target: ".column",
  // (optional)
  // NOTE: Overrides the default validation behavior
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
