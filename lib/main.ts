import { CLASSNAMES } from "./constants";
import { setupShadow } from "./shadow";
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
      enableShadow: true,
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

    if (!context.origin || !context.originZone) {
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

    context.shadow?.remove();
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

  context.shadow = setupShadow(context, ev, el);

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
