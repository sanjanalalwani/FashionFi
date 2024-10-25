import React, { useState } from "react";
import { useSwipeable } from "react-swipeable";
import { useDispatch } from "react-redux";
import { addCart, addWishlist } from "../redux/action";
import toast from "react-hot-toast";

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handlers = useSwipeable({
    onSwipedLeft: () => setCurrentImageIndex((prevIndex) => (prevIndex + 1) % product.images.length),
    onSwipedRight: () => setCurrentImageIndex((prevIndex) => (prevIndex - 1 + product.images.length) % product.images.length),
  });

  const addProduct = () => {
    dispatch(addCart(product));
    toast.success(`${product.title} added to cart!`);
  };

  const addToWishlist = () => {
    dispatch(addWishlist(product));
    toast.success(`${product.title} added to wishlist!`);
  };

  const swipeLeft = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + product.images.length) % product.images.length);
  };

  const swipeRight = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % product.images.length);
  };

  return (
    <div className="col-md-4 col-sm-6 col-xs-8 col-12 mb-4">
      <div className="card text-center h-100">
        <div {...handlers} className="carousel-container">
          <img
            className="card-img-top p-3"
            src={product.images[currentImageIndex]}
            alt={`${product.title} ${currentImageIndex + 1}`}
            height={300}
          />
        </div>
        <div className="card-body">
          <h5 className="card-title">{product.title.substring(0, 12)}...</h5>
          <p className="card-text">{product.description.substring(0, 90)}...</p>
        </div>
        <ul className="list-group list-group-flush">
          <li className="list-group-item lead">Rs. {product.price}</li>
        </ul>
        <div className="card-body">
          <button className="btn btn-dark m-1" onClick={addProduct}>
            Add to Cart
          </button>
          <button className="btn btn-dark m-1" onClick={addToWishlist}>
            Add to Wishlist
          </button>
        </div>
        <div className="d-flex justify-content-between">
          <button className="btn btn-secondary" onClick={swipeLeft}>Swipe Left</button>
          <button className="btn btn-secondary" onClick={swipeRight}>Swipe Right</button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
