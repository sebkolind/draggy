# Options

You can customize the experience by setting one or more of these options when initializing Draggy.

## `target`

- Type: `string | Element | Element[] | NodeListOf<Element> | null`

## `placement` <Badge type="info" text="optional" />

- Type: `"start" | "end" | "edges" | "any"`
- Default: `"any"`

Specifies where a draggable can be dropped.

- `start`: Only allow dropping at the start. With direction=vertical this is the top, and direction=horizontal is to the right.
- `end`: Only allow dropping at the end. With direction=vertical this is the bottom, and direction=horizontal is to the left.
- `edges`: Allow dropping at both the start and end.
- `any`: Allow dropping anywhere. Allows reordering the children. This is the default.

## `direction` <Badge type="info" text="optional" />

- Type: `"vertical" | "horizontal"`
- Default: `"vertical"`

Specifies the direction in which the user drags.

- `vertical`: Dragging is vertically (up/down).
- `horizontal`: Dragging is horizontally (left/right).

## `loose` <Badge type="info" text="optional" />

- Type: `boolean`
- Default: `true`

Allows a drop even if the draggable is not directly targeting a dropzone or the placeholder.

## `optimistic` <Badge type="info" text="optional" />

- Type: `boolean`
- Default: `true`

Prepares a drop even if draggable isn't close to other draggables.

## `selection` <Badge type="info" text="optional" />

- Type: `object`
- Default: `{ enabled: false, modifier: "shift" }`

Configuration for selecting multiple items.

- `enabled`: Enable selection.
  - Type: `boolean`
  - Default: `false`
- `modifier`: Specifies the key modifier to hold while clicking when selection is enabled.
  - Type: `"ctrl" | "alt" | "meta" | "shift"`
  - Default: `"shift"`

## `enableShadow` <Badge type="info" text="optional" />

Enable or disable shadow element creation during dragging.

- Type: `boolean`
- Default: `true`
