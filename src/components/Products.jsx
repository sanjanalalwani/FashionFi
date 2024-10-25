// src/components/Products.jsx
import React, { useState, useEffect } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import toast from "react-hot-toast";
import ProductCard from "./ProductCard";
import Shirt1 from '../assets/Shirt1.png';
import Shirt2 from '../assets/Shirt2.png';
import Shirt3 from '../assets/Shirt3.png';

const Products = () => {
  const [filter, setFilter] = useState([]);
  const [loading, setLoading] = useState(true);

  // Products array with multiple images for each product
  const products = [
    {
      id: 1,
      title: "Men's Casual T-Shirt",
      description: "Comfortable and stylish T-shirt for men.",
      price: 200,
      images: [Shirt1, Shirt2], // Multiple images
    },
    {
      id: 2,
      title: "Men's Casual T-Shirt",
      description: "Comfortable and stylish T-shirt for men.",
      price: 200,
      images: [Shirt2, Shirt3], // Multiple images
    },
    {
      id: 3,
      title: "Men's Casual T-Shirt",
      description: "Comfortable and stylish T-shirt for men.",
      price: 200,
      images: [Shirt3, Shirt1], // Multiple images
    },
  ];

  // Simulate loading and set products
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
      setFilter(products);
    }, 1000);
  }, []);

  // Loading skeleton
  const Loading = () => (
    <>
      <div className="col-12 py-5 text-center">
        <Skeleton height={40} width={560} />
      </div>
      {Array(6).fill(0).map((_, index) => (
        <div className="col-md-4 col-sm-6 col-xs-8 col-12 mb-4" key={index}>
          <Skeleton height={592} />
        </div>
      ))}
    </>
  );

  return (
    <div className="container my-3 py-3">
      <div className="row">
        <div className="col-12">
          <h2 className="display-5 text-center">Latest Products</h2>
          <hr />
        </div>
      </div>
      <div className="row justify-content-center">
        {loading ? <Loading /> : filter.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default Products;
