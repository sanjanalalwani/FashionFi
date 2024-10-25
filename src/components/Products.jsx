import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { addCart } from "../redux/action"; // Import the action to add products to the cart
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import Shirt1 from '../assets/Shirt1.png';
import Shirt2 from '../assets/Shirt2.png';
import Shirt3 from '../assets/Shirt3.png';

const Products = () => {
  const [filter, setFilter] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const dispatch = useDispatch();

  // Function to add product to cart using Redux dispatch
  const addProduct = (product) => {
    dispatch(addCart(product));
    toast.success(`${product.title} added to cart!`);
  };

  // Dummy product data
  const products = [
    {
      id: 1,
      title: "Men's Casual T-Shirt",
      description: "Comfortable and stylish T-shirt for men.",
      price: 200,
      image: Shirt1,
    },
    {
      id: 2,
      title: "Men's Casual T-Shirt",
      description: "Comfortable and stylish T-shirt for men.",
      price: 200,
      image: Shirt2,
    },
    {
      id: 3,
      title: "Men's Casual T-Shirt",
      description: "Comfortable and stylish T-shirt for men.",
      price: 200,
      image: Shirt3,
    },
  ];

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setLoading(false);
      setFilter(products);
    }, 1000);
  }, []);

  const Loading = () => {
    return (
      <>
        <div className="col-12 py-5 text-center">
          <Skeleton height={40} width={560} />
        </div>
        {Array(6)
          .fill(0)
          .map((_, index) => (
            <div className="col-md-4 col-sm-6 col-xs-8 col-12 mb-4" key={index}>
              <Skeleton height={592} />
            </div>
          ))}
      </>
    );
  };

  const ShowProducts = () => {
    return (
      <>
        {filter.map((product) => (
          <div
            id={product.id}
            key={product.id}
            className="col-md-4 col-sm-6 col-xs-8 col-12 mb-4"
          >
            <div className="card text-center h-100">
              <img
                className="card-img-top p-3"
                src={product.image}
                alt={product.title}
                height={300}
              />
              <div className="card-body">
                <h5 className="card-title">
                  {product.title.substring(0, 12)}...
                </h5>
                <p className="card-text">
                  {product.description.substring(0, 90)}...
                </p>
              </div>
              <ul className="list-group list-group-flush">
                <li className="list-group-item lead">Rs. {product.price}</li>
              </ul>
              <div className="card-body">
                {/* <Link to={"/product/" + product.id} className="btn btn-dark m-1">
                  Buy Now
                </Link> */}
                <button
                  className="btn btn-dark m-1"
                  onClick={() => addProduct(product)}
                >
                  Add to Cart
                </button>
                <button
                  className="btn btn-dark m-1"
                >
                  Add to Wishlist
                </button>
              </div>
            </div>
          </div>
        ))}
      </>
    );
  };

  return (
    <>
      <div className="container my-3 py-3">
        <div className="row">
          <div className="col-12">
            <h2 className="display-5 text-center">Latest Products</h2>
            <hr />
          </div>
        </div>
        <div className="row justify-content-center">
          {loading ? <Loading /> : <ShowProducts />}
        </div>
      </div>
    </>
  );
};

export default Products;
