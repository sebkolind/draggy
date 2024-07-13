type Options = {
  draggable: string;
  dropzone: string;
  isDropzone: (context: { el: Element }) => boolean;
  onStart?: () => void;
  onLeave?: () => void;
  onEnd?: () => void;
  onOver?: () => void;
  onDrop?: () => void;
};

export { Options };
