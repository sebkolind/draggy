import { Context } from "./types";

const isElement = (target: EventTarget | null): target is HTMLElement => {
  return target instanceof HTMLElement;
};

const clone = (element: Node): HTMLElement => {
  const clone = element.cloneNode(true);
  if (clone instanceof HTMLElement) {
    return clone;
  }

  throw new Error(
    "Attempt to clone node as HTML failed. Node is not of type HTMLElement.",
  );
};

const getContext = (context: Context) => {
  const { origin, zone, originZone, shadow, multiple, zones } = context;

  return {
    origin,
    originZone,
    zone,
    shadow,
    multiple,
    zones,
  };
};

export { isElement, clone, getContext };
