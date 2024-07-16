type Options = {
  target: string | Element | Element[] | NodeListOf<Element> | null;
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
