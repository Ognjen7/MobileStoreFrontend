import React from "react";

import "./phonecart.css";

const PhoneCart = ({ phone, removeFromCart }) => {
  return (
    <div className="phone-cart-container">
      <div className="phone-cart">
        <div className="phone-cart-image">
          <img src={phone.photo} alt="phone" />
        </div>
        <div className="phone-cart-details">
          <div>
            {phone.manufacturerName} {phone.model}
          </div>
          <div className="phone-cart-price">{phone.price} €</div>
        </div>
      </div>
      <div className="button-round" onClick={() => removeFromCart(phone.id)}>
        X
      </div>
    </div>
  );
};

export default PhoneCart;
