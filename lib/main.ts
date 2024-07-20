import { CLASSNAMES } from "./constants";
import { Options } from "./types";
import { isElement } from "./utils";

function draggy(options: Options) {
  // The original parent when starting to drag
  let parent: Element | null = null;
  // The next sibling of the dragged element.
  // Used to put the element back if a drop fails etc.
  let nextSibling: Element | null = null;
  // All children of the targets
  let allChildren: Element[] = [];
  // The dragged element.
  let dragged: HTMLElement | null = null;
  // The shadow element that follows the cursor.
  let shadow: HTMLElement | null = null;

  const {
    target,
    onStart,
    onLeave,
    onEnd,
    onOver,
    onBeforeDrop,
    onDrop,
    placement = "any",
    direction = "vertical",
    loose = true,
  } = options;

  const setupDragStart = (e: DragEvent, c: Element, p: Element) => {
    if (e.target !== c) e.preventDefault();

    parent = p;
    nextSibling = c.nextElementSibling;

    onStart?.(e);

    const t = e.target as HTMLElement;

    if (!shadow) {
      shadow = t.cloneNode(true) as HTMLElement;
      shadow.classList.add(CLASSNAMES.dragging);
      shadow.style.position = "absolute";
      shadow.style.pointerEvents = "none";
      shadow.style.width = `${t.offsetWidth}px`;
      shadow.style.height = `${t.offsetHeight}px`;
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

    for (let i = 0; i < allChildren.length; i++) {
      const c = allChildren[i];
      if (!c) return;
      // Allow dropping on other draggables
      if (isElement(c) && dragged !== c) c.style.pointerEvents = "none";
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
    shadow.style.opacity = "1";
    shadow.style.left = `${e.clientX - offsets.x + scrollX}px`;
    shadow.style.top = `${e.clientY - offsets.y + scrollY}px`;
  };

  document.addEventListener("dragend", (e) => {
    onEnd?.(e);

    if (!isElement(e.target)) return;
    e.target.classList.remove(CLASSNAMES.origin);
    shadow?.remove();
    shadow = null;
    dragged = null;

    for (let i = 0; i < allChildren.length; i++) {
      const c = allChildren[i];
      if (c && isElement(c)) {
        c.style.pointerEvents = "";
        if (c.style.length === 0) c.removeAttribute("style");
      }
    }
  });

  document.addEventListener("dragleave", (e) => {
    onLeave?.(e);
  });

  const dropzones =
    typeof target === "string"
      ? document.querySelectorAll(target)
      : target instanceof NodeList || Array.isArray(target)
        ? target
        : [target];

  for (let i = 0; i < dropzones.length; i++) {
    const dz = dropzones[i];
    if (!dz) return;

    const children = dz.children;
    for (let i = 0; i < children.length; i++) {
      const c = children[i];
      if (!c) return;

      allChildren.push(c);
      c.setAttribute("draggable", "true");
      c.classList.add(CLASSNAMES.draggable);
      c.addEventListener("dragstart", (e) =>
        setupDragStart(e as DragEvent, c, dz),
      );
    }

    dz.classList.add(CLASSNAMES.dropzone);

    dz.addEventListener("dragover", (e) => {
      if (!(e instanceof DragEvent) || !dragged) return;
      const x = e.clientX;
      const y = e.clientY;

      e.preventDefault();
      onOver?.(e);

      if (placement === "start" || placement === "end") {
        if (placement === "start") {
          dz.prepend(dragged);
        } else {
          dz.append(dragged);
        }

        return;
      }

      if (placement === "edges") {
        const rect = dz.getBoundingClientRect();
        const bottom = y > rect.y + rect.height / 2;
        const right = x > rect.x + rect.width / 2;
        const dir = direction === "vertical" ? bottom : right;

        if (dir) {
          dz.append(dragged);
        } else {
          dz.prepend(dragged);
        }

        return;
      }

      for (let i = 0; i < children.length; i++) {
        const c = children[i];
        if (!c) break;

        const rect = c.getBoundingClientRect();
        if (
          // horizontal boundaries
          x > rect.x &&
          x < rect.x + rect.width &&
          // vertical boundaries
          y > rect.y &&
          y < rect.y + rect.height
        ) {
          const bottom = y > rect.y + rect.height / 2;
          const right = x > rect.x + rect.width / 2;
          const dir = direction === "vertical" ? bottom : right;
          const where = dir ? c : c.nextSibling;
          if (where === dragged || where === dragged.nextSibling) continue;
          dz.insertBefore(dragged, where);
          break;
        }

        // Will append if not close to other draggables
        if (dz.contains(dragged)) continue;
        dz.append(dragged);
      }
    });
  }

  document.addEventListener("drop", (e) => {
    e.preventDefault();
    if (!isElement(e.target) || !dragged || !parent) return;

    const dropzone = dragged.parentElement;

    // Return to position before dragstart
    const returnToStart = () =>
      parent && dragged && parent.insertBefore(dragged, nextSibling);

    if (onBeforeDrop) {
      const bool = onBeforeDrop(e, {
        dragged,
        dropzone,
      });

      if (!bool) {
        returnToStart();
        return;
      }
    }

    if (
      e.target.classList.contains(CLASSNAMES.dropzone) ||
      e.target.classList.contains(CLASSNAMES.origin) ||
      loose
    ) {
      onDrop?.(e, { dragged, dropzone });
    } else {
      returnToStart();
    }
  });
}

export { draggy };
