type Config = {
  draggable: string;
  dropzone: string;
  isDropzone: (context: { el: Element }) => boolean;
  onDragStart?: () => void;
  onDragLeave?: () => void;
  onDragEnd?: () => void;
  onDragOver?: () => void;
  onDrop?: () =>
    | void
    | ((context: { dragged: Element; target: Element }) => void);
};

export { Config };
