import React from "react";
import "./productsFilter.scss";
import { useContext } from "react";
import { appContext } from "../../context/AppContext";
import { useState } from "react";
const ProductsFilter = (props) => {
  const { setFilteredData, productData } = useContext(appContext);
  const [filterChanges, setFilterChanges] = useState({
    sort: "rating",
    minPrice: "",
    maxPrice: "",
    categories: [],
    brands: [],
  });
  function check(e, type) {
    if (e.target.checked) {
      if (!type.includes(e.target.value)) {
        type.push(e.target.value);
      }
    } else {
      type.splice(type.indexOf(e.target.value), 1);
    }
  }

  function startFiltering() {
    let newData = productData;
    if (filterChanges.minPrice !== "") {
      newData = newData.filter(
        (product) => product.price >= +filterChanges.minPrice
      );
    }
    if (filterChanges.maxPrice !== "") {
      newData = newData.filter(
        (product) => product.price <= +filterChanges.maxPrice
      );
    }
    if (filterChanges.categories.length > 0) {
      let filteredCategories = [];
      filterChanges.categories.map((category) => {
        filteredCategories.push(
          ...newData.filter((product) => product.category === category)
        );
      });
      newData = filteredCategories;
    }
    if (filterChanges.brands.length > 0) {
      let filteredBrands = [];
      filterChanges.brands.map((brand) => {
        filteredBrands.push(
          ...newData.filter((product) => product.brand.toLowerCase() === brand)
        );
      });
      newData = filteredBrands;
    }
    setFilteredData(newData);
    setFilteredData((prev) => [...sortData(prev)]);
  }

  function sortData(data) {
    switch (filterChanges.sort) {
      case "rating":
        return data.sort((a, b) => (a.rating < b.rating ? 1 : -1));
      case "name":
        return data.sort((a, b) => a.title.localeCompare(b.title));
      case "priceLow":
        return data.sort((a, b) => (a.price < b.price ? -1 : 1));
      case "priceHigh":
        return data.sort((a, b) => (a.price < b.price ? 1 : -1));
      case "availableCount":
        return data.sort((a, b) => (a.count < b.count ? 1 : -1));
      default:
        return;
    }
  }
  return (
    <div className={`products-filter ${props.showFilter ? "show" : ""}`}>
      <h1 className="filter-title">Filter</h1>
      <div className="filter-section">
        <h3>Sort by</h3>
        <select
          onChange={(e) => {
            setFilterChanges((prev) => {
              return {
                ...prev,
                sort: e.target.value,
              };
            });
          }}
        >
          <option value="rating">Rating</option>
          <option value="name">Name</option>
          <option value="priceLow">Price: low to high</option>
          <option value="priceHigh">Price: High to Low</option>
          <option value="availableCount">Available Quantity</option>
        </select>
      </div>
      <hr />
      <div className="filter-section price-range-section">
        <h3>Price Range</h3>
        <div className="min-max-container">
          <div className="min-max">
            <label htmlFor="min-price">Min</label>
            <input
              value={filterChanges.minPrice}
              onChange={(e) => {
                setFilterChanges((prev) => {
                  return {
                    ...prev,
                    minPrice: e.target.value,
                  };
                });
              }}
              id="min-price"
              type="number"
            />
          </div>
          <div className="min-max">
            <label htmlFor="max-price">Max</label>
            <input
              value={filterChanges.maxPrice}
              onChange={(e) => {
                setFilterChanges((prev) => {
                  return {
                    ...prev,
                    maxPrice: e.target.value,
                  };
                });
              }}
              id="max-price"
              type="number"
            />
          </div>
        </div>
      </div>
      <hr />
      <div className="filter-section categories">
        <h3>Categories</h3>
        <div className="container">
          <div className="category">
            <input
              onChange={(e) => {
                check(e, filterChanges.categories);
              }}
              id="laptops"
              type="checkbox"
              value="laptop"
            />
            <label htmlFor="laptops">Laptops</label>
          </div>
          <div className="category">
            <input
              onChange={(e) => {
                check(e, filterChanges.categories);
              }}
              id="keyboards"
              type="checkbox"
              value="keyboard"
            />
            <label htmlFor="keyboards">Keyboards</label>
          </div>
          <div className="category">
            <input
              onChange={(e) => {
                check(e, filterChanges.categories);
              }}
              id="mouses"
              type="checkbox"
              value="mouse"
            />
            <label htmlFor="mouses">Mouses</label>
          </div>
          <div className="category">
            <input
              onChange={(e) => {
                check(e, filterChanges.categories);
              }}
              id="headphones"
              type="checkbox"
              value="headphone"
            />
            <label htmlFor="headphones">Headphones</label>
          </div>
        </div>
      </div>
      <hr />
      <div className="filter-section brands">
        <h3>Brands</h3>
        <div className="container">
          <div className="brand">
            <input
              onChange={(e) => {
                check(e, filterChanges.brands);
              }}
              id="apple"
              type="checkbox"
              value="apple"
            />
            <label htmlFor="apple">Apple</label>
          </div>
          <div className="brand">
            <input
              onChange={(e) => {
                check(e, filterChanges.brands);
              }}
              id="logitech"
              type="checkbox"
              value="logitech"
            />
            <label htmlFor="logitech">Logitech</label>
          </div>
          <div className="brand">
            <input
              onChange={(e) => {
                check(e, filterChanges.brands);
              }}
              id="hyperx"
              type="checkbox"
              value="hyperx"
            />
            <label htmlFor="hyperx">HyperX</label>
          </div>
          <div className="brand">
            <input
              onChange={(e) => {
                check(e, filterChanges.brands);
              }}
              id="redragon"
              type="checkbox"
              value="redragon"
            />
            <label htmlFor="redragon">Redragon</label>
          </div>
        </div>
      </div>
      <hr />
      <button className="submit" onClick={startFiltering}>
        Save
      </button>
    </div>
  );
};

export default ProductsFilter;
