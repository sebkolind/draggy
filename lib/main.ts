import { Config } from "./types";

function draggy({
  draggable,
  dropzone,
  isDropzone,
  onDragStart,
  onDragLeave,
  onDragEnd,
  onDragOver,
  onDrop,
}: Config) {
  let dragged: Element | null = null;

  document.querySelectorAll(draggable).forEach((el) => {
    if (!el.hasAttribute("draggable")) {
      el.setAttribute("draggable", "true");
    }
  });

  addEventListener("dragstart", (ev) => {
    onDragStart?.();

    const t = ev.target as Element;
    dragged = t;

    t.classList.add("draggy-dragging");
  });

  addEventListener("dragend", (ev) => {
    onDragEnd?.();

    const t = ev.target as Element;
    t.classList.remove("draggy-dragging");
  });

  addEventListener("dragleave", (ev) => {
    onDragLeave?.();

    const t = ev.target as Element;
    t.classList.remove("draggy-hovered");

    dragged?.classList.remove("draggy-hovering");
  });

  document.querySelectorAll(dropzone).forEach((el) => {
    el.addEventListener("dragover", (ev) => {
      ev.preventDefault();

      onDragOver?.();

      const t = ev.target as Element;
      t.classList.add("draggy-hovered");

      dragged?.classList.add("draggy-hovering");
    });

    el.addEventListener("drop", (ev) => {
      ev.preventDefault();

      const t = ev.target as Element;
      t.classList.remove("draggy-hovered");

      if (isDropzone({ el: t }) && dragged) {
        const handler = onDrop?.();

        dragged.classList.remove("draggy-dragging", "draggy-hovering");

        if (handler) {
          handler({ dragged, target: t });
        } else {
          t.append(dragged);
        }
      }
    });
  });
}

export { draggy };
