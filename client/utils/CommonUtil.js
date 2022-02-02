export const getCombinedArray = (cart, products) => {
  let combinedArray = [];
  for (let i = 0; i < cart.length; i++) {
    combinedArray.push({
      ...cart[i],
      ...products.find((item) => item.id === cart[i].id),
    });
    cart;
  }
  return combinedArray;
};

export const getPrice = (cart) => {
  let amount = 0;

  cart.forEach((item) => {
    amount += item.price * item.count;
  });
  return amount * 100;
};

export const updateOrAdd = (old, item) => {
  const i = old.findIndex((_item) => _item.id == item.id);
  if (i > -1) {
    old[i] = item;
  } else {
    old.push(item);
  }
  return [...old];
};

export const createUUID = () => {
  let str = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVXZ";
  let uuid = [];
  for (let i = 0; i < 12; i++) {
    uuid.push(str[Math.floor(Math.random() * str.length)]);
  }
  return uuid.join("");
};