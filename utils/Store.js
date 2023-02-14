const { createContext, useReducer } = require("react");

export const Store = createContext();

const initialStore = {
  cart: { cartItems: [] },
};

function reducer(state, action) {
  switch (action.type) {
    case "CART_ADD_ITEM": {
      const newItem = action.payload;
      const exisItem = state.cart.cartItems.find(
        (item) => item.slug === newItem.slug
      );
      const cartItems = exisItem
        ? state.cart.cartItems.map((item) =>
            item.name === exisItem.name ? newItem : item
          )
        : [...state.cart.cartItems, newItem];

      return { ...state, cart: { ...state.cart, cartItems } };
    }
    default:
      return state;
  }
}

export function StoreProvide({ children }) {
  const [state, dispatch] = useReducer(reducer, initialStore);
  const value = { state, dispatch };
  return <Store.Provider value={value}>{children}</Store.Provider>;
}
