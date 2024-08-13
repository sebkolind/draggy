# Svelte

This is how you initialize in Svelte.

In this example we are using the `onMount` and `onDestroy` lifecycle functions to initialize and destroy the draggy instance. We are also using the `bind:this` directive to get a reference to the target element.

:::tip NOTE
It is important to destroy the draggy instance when the component is destroyed to avoid memory leaks. This is done in the `onDestroy` lifecycle function.
:::

```svelte
<script>
  import { onMount, onDestroy } from "svelte";
  import { draggy } from "@sebkolind/draggy";

  let drag;
  let target;

  let items = [
    { id: 1, title: "Draggable #1" },
    { id: 2, title: "Draggable #2" },
    { id: 3, title: "Draggable #3" },
  ];

  onMount(() => {
    drag = draggy({ target });
  });

  onDestroy(() => {
    drag.destroy();
  });
</script>

<div bind:this={target}>
  {#each items as item (item.id)}
    <div>{item.title}</div>
  {/each}
</div>
```