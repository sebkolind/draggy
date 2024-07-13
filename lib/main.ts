import { Options } from "./types";
import { isElement } from "./utils";

const PLACEHOLDER_CN = "draggy-placeholder";
const CLASSNAMES = {
  draggable: "draggy-draggable",
  dropzone: "draggy-dropzone",
  dragging: "draggy-dragging",
  hovering: "draggy-hovering",
  hovered: "draggy-hovered",
};

function draggy(options: Options) {
  let dragged: Element | null = null;
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
  for (let idx = 0; idx < draggables.length; idx++) {
    const el = draggables[idx];
    if (el) {
      el.setAttribute("draggable", "true");
      el.classList.add(CLASSNAMES.draggable);
    }
  }

  addEventListener("dragstart", (e) => {
    onStart?.();

    const t = e.target as Element;
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
  for (let idx = 0; idx < dropzones.length; idx++) {
    const el = dropzones[idx];
    if (!el) return;

    el.classList.add(CLASSNAMES.dropzone);
    el.addEventListener("dragover", (e) => {
      // the "dragover" event is not a DragEvent, for some reason...
      if (!(e instanceof DragEvent)) return;

      e.preventDefault();

      // i might want to find a better way to do this,
      // it's quite much on a 2ms loop [:
      const others = el.querySelectorAll(`.${CLASSNAMES.draggable}`);
      const othersPos = Array.from(others).map((o) => {
        const rect = o.getBoundingClientRect();
        return {
          x: rect.x,
          y: rect.y,
          height: rect.height,
          width: rect.width,
          el: o,
        };
      });

      onOver?.();

      const x = e.clientX;
      const y = e.clientY;
      for (let i = 0; i < othersPos.length; i++) {
        const op = othersPos[i];
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
            clone.className = PLACEHOLDER_CN;
            clone.attributes.removeNamedItem("draggable");
          }
          el.insertBefore(
            clone,
            y < op.y + op.height / 2 ? op.el : op.el.nextSibling,
          );
        }
      }

      el.classList.add(CLASSNAMES.hovered);
      dragged?.classList.add(CLASSNAMES.hovering);
    });

    el.addEventListener("drop", (e) => {
      e.preventDefault();

      if (!isElement(e.target)) return;
      el.classList.remove(CLASSNAMES.hovered);

      if (
        (e.target.classList.contains(PLACEHOLDER_CN) ||
          isDropzone({ el: e.target })) &&
        dragged
      ) {
        onDrop?.();
        dragged.classList.remove(CLASSNAMES.dragging, CLASSNAMES.hovering);
        if (e.target.classList.contains(PLACEHOLDER_CN)) {
          e.target.replaceWith(dragged);
        } else {
          e.target.append(dragged);
        }
      }
    });
  }
}

export { draggy };
