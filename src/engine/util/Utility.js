function hasOwnProperty(thing, property) {
  return Object.prototype.hasOwnProperty.call(thing, property);
};

export { hasOwnProperty as hasProperty };
