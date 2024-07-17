const isElement = (target: EventTarget | null): target is HTMLElement => {
  return target instanceof HTMLElement;
};

export { isElement };
