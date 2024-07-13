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
  onStart?: () => void;
  onLeave?: () => void;
  onEnd?: () => void;
  onOver?: () => void;
  onDrop?: () => void;
};

export { Options };
