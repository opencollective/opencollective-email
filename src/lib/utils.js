export const requireAttributes = (obj, attributes, getErrorMsg) => {
  attributes.map(attr => {
    if (!obj[attr]) {
      return new Error(getErrorMsg(attr));
    }
  });
  return true;
};
