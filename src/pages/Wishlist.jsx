import React, { useState } from "react";
import { Footer, Navbar } from "../components";
import { useSelector, useDispatch } from "react-redux";
import { addCart, removeWishlist } from "../redux/action";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import ARTryOn from "../components/ARTryOn";

const Wishlist = () => {
  const wishlist = useSelector((state) => state.handleWishlist);
  const dispatch = useDispatch();
  const [showAR, setShowAR] = useState(false);

  const removeFromWishlist = (id) => {
    dispatch(removeWishlist(id));
    toast.success("Product removed from wishlist!");
  };

  const addToCart = (product) => {
    dispatch(addCart(product));
    toast.success(`${product.title} added to cart!`);
  };

  const tryOnWishlist = () => {
    if (wishlist.length === 0) {
      toast.error("Your wishlist is empty. Add products to try them on!");
      return;
    }
    setShowAR(true);
  };

  const EmptyWishlist = () => (
    <div className="container">
      <div className="row">
        <div className="col-md-12 py-5 bg-light text-center">
          <h4 className="p-3 display-5">Your Wishlist is Empty</h4>
          <Link to="/" className="btn btn-outline-dark mx-4">
            <i className="fa fa-arrow-left"></i> Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );

  const ShowWishlist = () => (
    <div className="row">
      {wishlist.map((product) => (
        <div key={product.id} className="col-md-4 col-sm-6 col-xs-8 col-12 mb-4">
          <div className="card text-center h-100">
            <img
              className="card-img-top"
              src={product.image}
              alt={product.title}
              style={{ height: '300px', objectFit: 'contain' }}
            />
            <div className="card-body">
              <h5 className="card-title">{product.title}</h5>
              <p className="card-text">{product.description?.substring(0, 90)}...</p>
              <p className="card-text lead">Rs. {product.price}</p>
              <button className="btn btn-danger m-1" onClick={() => removeFromWishlist(product.id)}>
                Remove from Wishlist
              </button>
              <button className="btn btn-dark m-1" onClick={() => addToCart(product)}>
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <>
      <Navbar />
      <div className="container my-3 py-3">
        <button className="btn btn-dark m-1" onClick={tryOnWishlist}>
          Try On Your Wishlisted Products
        </button>
        <h2 className="display-5 text-center">Your Wishlist</h2>
        <hr />
        {wishlist.length > 0 ? <ShowWishlist /> : <EmptyWishlist />}
      </div>

      {showAR && (
        <ARTryOn
          products={wishlist}
          onClose={() => setShowAR(false)}
        />
      )}
      <Footer />
    </>
  );
};

export default Wishlist;