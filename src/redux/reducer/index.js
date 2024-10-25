import { combineReducers } from "redux";
import handleCart from './handleCart';
import handleWishlist from './handleWishlist'; // Import your wishlist reducer

const rootReducers = combineReducers({
    handleCart,
    handleWishlist // Add the wishlist reducer here
});

export default rootReducers;
