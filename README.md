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

```ts
type Options = {
  /**
   * The dropzone target(s).
   * Each child of a dropzone will become draggable, and each dropzone
   * will be an accepted dropzone of those children.
   */
  target: string | Element | Element[] | NodeListOf<Element> | null;

  /**
   * Events
   */
  onStart?: (event: Event) => void;
  onLeave?: (event: Event) => void;
  onOver?: (event: Event) => void;
  onDrop?: (event: Event, dragged: HTMLElement) => void;

  /**
   * Specifies where a draggable can be dropped.
   * - "start": Only allow dropping at the start. With direction=vertical this is the top, and direction=horizontal is to the right.
   * - "end": Only allow dropping at the end. With direction=vertical this is the bottom, and direction=horizontal is to the left.
   * - "edges": Allow dropping at both the start and end.
   * - "any": Allow dropping anywhere. Allows reordering the children. This is the default.
   * @default "any"
   */
  placement?: "start" | "end" | "edges" | "any";

  /**
   * Specifies the direction in which the end-user drags.
   * - "vertical": Dragging is vertically (up/down)
   * - "horizontal": Dragging is done horizontally (left/right)
   * @default "vertical"
   */
  direction?: "vertical" | "horizontal";

  /**
   * Allow a drop even if the draggable is not directly targeting a dropzone or the placeholder.
   * @default true
   */
  loose?: boolean;
};
```
