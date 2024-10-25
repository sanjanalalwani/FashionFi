// For Add Item to Cart
export const addCart = (product) =>{
    return {
        type:"ADDITEM",
        payload:product
    }
}

// For Delete Item to Cart
export const delCart = (product) =>{
    return {
        type:"DELITEM",
        payload:product
    }
}

export const addWishlist = (product) => {
    return {
      type: "ADD_TO_WISHLIST",
      payload: product,
    };
  };
  
  export const removeWishlist = (productId) => {
    return {
        type: "REMOVE_FROM_WISHLIST",
        payload: { id: productId }, // Wrap productId in an object
    };
};
