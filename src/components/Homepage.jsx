import React, { useEffect, useState } from "react";

import "./homepage.css";
import Phone from "./Phone";
import PhoneCart from "./PhoneCart";
import Login from "./Login";

const Homepage = () => {
  const [cart, setCart] = useState([]);
  const [phones, setPhones] = useState(null);
  const [brands, setBrands] = useState(null);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [filters, setFilters] = useState({
    minPrice: null,
    maxPrice: null,
    name: "",
  });

  useEffect(() => {
    if (phones) {
      fetchDataByName(filters.name);
    }
    if (filters.name === "" || filters.name == null) {
      fetchData();
    }
  }, [filters.name]);

  useEffect(() => {
    fetchData();
    const savedCart = JSON.parse(window.localStorage.getItem("cart")) || [];
    setCart(savedCart);
  }, []);

  const updateCart = (newCart) => {
    setCart(newCart);
  };

  const addToCart = (id) => {
    if (!cart.includes(id)) {
      const updatedCart = [...cart, id];
      setCart(updatedCart);
      window.localStorage.setItem("cart", JSON.stringify(updatedCart));
    }
  };

  const removeFromCart = (id) => {
    const updatedCart = cart.filter((itemId) => itemId !== id);
    setCart(updatedCart);
    window.localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const handleClose = () => {
    setIsLoginOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    window.location.reload();
  };

  const fetchData = async () => {
    try {
      const phonesResponse = await fetch("https://localhost:44321/api/Phones");
      const phones = await phonesResponse.json();

      const brandsResponse = await fetch(
        "https://localhost:44321/api/Manufacturers"
      );
      const brands = await brandsResponse.json();

      setPhones(phones);
      setBrands(brands);
    } catch (e) {
      console.log("Fetching Error");
    }
  };

  const fetchDataByName = async (filter) => {
    if (filter) {
      try {
        const url =
          "https://localhost:44321/api/Phones/search?value=" +
          filter.toString();
        const phonesResponse = await fetch(url);
        const phones = await phonesResponse.json();
        setPhones(phones);
      } catch (e) {
        console.log("Fetching Error");
      }
    }
  };

  const renderPhones = () => {
    if (phones) {
      return phones.map((phone) => {
        if (selectedBrands.length === 0) {
          if (
            (!filters.minPrice || filters.minPrice < phone.price) &&
            (!filters.maxPrice || filters.maxPrice > phone.price)
          ) {
            return (
              <Phone
                phone={phone}
                cart={cart}
                addToCart={addToCart}
                removeFromCart={removeFromCart}
              />
            );
          }
        } else {
          if (
            (!filters.minPrice || filters.minPrice < phone.price) &&
            (!filters.maxPrice || filters.maxPrice > phone.price)
          ) {
            return (
              selectedBrands.includes(phone.manufacturerId) && (
                <Phone
                  phone={phone}
                  cart={cart}
                  addToCart={addToCart}
                  removeFromCart={removeFromCart}
                />
              )
            );
          }
        }
      });
    } else {
      return <div>LOADING...</div>;
    }
  };

  const renderCart = () => {
    var totalPrice = 0;
    return (
      <div className="cart-container">
        {cart.map((phoneId) => {
          const phone = phones.find((phone) => phone.id === phoneId);
          totalPrice += phone.price;
          return <PhoneCart phone={phone} removeFromCart={removeFromCart} />;
        })}
        <div className="cart-price">Total cost: {totalPrice} €</div>
        <div className="button">Proceed to payment</div>
      </div>
    );
  };

  const renderBrands = () => {
    if (phones) {
      return brands.map((brand) => {
        return (
          <div
            className={`filter-brands ${selectedBrands.includes(brand.id)}`}
            onClick={() => handleBrandFilter(brand.id)}
          >
            {brand.name}
          </div>
        );
      });
    } else {
      return <div>LOADING...</div>;
    }
  };

  const renderLoginButton = () => {
    const user = window.localStorage.getItem("user");
    if (!user) {
      return (
        <div className="button" onClick={(e) => setIsLoginOpen(true)}>
          LOGIN
        </div>
      );
    } else {
      return (
        <>
          <div className="welcome">Welcome, {user}</div>
          <div className="button secondary" onClick={() => handleLogout()}>
            LOGOUT
          </div>
        </>
      );
    }
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [id]: value,
    }));
  };

  const handleBrandFilter = (filter) => {
    setSelectedBrands((prevBrands) => {
      const index = prevBrands.indexOf(filter);
      if (index === -1) {
        return [...prevBrands, filter];
      } else {
        const newFilters = [...prevBrands];
        newFilters.splice(index, 1);
        return newFilters;
      }
    });
  };

  return (
    <div>
      <div className="navbar">
        <div className="logo">
          <img src="/logo.jpg" alt="logo" />
        </div>
        <div className="row">
          {renderLoginButton()}
          <div className="button" onClick={(e) => setIsCartOpen(!isCartOpen)}>
            CART({cart.length})
          </div>
        </div>
      </div>
      <div className="container">
        <div className="filters">
          <div>
            <label>Search</label>
            <input
              placeholder="Search by name"
              id="name"
              type="text"
              value={filters.name}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label>Price range</label>
            <div className="price-filters">
              <input
                placeholder="Price from"
                id="minPrice"
                type="number"
                value={filters.minPrice}
                onChange={handleInputChange}
                style={{ width: "45%" }}
              />
              <label style={{ width: "10%" }}>-</label>
              <input
                placeholder="Price to"
                id="maxPrice"
                type="number"
                value={filters.maxPrice}
                onChange={handleInputChange}
                style={{ width: "45%" }}
              />
            </div>
          </div>
          <div>
            <label>Filter brands</label>
            {renderBrands()}
          </div>
          <div></div>
        </div>
        <div className="phones-container">{renderPhones()}</div>
        {isCartOpen && renderCart()}
        {isLoginOpen && <Login handleClose={handleClose} />}
      </div>
    </div>
  );
};

export default Homepage;
