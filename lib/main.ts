import { Options } from "./types";

const PLACEHOLDER_CN = "draggy-placeholder";

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

  const defaultClassNames = {
    draggable: "draggy-draggable",
    dropzone: "draggy-dropzone",
    dragging: "draggy-dragging",
    hovering: "draggy-hovering",
    hovered: "draggy-hovered",
  };
  const classNames = {
    ...defaultClassNames,
    ...options.classNames,
  };

  const draggables = document.querySelectorAll(draggable);
  for (let idx = 0; idx < draggables.length; idx++) {
    const el = draggables[idx];
    if (el) {
      el.setAttribute("draggable", "true");
      el.classList.add(classNames.draggable);
    }
  }

  addEventListener("dragstart", (e) => {
    onStart?.();

    const t = e.target as Element;
    dragged = t;
    t.classList.add(classNames.dragging);
  });

  addEventListener("dragend", (e) => {
    onEnd?.();

    if (!isElement(e.target)) return;
    e.target.classList.remove(classNames.dragging);
    clone?.remove();
  });

  addEventListener("dragleave", (e) => {
    onLeave?.();

    if (!isElement(e.target)) return;
    e.target.classList.remove(classNames.hovered);
    dragged?.classList.remove(classNames.hovering);
  });

  const dropzones = document.querySelectorAll(dropzone);
  for (let idx = 0; idx < dropzones.length; idx++) {
    const el = dropzones[idx];
    if (!el) return;

    el.classList.add(classNames.dropzone);
    el.addEventListener("dragover", (e) => {
      // the "dragover" event is not a DragEvent, for some reason...
      if (!(e instanceof DragEvent)) return;

      e.preventDefault();

      // i might want to find a better way to do this,
      // it's quite much on a 2ms loop [:
      const others = el.querySelectorAll(`.${classNames.draggable}`);
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

      el.classList.add(classNames.hovered);
      dragged?.classList.add(classNames.hovering);
    });

    el.addEventListener("drop", (e) => {
      e.preventDefault();

      if (!isElement(e.target)) return;
      el.classList.remove(classNames.hovered);

      if (
        (e.target.classList.contains(PLACEHOLDER_CN) ||
          isDropzone({ el: e.target })) &&
        dragged
      ) {
        onDrop?.();
        dragged.classList.remove(classNames.dragging, classNames.hovering);
        if (e.target.classList.contains(PLACEHOLDER_CN)) {
          e.target.replaceWith(dragged);
        } else {
          e.target.append(dragged);
        }
      }
    });
  }
}

const isElement = (target: EventTarget | null): target is Element => {
  return target instanceof Element;
};

export { draggy };
