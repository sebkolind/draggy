import { CLASSNAMES } from "./constants";
import { Child, Options } from "./types";
import { isElement } from "./utils";

function draggy(options: Options) {
  let dragged: HTMLElement | null = null;
  let placeholder: HTMLElement | null = null;
  let shadow: HTMLElement | null = null;

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

    if (!shadow) {
      shadow = t.cloneNode(true) as HTMLElement;
      shadow.classList.add(CLASSNAMES.dragging);
      shadow.style.position = "absolute";
      shadow.style.pointerEvents = "none";
      shadow.style.width = `${t.clientWidth}px`;
      shadow.style.height = `${t?.clientHeight}px`;
      shadow.style.opacity = "0";
      document.body.append(shadow);
    }

    dragged = t;
    t.classList.add(CLASSNAMES.origin);

    e.dataTransfer?.setDragImage(shadow, 0, 0);
    const rect = t.getBoundingClientRect();
    const offsets = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    document.addEventListener("dragover", (e) =>
      updateShadowPosition(e, offsets),
    );
  });

  const updateShadowPosition = (
    e: DragEvent,
    offsets: { x: number; y: number },
  ) => {
    e.preventDefault();
    const x = e.clientX;
    const y = e.clientY;
    if (!shadow) return;
    shadow.style.opacity = "1";
    shadow.style.left = `${x - offsets.x}px`;
    shadow.style.top = `${y - offsets.y}px`;
  };

  addEventListener("dragend", (e) => {
    onEnd?.();

    if (!isElement(e.target)) return;
    e.target.classList.remove(CLASSNAMES.origin, CLASSNAMES.hovered);
    dragged?.classList.remove(CLASSNAMES.hovering);
    placeholder?.remove();
    shadow?.remove();
    shadow = null;
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

    el.addEventListener("dragover", (e) => {
      if (!(e instanceof DragEvent)) return;

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
          if (!placeholder) {
            placeholder = dragged?.cloneNode() as HTMLElement;
            placeholder.style.height = `${dragged?.scrollHeight}px`;
            placeholder.className = CLASSNAMES.placeholder;
            placeholder.attributes.removeNamedItem("draggable");
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
          if (where === placeholder || where === placeholder.nextSibling)
            return;
          el.insertBefore(placeholder, where);
          return;
        }
      }
    });

    el.addEventListener("drop", (e) => {
      e.preventDefault();
      if (!isElement(e.target)) return;

      el.classList.remove(CLASSNAMES.hovered);
      e.target.classList.remove(CLASSNAMES.hovered);

      if (
        (e.target.classList.contains(CLASSNAMES.placeholder) ||
          e.target.classList.contains(CLASSNAMES.dropzone) ||
          isDropzone?.({ el: e.target })) &&
        dragged
      ) {
        onDrop?.();
        dragged.classList.remove(CLASSNAMES.origin, CLASSNAMES.hovering);
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
