import { CLASSNAMES } from "./constants";
import { Context } from "./types";
import { getContext } from "./utils";

const setupShadow = (context: Context, ev: MouseEvent, el: HTMLElement) => {
  const { shadow, offset: customOffset } = createShadow(ev, context, el);

  const rect = el.getBoundingClientRect();
  const offset = getOffset(ev, rect, customOffset);

  if (shadow) {
    shadow.style.left = `${ev.clientX - offset.x + scrollX}px`;
    shadow.style.top = `${ev.clientY - offset.y + scrollY}px`;
  }

  const onMouseMove = (ev: Event) => handleMouseMove(ev, offset);
  document.addEventListener("mousemove", onMouseMove);

  const handleMouseMove = (ev: Event, offset: { x: number; y: number }) => {
    const e = ev as MouseEvent;
    e.preventDefault();

    const x = e.clientX;
    const y = e.clientY;

    if (shadow) {
      shadow.style.left = `${x - offset.x + scrollX}px`;
      shadow.style.top = `${y - offset.y + scrollY}px`;
    }

    const point = document.elementFromPoint(x, y);
    if (!point) {
      console.error("Error: No element found at the current mouse position.");
      return;
    }

    if (context.zone && !context.zone.contains(point)) {
      context.options.onLeave?.(ev, getContext(context));
      context.zone = null;
    }

    const zones = context.zones;
    if (!zones.length) {
      console.error("Error: No valid drop zones available.");
      return;
    }

    for (let i = 0; i < zones.length; i++) {
      const z = zones[i];
      if (!z) break;
      if (z.contains(point)) {
        if (context.zone !== z) {
          context.zone = z;
          context.options.onEnter?.(ev, getContext(context));
        }
        context.options.onOver?.(ev, getContext(context));
        handlePushing(context, x, y);
        break;
      }
    }
  };

  context.removeMouseMove = () =>
    document.removeEventListener("mousemove", onMouseMove);

  if (shadow) {
    document.body.append(shadow);
  }

  return shadow;
};

const createShadow = (ev: MouseEvent, context: Context, el: HTMLElement) => {
  if (!context.options.enableShadow) {
    return { shadow: null, offset: { x: 0, y: 0 } };
  }

  const customShadow = context.options.onCreateShadow?.(
    ev,
    getContext(context),
  );
  const shadow = customShadow?.el ?? (el.cloneNode(true) as HTMLElement);

  shadow.classList.add(CLASSNAMES.dragging);

  if (customShadow?.el && !(customShadow.el instanceof HTMLElement)) {
    throw new Error(
      "Error: The custom shadow provided is not a valid HTMLElement.",
    );
  }

  if (!customShadow) {
    shadow.style.width = `${el.offsetWidth}px`;
    shadow.style.height = `${el.offsetHeight}px`;
  }

  shadow.style.zIndex = "9999";
  shadow.style.position = "absolute";
  shadow.style.pointerEvents = "none";

  return { shadow, offset: customShadow?.offset };
};

const getOffset = (
  ev: MouseEvent,
  rect: DOMRect,
  customOffset?: { x: number; y: number },
) => {
  return customOffset
    ? customOffset
    : { x: ev.clientX - rect.left, y: ev.clientY - rect.top };
};

const handlePushing = (context: Context, x: number, y: number) => {
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

  if (!z.children.length) {
    z.append(context.origin);
    context.lastMove = currentTime;
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
    const dir = context.options.direction === "vertical" ? bottom : right;

    if (dir) {
      context.zone.append(context.origin);
    } else {
      context.zone.prepend(context.origin);
    }

    return;
  }

  const children = Array.from(z.children).filter(
    (c) => c !== placeholder && !c.classList.contains(CLASSNAMES.origin),
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
      if (context.options.direction === "vertical") {
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
      const last = z.lastElementChild?.getBoundingClientRect();
      if (last && y > last.bottom) {
        context.zone.append(context.origin);
        context.lastMove = currentTime;
      }
    }
  }
};

export { setupShadow };
