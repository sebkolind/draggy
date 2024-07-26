# Reference

## `Context`

```ts
type Context = {
  // The element being dragged
  origin: HTMLElement | null;
  // The current zone
  zone: HTMLElement | null;
  // All the available zones
  zones: HTMLElement[];
  // The shadow element
  shadow: HTMLElement | null;
  // The items selected for a multi drag
  multiple: Draggable[];
};
```

## `Draggable`

```ts
type Draggable = {
  origin: HTMLElement | null;
  // The original zone the dragged came from
  originZone: HTMLElement | null;
  // The next sibling to the origin
  nextSibling: HTMLElement | null;
  // Styles to use after the drop
  style: {
    display: string;
  };
};
```

## `CustomShadow`

```ts
type CustomShadow = {
  el: HTMLElement;
  /**
   * The drag offset from the top left corner of the element.
   * @default { x: 0, y: 0 }
   */
  offset?: { x: number; y: number };
};
```

## `EventHandler`

All lifecycle events will be a version of this generic.

```ts
type EventHandler<T = void> = (event: Event, context: Context) => T;
```
