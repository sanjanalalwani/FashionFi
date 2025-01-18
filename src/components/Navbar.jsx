import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Logo from '../assets/Logo.png';
import './navbar.css';

const Navbar = () => {
    const state = useSelector((state) => state.handleCart);
    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light py-3 sticky-top">
            <div className="container">
                {/* Logo */}
                <NavLink className="navbar-brand fw-bold fs-4 px-2" to="/">
                    <img src={Logo} alt="FashionFi Logo" className="navbar-logo" />
                    {/* FashionFi */}
                </NavLink>
                
                {/* Toggle button for mobile */}
                <button
                    className="navbar-toggler mx-2"
                    type="button"
                    data-toggle="collapse"
                    data-target="#navbarSupportedContent"
                    aria-controls="navbarSupportedContent"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                {/* Navbar items */}
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav ms-2 my-2 text-center">
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/">Home</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/about">About</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/product">Products</NavLink>
                        </li>
                        <li className="nav-item dropdown">
                            <a
                                className="nav-link dropdown-toggle"
                                href="#"
                                id="helpDropdown"
                                role="button"
                                data-toggle="dropdown"
                                aria-haspopup="true"
                                aria-expanded="false"
                            >
                                More
                            </a>
                            <div className="dropdown-menu" aria-labelledby="helpDropdown">
                                <NavLink className="dropdown-item" to="/bot">Chat Bot</NavLink>
                                <NavLink className="dropdown-item" to="/blog">Fashion Blogs</NavLink>
                                <NavLink className="dropdown-item" to="/style">Style Boards</NavLink>
                                <NavLink className="dropdown-item" to="/sessions">Virtual Styling Sessions</NavLink>
                                <NavLink className="dropdown-item" to="/community">Community</NavLink>
                            </div>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/contact">Contact</NavLink>
                        </li>
                    </ul>

                    {/* Buttons */}
                    <div className="buttons text-center ms-auto">
                        <NavLink to="/cart" className="btn btn-outline-dark m-2">
                            <i className="fa fa-cart-shopping mr-1"></i> Cart ({state.length})
                        </NavLink>
                        <NavLink to="/wishlist" className="btn btn-outline-dark m-2">
                            <i className="fa fa-heart mr-1"></i> Wishlist
                        </NavLink>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
