# Use with React

You can initialize by either using `useRef` or by simply using a selector string.

:::tip NOTE
It's considered "best practice" by some to use `useRef` since it ensures that
the element is indeed in the DOM. If you use the selector string, `document.querySelector*`
will be used internally, which might not work in some use cases.
:::

## With `useRef`

```tsx
import { useRef, useEffect } from "react";
import { draggy } from "@sebkolind/draggy";

const MyComponent = () => {
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current) {
      draggy({ target: ref.current });
    }
  }, []);

  return (
    <div ref={ref}>
      <div>Drag this</div>
      <div>Or this</div>
      <div>Or this one</div>
    </div>
  );
};
```

## With `useEffect` and selector

```tsx
import { useEffect } from "react";
import { draggy } from "@sebkolind/draggy";

const MyComponent = () => {
  useEffect(() => {
    draggy({ target: "#target" });
  }, []);

  return (
    <div id="target">
      <div>Drag this</div>
      <div>Or this</div>
      <div>Or this one</div>
    </div>
  );
};
```
