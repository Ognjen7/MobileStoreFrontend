import React, { useEffect, useState } from "react";

import "./phone.css";

const Phone = ({ phone, addToCart, removeFromCart, cart }) => {
  const renderButton = () => {
    if (phone.availableQuantity == 0) {
      return <div className="unavailable">Out of stock.</div>;
    }

    if (cart.includes(phone.id)) {
      return (
        <div
          className="button secondary"
          onClick={() => removeFromCart(phone.id)}
        >
          Remove from Cart
        </div>
      );
    } else {
      return (
        <div className="button" onClick={() => addToCart(phone.id)}>
          Add to Cart
        </div>
      );
    }
  };

  const handleManufacturer = () => {
    if (!phone.manufacturerName) {
      return phone.manufacturer.name;
    } else return phone.manufacturerName;
  };

  return (
    <div className="phone">
      <div className="image">
        <img src={phone.photo} alt="phone" />
      </div>
      <div className="name">
        {handleManufacturer()} {phone.model}
      </div>
      <div className="price">{phone.price} €</div>
      {renderButton()}
    </div>
  );
};

export default Phone;
