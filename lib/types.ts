type Options = {
  draggable: string;
  dropzone: string;
  isDropzone: (context: { el: Element }) => boolean;
  classNames?: {
    draggable?: string;
    dropzone?: string;
    dragging?: string;
    hovering?: string;
    hovered?: string;
  };
  onDragStart?: () => void;
  onDragLeave?: () => void;
  onDragEnd?: () => void;
  onDragOver?: () => void;
  onDrop?: () =>
    | void
    | ((context: { dragged: Element; target: Element }) => void);
};

export { Options };
