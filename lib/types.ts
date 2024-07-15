type Options = {
  draggable: string;
  dropzone: string;
  isDropzone?: (context: Event) => boolean;
  onStart?: () => void;
  onLeave?: () => void;
  onEnd?: () => void;
  onOver?: () => void;
  onDrop?: () => void;
};

type Child = {
  x: number;
  y: number;
  height: number;
  width: number;
  el: Element;
};

export { Options, Child };
