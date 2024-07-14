import { CLASSNAMES } from "./constants";
import { Child, Options } from "./types";
import { isElement } from "./utils";

function draggy(options: Options) {
  let dragged: HTMLElement | null = null;
  let clone: HTMLElement | null = null;

  const {
    draggable,
    dropzone,
    isDropzone,
    onStart,
    onLeave,
    onEnd,
    onOver,
    onDrop,
  } = options;

  const draggables = document.querySelectorAll(draggable);
  for (let i = 0; i < draggables.length; i++) {
    const el = draggables[i];
    if (el) {
      el.setAttribute("draggable", "true");
      el.classList.add(CLASSNAMES.draggable);
    }
  }

  addEventListener("dragstart", (e) => {
    onStart?.();

    const t = e.target as HTMLElement;
    dragged = t;
    t.classList.add(CLASSNAMES.dragging);
  });

  addEventListener("dragend", (e) => {
    onEnd?.();

    if (!isElement(e.target)) return;
    e.target.classList.remove(CLASSNAMES.dragging);
    clone?.remove();
  });

  addEventListener("dragleave", (e) => {
    onLeave?.();

    if (!isElement(e.target)) return;
    e.target.classList.remove(CLASSNAMES.hovered);
    dragged?.classList.remove(CLASSNAMES.hovering);
  });

  const dropzones = document.querySelectorAll(dropzone);
  for (let i = 0; i < dropzones.length; i++) {
    const el = dropzones[i];
    if (!el) return;

    el.classList.add(CLASSNAMES.dropzone);

    const c: Child[] = [];
    el.querySelectorAll(`.${CLASSNAMES.draggable}`).forEach((x) => {
      const rect = x.getBoundingClientRect();
      c.push({
        x: rect.x,
        y: rect.y,
        height: rect.height,
        width: rect.width,
        el: x,
      });
    });

    el.addEventListener("dragover", (e) => {
      if (!(e instanceof DragEvent)) return;

      e.preventDefault();

      el.classList.add(CLASSNAMES.hovered);
      dragged?.classList.add(CLASSNAMES.hovering);

      onOver?.();

      const x = e.clientX;
      const y = e.clientY;
      if (!c.length) return;
      for (let i = 0; i < c.length; i++) {
        const op = c[i];
        if (!op) return;
        if (
          x < op.x + op.width &&
          x > op.x &&
          y < op.y + op.height &&
          y > op.y
        ) {
          if (!clone) {
            clone = dragged?.cloneNode() as HTMLElement;
            clone.style.height = `${dragged?.scrollHeight}px`;
            clone.className = CLASSNAMES.placeholder;
            clone.attributes.removeNamedItem("draggable");
          }
          const top = y < op.y + op.height / 2;
          const where = top ? op.el : op.el.nextSibling;
          if (
            dragged === op.el ||
            (dragged === op.el.nextElementSibling && !top) ||
            (dragged === op.el.previousElementSibling && top)
          ) {
            return;
          }
          if (where === clone || where === clone.nextSibling) return;
          el.insertBefore(clone, where);
          return;
        }
      }
    });

    el.addEventListener("drop", (e) => {
      e.preventDefault();

      if (!isElement(e.target)) return;
      el.classList.remove(CLASSNAMES.hovered);

      if (
        (e.target.classList.contains(CLASSNAMES.placeholder) ||
          isDropzone?.({ el: e.target })) &&
        dragged
      ) {
        onDrop?.();
        dragged.classList.remove(CLASSNAMES.dragging, CLASSNAMES.hovering);
        if (e.target.classList.contains(CLASSNAMES.placeholder)) {
          e.target.replaceWith(dragged);
        } else {
          e.target.append(dragged);
        }
      }
    });
  }
}

export { draggy };
