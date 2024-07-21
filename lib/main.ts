import { Options } from "./types";
import { isElement } from "./utils";

type Context = {
  origin: HTMLElement | null;
  originZone: HTMLElement | null;
  nextSibling: HTMLElement | null;
  zone: HTMLElement | null;
  zones: HTMLElement[];
  shadow: HTMLElement | null;
  children: HTMLElement[];
  onMouseMoveUnsubscribe: (() => void) | null;
  delay: number;
  lastMove: number;
  options: Omit<Options, "target" | "onBeforeDrop" | "onDrop">;
};

function draggy({ target, onBeforeDrop, onDrop, ...options }: Options) {
  const context: Context = {
    origin: null,
    originZone: null,
    nextSibling: null,
    zone: null,
    zones: [],
    shadow: null,
    children: [],
    onMouseMoveUnsubscribe: null,
    delay: 100,
    lastMove: -1,
    options: {
      ...options,
      optimistic: true,
    },
  };

  const dropzones =
    typeof target === "string"
      ? document.querySelectorAll(target)
      : target instanceof NodeList || Array.isArray(target)
        ? target
        : [target];

  for (let i = 0; i < dropzones.length; i++) {
    const dz = dropzones[i];
    if (!dz) break;

    if (!isElement(dz)) break;
    context.zones.push(dz);

    const ch = dz.children;
    for (let i = 0; i < ch.length; i++) {
      const c = ch[i];
      if (!c || !isElement(c)) break;

      context.children.push(c);
      setupItem(context, c);
    }
  }

  const onMouseUp = (ev: MouseEvent) => {
    ev.preventDefault();

    if (onBeforeDrop && context.originZone && context.origin) {
      const bool = onBeforeDrop(ev, {
        dragged: context.origin,
        dropzone: context.zone,
      });

      if (!bool) {
        context.originZone.insertBefore(context.origin, context.nextSibling);
      }
    }

    if (onDrop && context.origin) {
      onDrop(ev, { dragged: context.origin, dropzone: context.zone });
    }

    context.shadow?.remove();
    context.shadow = null;

    context.origin?.classList.remove("placeholder");
    context.origin = null;

    context.onMouseMoveUnsubscribe?.();

    handleChildren(context);
  };
  document.addEventListener("mouseup", onMouseUp);

  return {
    destroy: () => {
      document.removeEventListener("mouseup", onMouseUp);
    },
  };
}

const setupItem = (context: Context, el: HTMLElement) => {
  el.addEventListener("mousedown", (ev) => {
    ev.preventDefault();

    handleMouseDown(context, ev, el);
  });
};

const handleMouseDown = (context: Context, ev: MouseEvent, el: HTMLElement) => {
  context.shadow = createShadow(context, el, ev.clientX, ev.clientY);

  el.classList.add("placeholder");
  context.origin = el;

  context.originZone = el.parentElement;
  context.nextSibling = el.nextElementSibling as HTMLElement | null;

  handleChildren(context);
};

const createShadow = (
  context: Context,
  el: HTMLElement,
  clientX: number,
  clientY: number,
) => {
  const shadow = el.cloneNode(true) as HTMLElement;

  shadow.classList.add("dragging");
  shadow.style.position = "absolute";
  shadow.style.pointerEvents = "none";
  shadow.style.width = `${el.offsetWidth}px`;
  shadow.style.height = `${el.offsetHeight}px`;
  shadow.style.zIndex = "9999";

  const rect = el.getBoundingClientRect();
  const offsets = { x: clientX - rect.left, y: clientY - rect.top };

  shadow.style.left = `${clientX - offsets.x + scrollX}px`;
  shadow.style.top = `${clientY - offsets.y + scrollY}px`;

  const onMouseMove = (ev: Event) => handleMouseMove(ev, offsets);
  document.addEventListener("mousemove", onMouseMove);

  const handleMouseMove = (ev: Event, offsets: { x: number; y: number }) => {
    const e = ev as MouseEvent;
    e.preventDefault();

    const x = e.clientX;
    const y = e.clientY;

    // Make shadow follow the cursor
    shadow.style.left = `${x - offsets.x + scrollX}px`;
    shadow.style.top = `${y - offsets.y + scrollY}px`;

    // Check if the cursor is above a dropzone
    const hovered = document.elementFromPoint(x, y);
    const zones = context.zones;

    if (hovered && zones.length) {
      for (let i = 0; i < zones.length; i++) {
        const z = zones[i];
        if (!z) break;
        if (z.contains(hovered)) {
          if (context.zone !== z) context.zone = z;
          handlePushing(context, x, y, "vertical");
          break;
        }
      }
    }
  };

  context.onMouseMoveUnsubscribe = () =>
    document.removeEventListener("mousemove", onMouseMove);

  document.body.append(shadow);

  return shadow;
};

const handlePushing = (
  context: Context,
  x: number,
  y: number,
  direction = "vertical",
) => {
  if (!context.zone || !context.origin) {
    console.error("Error: Zone or origin is null. Cannot handle pushing.");
    return;
  }

  const currentTime = Date.now();
  const { lastMove, delay } = context;

  if (currentTime - lastMove < delay) return;

  const placeholder = context.origin;
  const z = context.zone;
  if (!placeholder || !z) {
    console.error(
      "Error: placeholder or zone is null. Cannot handle pushing.",
      context,
    );
    return;
  }

  const placement = context.options.placement;
  if (placement === "start" || placement === "end") {
    if (placement === "start") {
      context.zone.prepend(context.origin);
    } else {
      context.zone.append(context.origin);
    }

    return;
  }

  if (placement === "edges") {
    const rect = context.zone.getBoundingClientRect();
    const bottom = y > rect.y + rect.height / 2;
    const right = x > rect.x + rect.width / 2;
    const dir = direction === "vertical" ? bottom : right;

    if (dir) {
      context.zone.append(context.origin);
    } else {
      context.zone.prepend(context.origin);
    }

    return;
  }

  const children = Array.from(z.children).filter(
    (c) => c !== placeholder && !c.classList.contains("placeholder"),
  );
  const zones = children.map((c) => c.getBoundingClientRect());

  for (let i = 0; i < zones.length; i++) {
    const rect = zones[i];
    if (!rect) continue;
    const c = children[i];
    if (!c) continue;

    if (x > rect.left && x < rect.right && y > rect.top && y < rect.bottom) {
      const isBottomHalf = y > rect.top + rect.height / 2;
      const isRightHalf = x > rect.left + rect.width / 2;

      let targetNode: ChildNode | null = null;
      if (direction === "vertical") {
        targetNode = isBottomHalf ? c.nextSibling : c;
      } else {
        targetNode = isRightHalf ? c.nextSibling : c;
      }

      if (
        targetNode === placeholder ||
        targetNode === placeholder.nextSibling
      ) {
        continue;
      }

      z.insertBefore(placeholder, targetNode);

      context.lastMove = currentTime;
      break;
    }

    if (context.options.optimistic && !context.zone.contains(context.origin)) {
      context.zone.append(context.origin);
    }
  }
};

const handleChildren = (context: Context) => {
  const revert = context.shadow == null;
  for (let i = 0; i < context.children.length; i++) {
    const c = context.children[i];
    if (!c) return;
    if (revert) {
      c.style.pointerEvents = "";
      if (!c.style.length) c.removeAttribute("style");
    } else {
      c.style.pointerEvents = "none";
    }
  }
};

export { draggy };
