type Context = {
  origin: HTMLElement | null;
  originZone: HTMLElement | null;
  nextSibling: HTMLElement | null;
  zone: HTMLElement | null;
  zones: HTMLElement[];
  shadow: HTMLElement | null;
  children: HTMLElement[];
  events: Map<HTMLElement, (ev: MouseEvent) => void>;
  removeMouseMove: (() => void) | null;
  delay: number;
  lastMove: number;
  multiple: Draggable[];
  options: Omit<Options, "target">;
};

type Draggable = Pick<Context, "origin" | "originZone" | "nextSibling"> & {
  style: {
    display: string;
  };
};

type Options = {
  target: string | Element | Element[] | NodeListOf<Element> | null;
  /**
   * Event handler triggered when dragging starts.
   */
  onStart?: EventHandler;
  /**
   * Event handler triggered when the draggable leaves a zone.
   */
  onLeave?: EventHandler;
  /**
   * Event handler triggered when the draggable enters a zone.
   */
  onEnter?: EventHandler;
  /**
   * Event handler triggered when the draggable is over a zone.
   */
  onOver?: EventHandler;
  /**
   * Event handler triggered before the draggable is dropped.
   * Returns `true` to allow the drop, or `false` to disallow it.
   */
  onBeforeDrop?: EventHandler<boolean>;
  /**
   * Event handler triggered when the draggable is dropped.
   */
  onDrop?: EventHandler;
  /**
   * Event handler to create a custom shadow element.
   * Will override the default shadow behavior.
   */
  onCreateShadow?: EventHandler<CustomShadow>;
  /**
   * Specifies where a draggable can be dropped.
   * - "start": Only allow dropping at the start. With direction=vertical this is the top, and direction=horizontal is to the right.
   * - "end": Only allow dropping at the end. With direction=vertical this is the bottom, and direction=horizontal is to the left.
   * - "edges": Allow dropping at both the start and end.
   * - "any": Allow dropping anywhere. Allows reordering the children. This is the default.
   * @default "any"
   */
  placement?: "start" | "end" | "edges" | "any";
  /**
   * Specifies the direction in which the end-user drags.
   * - "vertical": Dragging is vertically (up/down)
   * - "horizontal": Dragging is done horizontally (left/right)
   * @default "vertical"
   */
  direction?: "vertical" | "horizontal";
  /**
   * Allow a drop even if the draggable is not directly targeting a dropzone or the placeholder.
   * @default true
   */
  loose?: boolean;
  /**
   * Prepare a drop even if draggable isn't close to other draggables
   * @default true
   */
  optimistic?: boolean;
};

type CustomShadow = {
  el: HTMLElement;
  /**
   * The drag offset from the top left corner of the element.
   * @default { x: 0, y: 0 }
   */
  offset?: { x: number; y: number };
};

type EventHandler<T = void> = (
  event: Event,
  context: Pick<Context, "origin" | "zone"> &
    Partial<Pick<Context, "shadow" | "multiple">>,
) => T;

export { Context, Options };
