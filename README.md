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
  onStart: () => console.log("On drag start"),
  // (optional)
  onLeave: () => console.log("On leaving a valid drop target"),
  // (optional)
  onEnd: () => console.log("On drag end"),
  // (optional)
  onOver: () => console.log("On hovering draggable over a valid drop target"),
  // (optional)
  onDrop: () => console.log("On drop"),
});
```
