const autoBind = (self) => {
  const proto = Object.getPrototypeOf(self);
  const propertyNames = Object.getOwnPropertyNames(proto);

  propertyNames.forEach((name) => {
    const descriptor = Object.getOwnPropertyDescriptor(proto, name);
    if (descriptor.value instanceof Function && name !== 'constructor') {
      self[name] = self[name].bind(self);
    }
  });
};

module.exports = autoBind;
