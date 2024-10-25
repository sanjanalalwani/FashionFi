import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { removeWishlist } from "../redux/action";
import toast from "react-hot-toast";

const Wishlist = () => {
  const wishlist = useSelector((state) => state.handleWishlist);
  const dispatch = useDispatch();

  const removeFromWishlist = (id) => {
    dispatch(removeWishlist(id));
    toast.success("Product removed from wishlist!");
  };

  return (
    <div className="container my-3 py-3">
      <h2 className="display-5 text-center">Your Wishlist</h2>
      <hr />
      <div className="row">
        {wishlist.length === 0 ? (
          <p className="text-center">Your wishlist is empty.</p>
        ) : (
          wishlist.map((product) => (
            <div key={product.id} className="col-md-4 col-sm-6 col-xs-8 col-12 mb-4">
              <div className="card text-center h-100">
                <img className="card-img-top p-3" src={product.image} alt={product.title} height={300} />
                <div className="card-body">
                  <h5 className="card-title">{product.title}</h5>
                  <p className="card-text">{product.description}</p>
                  <button className="btn btn-danger" onClick={() => removeFromWishlist(product.id)}>
                    Remove from Wishlist
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Wishlist;
