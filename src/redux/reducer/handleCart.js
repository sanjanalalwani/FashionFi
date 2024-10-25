// Retrieve initial state from localStorage if available
const getInitialCart = () => {
  const storedCart = localStorage.getItem("cart");
  return storedCart ? JSON.parse(storedCart) : [];
};

const handleCart = (state = getInitialCart(), action) => {
  const product = action.payload;
  let updatedCart;

  switch (action.type) {
    case "ADDITEM":
      // Check if the product is already in the cart
      const exist = state.find((x) => x.id === product.id);
      if (exist) {
        // Increase the quantity
        updatedCart = state.map((x) =>
          x.id === product.id ? { ...x, qty: x.qty + 1 } : x
        );
      } else {
        // Add new product to the cart with qty set to 1
        updatedCart = [...state, { ...product, qty: 1 }];
      }
      // Update localStorage
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      return updatedCart;

    case "DELITEM":
      const exist2 = state.find((x) => x.id === product.id);
      if (exist2) {
        if (exist2.qty === 1) {
          // Remove product from the cart if qty is 1
          updatedCart = state.filter((x) => x.id !== exist2.id);
        } else {
          // Decrease the quantity
          updatedCart = state.map((x) =>
            x.id === product.id ? { ...x, qty: x.qty - 1 } : x
          );
        }
        // Update localStorage
        localStorage.setItem("cart", JSON.stringify(updatedCart));
        return updatedCart;
      }
      return state; // If the product doesn't exist in the cart, return the current state

    default:
      return state;
  }
};

export default handleCart;