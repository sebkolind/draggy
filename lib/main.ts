import { CLASSNAMES } from "./constants";
import { Child, Options } from "./types";
import { isElement } from "./utils";

function draggy(options: Options) {
  let dragged: HTMLElement | null = null;
  let shadow: HTMLElement | null = null;

  const { target, isDropzone, onStart, onLeave, onEnd, onOver, onDrop } =
    options;

  if (!target) {
    return;
  }

  const setup = (e: DragEvent, c: Element) => {
    if (e.target !== c) {
      e.preventDefault();
    }

    onStart?.();

    const t = e.target as HTMLElement;

    if (!shadow) {
      shadow = t.cloneNode(true) as HTMLElement;
      shadow.classList.add(CLASSNAMES.dragging);
      shadow.style.position = "absolute";
      shadow.style.pointerEvents = "none";
      shadow.style.width = `${t.offsetWidth}px`;
      shadow.style.opacity = "0";
      document.body.append(shadow);
    }

    dragged = t;
    dragged.classList.add(CLASSNAMES.origin);

    // Chromium browsers requires setting the drag image.
    // Safari is OK without the custom drag image, but requires an actual image if you do set it.
    if (e.dataTransfer) {
      const fake = document.createElement("img");
      fake.src =
        "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
      fake.style.opacity = "0";
      // Setting the data to empty string disables some odd drag artifcats in some browsers.
      e.dataTransfer.setData("text/plain", "");
      e.dataTransfer.setDragImage(fake, 0, 0);
      // Remove the green plus icon in Chromium browsers.
      e.dataTransfer.dropEffect = "move";
      e.dataTransfer.effectAllowed = "move";
    }

    const rect = t.getBoundingClientRect();
    const offsets = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    document.addEventListener("dragover", (e) =>
      updateShadowPosition(e, offsets),
    );
  };

  const updateShadowPosition = (
    e: DragEvent,
    offsets: { x: number; y: number },
  ) => {
    e.preventDefault();
    if (!shadow) return;
    const x = e.clientX;
    const y = e.clientY;
    const scroll = { x: scrollX, y: scrollY };
    shadow.style.opacity = "1";
    shadow.style.left = `${x - offsets.x + scroll.x}px`;
    shadow.style.top = `${y - offsets.y + scroll.y}px`;
  };

  document.addEventListener("dragend", (e) => {
    onEnd?.();

    if (!isElement(e.target)) return;
    e.target.classList.remove(CLASSNAMES.origin);
    shadow?.remove();
    shadow = null;
  });

  document.addEventListener("dragleave", (e) => {
    onLeave?.();

    if (!isElement(e.target)) return;
  });

  const dropzones =
    typeof target === "string"
      ? document.querySelectorAll(target)
      : target instanceof NodeList || Array.isArray(target)
        ? target
        : [target];
  for (let i = 0; i < dropzones.length; i++) {
    const el = dropzones[i];
    if (!el) return;

    const children = el.children;
    for (let i = 0; i < children.length; i++) {
      const c = children[i];
      if (!c) return;
      c.setAttribute("draggable", "true");
      c.classList.add(CLASSNAMES.draggable);
      c.addEventListener("dragstart", (e) => setup(e as DragEvent, c));
    }

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

      onOver?.();

      const x = e.clientX;
      const y = e.clientY;
      if (!c.length) return;
      if (!dragged) return;
      for (let i = 0; i < c.length; i++) {
        const op = c[i];
        if (!op) return;
        if (
          x < op.x + op.width &&
          x > op.x &&
          y < op.y + op.height &&
          y > op.y
        ) {
          const top = y < op.y + op.height / 2;
          const where = top ? op.el : op.el.nextSibling;
          if (
            dragged === op.el ||
            (dragged === op.el.nextElementSibling && !top) ||
            (dragged === op.el.previousElementSibling && top)
          ) {
            return;
          }
          if (where === dragged || where === dragged.nextSibling) return;
          el.insertBefore(dragged, where);
          return;
        }

        if (!isElement(e.target)) return;
        if (el.contains(dragged)) continue;
        const valid = isDropzone
          ? isDropzone(e)
          : e.target.classList.contains(CLASSNAMES.dropzone);
        if (valid) {
          el.append(dragged);
        }
      }
    });

    el.addEventListener("drop", (e) => {
      e.preventDefault();
      if (!isElement(e.target)) return;

      const valid = isDropzone
        ? isDropzone(e)
        : e.target.classList.contains(CLASSNAMES.dropzone);
      if (valid && dragged) {
        onDrop?.();
        dragged.classList.remove(CLASSNAMES.origin);
      }
    });
  }
}

export { draggy };
