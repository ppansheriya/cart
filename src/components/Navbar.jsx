import React from 'react';

const Navbar = ({ cartCount }) => {
    return (
        <nav className="navbar">
            <div className="cart-label">Artist Gallery</div>
            <button className="cart-button">
                <img src="/public/cart.svg" alt="cart" className="cart-icon"/>
                <span className="item-count">
                            {cartCount}
                        </span>
            </button>
        </nav>
    );
};

export default Navbar;
