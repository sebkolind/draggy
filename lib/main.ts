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

  addEventListener("dragstart", (ev) => {
    onStart?.();

    const t = ev.target as Element;
    dragged = t;
    t.classList.add(classNames.dragging);
  });

  addEventListener("dragend", (ev) => {
    onEnd?.();

    const t = ev.target as Element;
    t.classList.remove(classNames.dragging);
    clone?.remove();
  });

  addEventListener("dragleave", (ev) => {
    onLeave?.();

    const t = ev.target as Element;
    t.classList.remove(classNames.hovered);
    dragged?.classList.remove(classNames.hovering);
  });

  const dropzones = document.querySelectorAll(dropzone);
  for (let idx = 0; idx < dropzones.length; idx++) {
    const el = dropzones[idx];
    if (!el) return;

    el.classList.add(classNames.dropzone);
    el.addEventListener("dragover", (e) => {
      const ev = e as DragEvent;

      ev.preventDefault();

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

      const x = ev.clientX;
      const y = ev.clientY;
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

    el.addEventListener("drop", (ev) => {
      ev.preventDefault();

      const t = ev.target as Element;
      el.classList.remove(classNames.hovered);

      const isPlaceholder = t.classList.contains(PLACEHOLDER_CN);
      if ((isPlaceholder || isDropzone({ el: t })) && dragged) {
        onDrop?.();

        dragged.classList.remove(classNames.dragging, classNames.hovering);

        if (isPlaceholder) {
          t.replaceWith(dragged);
        } else {
          t.append(dragged);
        }
      }
    });
  }
}

export { draggy };
