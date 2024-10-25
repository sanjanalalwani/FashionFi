import React from "react";
import { Footer, Navbar } from "../components"; // Ensure the path is correct
import { useSelector, useDispatch } from "react-redux";
import { removeWishlist } from "../redux/action";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

const Wishlist = () => {
  const wishlist = useSelector((state) => state.handleWishlist);
  const dispatch = useDispatch();

  // Function to remove an item from the wishlist
  const removeFromWishlist = (id) => {
    dispatch(removeWishlist(id));
    toast.success("Product removed from wishlist!");
  };

  // Component to display when the wishlist is empty
  const EmptyWishlist = () => {
    return (
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
  };

  // Component to display the wishlist items
  const ShowWishlist = () => {
    return (
      <div className="row">
        {wishlist.map((product) => (
          <div key={product.id} className="col-md-4 col-sm-6 col-xs-8 col-12 mb-4">
            <div className="card text-center h-100">
              <img
                className="card-img-top" // Use the card-img-top class
                src={product.image} // Display the product image
                alt={product.title}
                style={{ height: '300px', objectFit: 'contain' }} // Set fixed height and fit style
              />
              <div className="card-body">
                <h5 className="card-title">{product.title}</h5>
                <p className="card-text">{product.description}</p>
                <button className="btn btn-danger" onClick={() => removeFromWishlist(product.id)}>
                  Remove from Wishlist
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <>
      <Navbar />
      <div className="container my-3 py-3">
        <h2 className="display-5 text-center">Your Wishlist</h2>
        <hr />
        {/* Conditionally render the wishlist or empty state */}
        {wishlist.length > 0 ? <ShowWishlist /> : <EmptyWishlist />}
      </div>
      <Footer />
    </>
  );
};

export default Wishlist;