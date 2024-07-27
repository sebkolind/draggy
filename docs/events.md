# Events

These are the events that can be hooked into during the lifecycle of a drag&drop.

:::tip NOTE
The `EventHandler` is a generic that all events derive from. You can see it's definition [here](./reference#eventhandler).
:::

## `onStart` <Badge type="info" text="optional" />

- Type: `EventHandler`

Triggered when dragging starts.

## `onLeave` <Badge type="info" text="optional" />

- Type: `EventHandler`

Triggered when the draggable leaves a zone.

## `onEnter` <Badge type="info" text="optional" />

- Type: `EventHandler`

Triggered when the draggable enters a zone.

## `onOver` <Badge type="info" text="optional" />

- Type: `EventHandler`

Triggered when the draggable is over a zone.

## `onBeforeDrop` <Badge type="info" text="optional" />

- Type: `EventHandler<boolean>`

Triggered before the draggable is dropped. Return `true` to allow the drop, or `false` to disallow it.

## `onDrop` <Badge type="info" text="optional" />

- Type: `EventHandler`

Triggered when the draggable is dropped. If `onbeforeDrop` returns `false` this won't trigger.

## `onCreateShadow` <Badge type="info" text="optional" />

- Type: `EventHandler<CustomShadow>`
- See <a href="./reference#customshadow">reference</a> for `CustomShadow`

Triggered to create a custom shadow element. Will override the default shadow behavior.

:::tip NOTE
This won't work if [`enableShadow`](./options#enableshadow) is set to `false`.
:::

## `onEnd` <Badge type="info" text="optional" />

- Type: `EventHandler`

Triggered when the drag ends.
