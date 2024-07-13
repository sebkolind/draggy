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
  draggable: ".draggable",
  dropzone: ".dropzone",
  isDropzone: ({ el }) => el.classList.contains("draggy-dropzone"),
});
```
