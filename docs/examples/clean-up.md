# Clean-up (`destroy`)

To ensure proper clean-up you should use the `destroy` method returned by `draggy()`.
This will help avoid memory leaks and other potential issues.

```ts
import { draggy } from "@sebkolind/draggy";

const { destroy } = draggy({ target: ".container" });

// Call when `draggy` is no longer needed
destroy();
```

## Vue

When using Vue you can manage the initialization and destruction of the Draggy instance using Vue's lifecycle hooks.

```vue
<template>
  <div class="container">
    <div>Draggable</div>
    <div>Draggable</div>
    <div>Draggable</div>
  </div>
</template>

<script setup>
import { draggy } from "@sebkolind/draggy";

let instance;

onMounted(() => {
  instance = draggy({ target: ".container" });
});

onUnmounted(() => {
  instance?.destroy();
});
</script>
```

## React

If used with React you can use the `useEffect` hook to handle the
initialization and clean-up of the Draggy instance.

```tsx
import { useEffect } from "react";
import { draggy } from "@sebkolind/draggy";

const DraggableComponent = () => {
  useEffect(() => {
    const { destroy } = draggy({ target: ".container" });

    // Clean up on component unmount
    return () => {
      destroy();
    };
  }, []);

  return (
    <div className="container">
      <div>Draggable</div>
      <div>Draggable</div>
      <div>Draggable</div>
    </div>
  );
};

export { DraggableComponent };
```
