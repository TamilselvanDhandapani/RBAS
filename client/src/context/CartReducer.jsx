const isSameCartItem = (item, payload) =>
  item.id === payload.id && item.selectedSize === payload.selectedSize;

const findCartItem = (state, payload) =>
  state.find((item) => isSameCartItem(item, payload));

const CartReducer = (state, action) => {
  switch (action.type) {
    // 🔹 Set cart from backend
    case "SET_CART":
      return action.payload;

    // 🔹 Add item to cart
    case "ADD_ITEM": {
      if (!action.payload.selectedSize) {
        console.warn("Please select a size before adding to the cart.");
        return state;
      }

      const existingItem = findCartItem(state, action.payload);

      if (existingItem) {
        return state.map((item) =>
          isSameCartItem(item, action.payload)
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...state, { ...action.payload, quantity: 1 }];
    }

    // 🔹 Remove item
    case "REMOVE_ITEM":
      return state.filter((item) => !isSameCartItem(item, action.payload));

    // 🔹 Increase quantity
    case "INCREASE":
      return state.map((item) =>
        isSameCartItem(item, action.payload)
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );

    // 🔹 Decrease quantity (min 1)
    case "DECREASE":
      return state.reduce((acc, item) => {
        if (isSameCartItem(item, action.payload)) {
          if (item.quantity === 1) return acc; // prevent zero
          return [...acc, { ...item, quantity: item.quantity - 1 }];
        }
        return [...acc, item];
      }, []);

    // 🔹 Clear entire cart
    case "CLEAR_CART":
      return [];

    default:
      console.warn(`Unhandled action type: ${action.type}`);
      return state;
  }
};

export default CartReducer;
