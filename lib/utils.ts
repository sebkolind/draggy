const isElement = (target: EventTarget | null): target is Element => {
  return target instanceof Element;
};

export { isElement };
