import { Context } from "./types";

const isElement = (target: EventTarget | null): target is HTMLElement => {
  return target instanceof HTMLElement;
};

const getContext = (context: Context) => {
  const { origin, zone, shadow, multiple, zones } = context;

  return {
    origin,
    zone,
    shadow,
    multiple,
    zones,
  };
};

export { isElement, getContext };
