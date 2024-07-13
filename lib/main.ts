import { Options } from "./types";

function draggy(options: Options) {
  let dragged: Element | null = null;

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
    el.setAttribute("draggable", "true");
    el.classList.add(classNames.draggable);
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
  });

  addEventListener("dragleave", (ev) => {
    onLeave?.();

    const t = ev.target as Element;
    t.classList.remove(classNames.hovered);

    dragged?.classList.remove(classNames.hovering);
  });

  const dropzones = document.querySelectorAll(dropzone);
  for (let idx = 0; idx < dropzones.length; idx++) {
    const el = document.querySelectorAll(dropzone)[idx];

    el.classList.add(classNames.dropzone);

    el.addEventListener("dragover", (ev) => {
      ev.preventDefault();

      onOver?.();

      const t = ev.target as Element;
      t.classList.add(classNames.hovered);

      dragged?.classList.add(classNames.hovering);
    });

    el.addEventListener("drop", (ev) => {
      ev.preventDefault();

      const t = ev.target as Element;
      t.classList.remove(classNames.hovered);

      if (isDropzone({ el: t }) && dragged) {
        const handler = onDrop?.();

        dragged.classList.remove(classNames.dragging, classNames.hovering);

        if (handler) {
          handler({ dragged, target: t });
        } else {
          t.append(dragged);
        }
      }
    });
  }
}

export { draggy };
