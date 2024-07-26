# Use with Vue

This is how you initialize in Vue 3 using the Composition API.

:::tip NOTE
This example uses the Composition API, which is the recommended way to build Vue 3 components.
You can read more about how to use the Options API in [Vue's documentation here](https://vuejs.org/guide).
:::

```vue
<script setup lang="ts">
import { onMounted, ref } from "vue";
import { draggy } from "@sebkolind/draggy";

const target = ref(null);
const items = ref([
  { id: 1, title: "Draggable #1" },
  { id: 2, title: "Draggable #2" },
  { id: 3, title: "Draggable #3" },
]);

onMounted(() => {
  draggy({ target: target.value });
});
</script>

<template>
  <div ref="target">
    <div v-for="item in items" :key="item.id">
      {{ item.title }}
    </div>
  </div>
</template>
```
