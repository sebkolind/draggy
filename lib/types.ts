type Options = {
  target: string | Element | Element[] | NodeListOf<Element> | null;
  isDropzone?: (event: Event) => boolean;
  onStart?: (event: Event) => void;
  onLeave?: (event: Event) => void;
  onEnd?: (event: Event) => void;
  onOver?: (event: Event) => void;
  onDrop?: (event: Event) => void;
};

type Child = {
  x: number;
  y: number;
  height: number;
  width: number;
  el: Element;
};

export { Options, Child };
