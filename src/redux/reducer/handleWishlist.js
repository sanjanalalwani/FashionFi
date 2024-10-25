// Retrieve initial state from localStorage if available
const getInitialWishlist = () => {
  const storedWishlist = localStorage.getItem("wishlist");
  return storedWishlist ? JSON.parse(storedWishlist) : [];
};

const handleWishlist = (state = getInitialWishlist(), action) => {
  const product = action.payload;
  let updatedWishlist;

  switch (action.type) {
      case "ADD_TO_WISHLIST":
          // Check if product is already in wishlist
          const exist = state.find((x) => x.id === product.id);
          if (!exist) {
              updatedWishlist = [...state, { ...product }]; // Ensure the full product including image is added
              // Update localStorage
              localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
              return updatedWishlist;
          }
          // If product already exists, just return the current state
          return state;

      case "REMOVE_FROM_WISHLIST":
          updatedWishlist = state.filter((x) => x.id !== product.id);
          // Update localStorage
          localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
          return updatedWishlist;

      default:
          return state;
  }
};

export default handleWishlist;