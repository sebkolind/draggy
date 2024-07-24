import { CLASSNAMES } from "./constants";
import { Options, Context } from "./types";
import { getContext, isElement } from "./utils";

function draggy({ target, ...options }: Options) {
  const context: Context = {
    origin: null,
    originZone: null,
    nextSibling: null,
    zone: null,
    zones: [],
    shadow: null,
    children: [],
    events: new Map(),
    removeMouseMove: null,
    delay: 100,
    lastMove: -1,
    multiple: [],
    options: {
      optimistic: true,
      direction: "vertical",
      placement: "any",
      loose: true,
      selection: {
        enabled: false,
      },
      ...options,
    },
  };

  const zones =
    typeof target === "string"
      ? document.querySelectorAll(target)
      : target instanceof NodeList || Array.isArray(target)
        ? target
        : [target];

  for (let i = 0; i < zones.length; i++) {
    const z = zones[i];
    if (!z) break;

    if (!isElement(z)) break;
    context.zones.push(z);

    const ch = z.children;
    for (let i = 0; i < ch.length; i++) {
      const c = ch[i];
      if (!c || !isElement(c)) break;

      context.children.push(c);

      const onMouseDown = (ev: MouseEvent) => {
        ev.preventDefault();
        handleMouseDown(context, ev, c);
      };
      c.addEventListener("mousedown", onMouseDown);
      context.events.set(c, onMouseDown);
    }
  }

  const onMouseUp = (ev: MouseEvent) => {
    ev.preventDefault();

    context.options.onEnd?.(ev, getContext(context));

    if (!context.origin || !context.originZone || !context.shadow) {
      return;
    }

    if (context.options.onBeforeDrop) {
      const bool = context.options.onBeforeDrop(ev, getContext(context));

      if (!bool) {
        context.originZone.insertBefore(context.origin, context.nextSibling);
      }
    }

    if (!context.zone && !context.options.loose) {
      context.originZone.insertBefore(context.origin, context.nextSibling);
    }

    context.options.onDrop?.(ev, getContext(context));

    context.shadow.remove();
    context.shadow = null;

    if (context.multiple.length) {
      for (let i = 0; i < context.multiple.length; i++) {
        const m = context.multiple[i];
        if (!m || !m.origin) return;
        context.zone?.insertBefore(m.origin, context.origin.nextElementSibling);
        m.origin.style.display = m.style.display;
        m.origin.classList.remove(CLASSNAMES.selection);
      }

      context.multiple = [];
    }

    context.origin.classList.remove(CLASSNAMES.origin);
    context.origin = null;

    context.removeMouseMove?.();

    handleChildren(context);
  };
  document.addEventListener("mouseup", onMouseUp);

  return {
    destroy: () => {
      document.removeEventListener("mouseup", onMouseUp);
      for (const [el, handler] of context.events) {
        if (document.body.contains(el)) {
          el.removeEventListener("mousedown", handler);
        } else {
          context.events.delete(el);
        }
      }
    },
  };
}

const handleMouseDown = (context: Context, ev: MouseEvent, el: HTMLElement) => {
  if (context.options.selection?.enabled) {
    const mod = context.options.selection.modifier ?? "shift";
    const shift = mod === "shift" && ev.shiftKey;
    const meta = mod === "meta" && ev.metaKey;
    const alt = mod === "alt" && ev.altKey;
    const ctrl = mod === "ctrl" && ev.ctrlKey;

    if (shift || meta || alt || ctrl) {
      context.multiple.push({
        origin: el,
        style: {
          display: el.style.display,
        },
        originZone: el.parentElement,
        nextSibling: el.nextElementSibling as HTMLElement | null,
      });

      el.classList.add(CLASSNAMES.selection);

      return;
    }
  }

  context.shadow = createShadow(context, ev, el);

  el.classList.add(CLASSNAMES.origin);
  context.origin = el;

  if (context.multiple.length) {
    for (let i = 0; i < context.multiple.length; i++) {
      const m = context.multiple[i];
      if (!m?.origin) return;
      if (m.origin !== context.origin) {
        m.origin.style.display = "none";
      }
    }
  }

  context.originZone = el.parentElement;
  context.nextSibling = el.nextElementSibling as HTMLElement | null;

  context.options.onStart?.(ev, getContext(context));

  handleChildren(context);
};

const createShadow = (context: Context, ev: MouseEvent, el: HTMLElement) => {
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

  const rect = el.getBoundingClientRect();
  const offset = customShadow
    ? { x: customShadow.offset?.x ?? 0, y: customShadow.offset?.y ?? 0 }
    : { x: ev.clientX - rect.left, y: ev.clientY - rect.top };

  shadow.style.left = `${ev.clientX - offset.x + scrollX}px`;
  shadow.style.top = `${ev.clientY - offset.y + scrollY}px`;

  const onMouseMove = (ev: Event) => handleMouseMove(ev, offset);
  document.addEventListener("mousemove", onMouseMove);

  const handleMouseMove = (ev: Event, offset: { x: number; y: number }) => {
    const e = ev as MouseEvent;
    e.preventDefault();

    const x = e.clientX;
    const y = e.clientY;

    shadow.style.left = `${x - offset.x + scrollX}px`;
    shadow.style.top = `${y - offset.y + scrollY}px`;

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

  document.body.append(shadow);

  return shadow;
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

/**
 * Handles the pointer events for the child elements of the zones.
 * If a drag is ongoing, it disables pointer events.
 * If not, it reverts the pointer events.
 *
 * @param {Context} context - The drag and drop context containing the state and options.
 */
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
