# Restrict a Drop

You might want to restrict a drop on a certain zone based on some conditions.
For this you can use the [`onBeforeDrop()`](/events#onbeforedrop) event.

## A To-do app

This is a demonstration on how to restrict drops based on the status of each column using the `onStart`, `onDrop` and `onBeforeDrop` event.
It will make sure that tasks can only be moved to columns with a different status.

```html
<div class="columns">
  <div class="column" data-status="todo">
    <div class="task">Task 1</div>
    <div class="task">Task 2</div>
    <div class="task">Task 3</div>
  </div>
  <div class="column" data-status="in-progress">
    <div class="task">Task 4</div>
    <div class="task">Task 5</div>
  </div>
  <div class="column" data-status="done">
    <div class="task">Task 6</div>
  </div>
</div>
```

```ts
draggy({
  target: ".column",
  onStart(_, { origin }) {
    // Set the data-status on the dragged element
    // This allows us to check the status in `onBeforeDrop`
    if (origin) {
      origin.dataset.status = originZone?.dataset.status;
    }
  },
  onBeforeDrop(_, { origin, zone }) {
    const status = zone?.dataset.status;
    const currentStatus = origin?.dataset.status;

    // Allow dropping on a zone with a different status
    return status !== currentStatus;
  },
  onDrop(_, { origin }) {
    // Remove the data-status from the dragged element
    if (origin) {
      delete origin.dataset.status;
    }
  },
});
```
