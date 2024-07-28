# Custom Shadow

This example shows how to create a custom shadow element.

::: tip NOTE
See <a href="/reference#customshadow">Reference -> Custom Shadow</a> for the return type of `onCreateShadow`.
:::

```ts
draggy({
  target: ".container",
  onCreateShadow() {
    const el = document.createElement("div");

    el.style.width = "200px";
    el.style.height = "200px";
    el.style.backgroundColor = "pink";
    el.style.borderRadius = "8px";

    el.textContent = "I am being dragged...";

    return { el };
  },
});
```

## Copy `origin`

The `onCreateShadow` event receives the `context` as the second argument.
In the `context` we can find the `origin` which is the element being dragged.
We can use this to make a copy and alter the look.

::: danger NOTE
It is important that you use `clone()` to avoid making changes to the original element.
If you don't, you would have to manually handle the mutations
that Draggy makes during a drag. If you _do_ want to handle this manually you can do so
by utilizing the <a href="/events">Events</a>.
:::

```ts
draggy({
  target: ".container",
  onCreateShadow(_, { origin }) {
    // Either clone the `origin`, or create a new element.
    const shadow = origin ? clone(origin) : document.createElement("div");

    // Define how the shadow should look
    shadow.style.width = "200px";
    shadow.style.height = "200px";
    shadow.style.backgroundColor = "pink";
    shadow.style.borderRadius = "8px";

    return {
      el: shadow,
      // Place the shadows center at the cursor.
      offset: {
        x: 100,
        y: 100,
      },
    };
  },
});
```
