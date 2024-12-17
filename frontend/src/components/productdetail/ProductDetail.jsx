import { useContext, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./productdetail.scss";
import { appContext } from "../../context/AppContext";
import { useRef } from "react";
import { createProduct } from "../../services/product.service";

export default function ProductDetail() {
  const {
    productData,
    showItems,
    addToCart,
    getStars,
    getArrows,
    randomSortedProductData,
  } = useContext(appContext);
  const { productId } = useParams();
  //console.log("Product Id: " + productId);
  //console.log("Product data: " + productData);
  const [currentProduct, setCurrentProduct] = useState();
  useEffect(() => {
    if (!productData) return;
    setCurrentProduct(productData.find((prod) => prod.id == productId))
  }, [productData, productId])
  //console.log("Current Product: " + currentProduct);
  const [productImage, setProductImage] = useState();
  useEffect(() => {
    if (currentProduct) {
      setProductImage(currentProduct.images[0])
      setCatergoryList(productData.filter(
        (prod) => prod.category === currentProduct.category
      ))
    }
  }, [currentProduct])
  //console.log("Current Product Image: " + currentProduct.images[0]);
  const similarItemsSection = useRef(null);
  const YouMayAlsoLikeSection = useRef(null);
  const [showScaledImage, setShowScaledImage] = useState(false);
  const [favorite, setfavorite] = useState(null);
  const [showImageTimeout, setShowImageTimeout] = useState();
  const [categoryList, setCatergoryList] = useState();
  const [keyFeatures, setKeyFeatures] = useState([]);
  const [showMoreFeat, setShowMoreFeat] = useState(false);
  const [hasDiscount, setHasDiscount] = useState(true);
  const [productSale, setProductSale] = useState(0);
  function splitIntoColumns(arr, colCount) {
    if (Array.isArray(arr[0])) return arr;
    let newArr = fillEmptyArrays(Math.ceil(arr.length / colCount));
    fillArray(newArr, arr, colCount);
    return newArr;
  }

  function fillEmptyArrays(count) {
    let newArr = [];
    for (let i = 0; i < count; i++) {
      newArr.push([]);
    }
    return newArr;
  }

  function fillArray(newArr, arr, colCount) {
    console.log(newArr);
    for (let i = 0; i < arr.length; i++) {
      newArr[Math.floor(i / colCount)].push(arr[i]);
    }
  }

  useEffect(() => {
    if (currentProduct && currentProduct.images) {
      setKeyFeatures((prev) => {
        console.log(prev);
        return currentProduct.description.split(', ');
      });
      setKeyFeatures((prev) => {
        console.log("key feat");
        console.log(prev);
        let newKeyFeatures = prev;
        newKeyFeatures[0] = newKeyFeatures[0].replace(currentProduct.title, "");
        newKeyFeatures[0] = newKeyFeatures[0].replace(" - ", "");
        return newKeyFeatures;
      });
      setKeyFeatures((prev) => prev.sort((a, b) => b.length - a.length));
      setKeyFeatures((prev) => splitIntoColumns(prev, 2));
      setProductImage(currentProduct.images[0]);
    }
    window.scrollTo(0, 0);
  }, [currentProduct]);
  const changeImage = (e) => {
    let image = e.target.getAttribute("data-image");
    setProductImage(image);
  };
  useEffect(() => {
    !showScaledImage &&
      setTimeout(() => {
        setShowImageTimeout(false);
      }, 300);
    showScaledImage && setShowImageTimeout(true);
  }, [showScaledImage]);
  const addTofavorite = () => {
    let newData = productData;
    newData[currentProduct.id - 1].favorite =
      !newData[currentProduct.id - 1].favorite;
    setProductData(newData);
    setfavorite(!favorite);
    setfavoriteList(productData.filter((product) => product.favorite));
    sendNotification(
      `${currentProduct.favorite ? "Added to" : "Removed from"} Favorite`,
      currentProduct.title
    );
    localStorage.setItem("productsData", JSON.stringify(productData));
  };
  const handleShowMoreFeat = () => {
    setShowMoreFeat(!showMoreFeat);

  }
  const getHash = (str) => {
    return str.toUpperCase().substring(0,Math.min(3,str.length));
  }
  const getFeats = () => {
    let cols = [];
    let numCol = showMoreFeat ? keyFeatures.length : Math.min(keyFeatures.length, 2);
    for (let i = 0; i < numCol; i++) {
      let featRow = [];
      for (let j = 0; j < keyFeatures[i].length; j++) {
        featRow.push(<li key={j}>{keyFeatures[i][j]}</li>)
      }
      cols.push(<ul key={i}>{featRow}</ul>)
    }
    return cols;
  }
  return (
    <div>
      {currentProduct && (<div className="product-page">
        <div className="product-details">
          <div className="product-header">
            <div className="product-title">
              {currentProduct.title}
            </div>
            <div className="metaShare">
              {getHash(currentProduct.category)}{getHash(currentProduct.brand)} #{currentProduct.id}
            </div>
            <div className="metaShare">
              <div className="rating">
                <div className="stars">
                  {getStars(currentProduct)}
                </div>
                <div className="avg-rating">
                  {currentProduct.ratingStatus.ratings.length} Reviews
                </div>
              </div>
            </div>
            <div className="metaShare">

              <a className="share" onClick={() => { navigator.clipboard.writeText(window.location); alert("Copied link to clipboard") }}>
                Share <i className="fa-solid fa-share"></i>
              </a>
            </div>
          </div>
          <div className="product-container">
            <div className="product-content">
              <div className="images">
                <div className="switch-images">
                  {currentProduct.images.map((image) => {
                    return (
                      <div
                        onClick={changeImage}
                        key={currentProduct.images.indexOf(image)}
                        className={`${"image"} ${productImage == image ? "image-selected" : ""}`}
                        data-image={
                          currentProduct.images[currentProduct.images.indexOf(image)]
                        }
                      >
                        <img
                          src={image}
                          alt="product"
                          data-image={
                            currentProduct.images[
                            currentProduct.images.indexOf(image)
                            ]
                          }
                        />
                      </div>
                    );
                  })}
                </div>
                <div
                  onMouseEnter={() => {
                    setShowScaledImage(true);
                  }}
                  onMouseLeave={() => {
                    setShowScaledImage(false);
                  }}
                  className="main-image"
                >
                  <img src={productImage} alt="product" />
                </div>
                {
                  <div
                    className={`scaled-image ${showScaledImage ? "show" : ""} ${showImageTimeout ? "" : "remove"
                      } `}
                  >
                    <img src={productImage} alt="" />
                  </div>
                }
              </div>
              <div className="details">
                <div className="span-description">Key Features: </div>{" "}
                <div className="features">

                  {keyFeatures && Array.isArray(keyFeatures[0]) && getFeats()}
                </div>
                {keyFeatures.length > 2 &&
                  <span
                    className="primaryLink show-more"
                    onClick={handleShowMoreFeat}> {showMoreFeat ? "Show Less" : "Show More"}</span>}
              </div>
            </div>
            <div className="sales-details">
              <div className="stock">
                {currentProduct.amount > 0 ?
                  <svg className="check-circle-icon" height="1rem" version="1.1" viewBox="0 0 20 20" width="1rem" xmlns="http://www.w3.org/2000/svg" xmlnsSketch="http://www.bohemiancoding.com/sketch/ns" xmlnsXlink="http://www.w3.org/1999/xlink">
                    <title />
                    <desc />
                    <defs />
                    <g fill="none" fill-rule="evenodd" id="Page-1" stroke="none" stroke-width="1">
                      <g fill="#000000" id="Core" transform="translate(-128.000000, -86.000000)">
                        <g id="check-circle-outline" transform="translate(128.000000, 86.000000)">
                          <path d="M5.9,8.1 L4.5,9.5 L9,14 L19,4 L17.6,2.6 L9,11.2 L5.9,8.1 L5.9,8.1 Z M18,10 C18,14.4 14.4,18 10,18 C5.6,18 2,14.4 2,10 C2,5.6 5.6,2 10,2 C10.8,2 11.5,2.1 12.2,2.3 L13.8,0.7 C12.6,0.3 11.3,0 10,0 C4.5,0 0,4.5 0,10 C0,15.5 4.5,20 10,20 C15.5,20 20,15.5 20,10 L18,10 L18,10 Z" id="Shape" />
                        </g>
                      </g>
                    </g>
                  </svg>
                  : <svg className="x-circle-icon" xmlns="http://www.w3.org/2000/svg" height={20} width={20} viewBox="0 0 256 256" id="x-circle">
                    <rect width="256" height="256" fill="none"></rect>
                    <circle cx="128" cy="128" r="96" fill="none" stroke="#000" stroke-miterlimit="10" stroke-width="16"></circle>
                    <line x1="160" x2="96" y1="96" y2="160" fill="none" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"></line>
                    <line x1="160" x2="96" y1="160" y2="96" fill="none" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"></line>
                  </svg>
                } In Stock
              </div>
              <div className="price ">
                {hasDiscount && <div className="limited-time-deal">Limited time deal!</div>}
                <span className="a-price-symbol">$</span>
                <span className="a-current-price">{currentProduct.price} &nbsp;</span>
                {hasDiscount && <span className="a-original-price">Original Price: <del>${currentProduct.price}</del> &nbsp;<span className="sale-amount">-{productSale}%</span></span>}

              </div>
              <div className="shipping-details">
                ${100} for Shipping & Import to the US
              </div>
            </div>
            <div className="ordering">
              <div className="choose-amount">
                <span className="quantity">Quantity:</span>
                <select 
                value={"hi"}>
                  <option className="option">1</option>
                  <option className="option">2</option>
                </select>
              </div>
              <button className="add-to-cart"
              onClick={()=>addToCart(productId)}><span><i class="fa-solid fa-cart-shopping"></i>&nbsp; Add To Cart</span></button>
              <button className="wish-list"><span><i class="fa-solid fa-heart"></i>&nbsp;Wishlist</span></button>
            </div>
          </div>
        </div>
        <div className="section">
          <div className="section-title">Similar Products</div>
          <div ref={similarItemsSection} className="products-line">
            {categoryList ? showItems(categoryList) : []}
          </div>
          {getArrows(similarItemsSection)}
        </div>
        <div className="section">
          <div className="section-title">You May Also Like </div>
          <div ref={YouMayAlsoLikeSection} className="products-line">
            {showItems(randomSortedProductData)}
          </div>
          {getArrows(YouMayAlsoLikeSection)}
        </div>
      </div>)}
    </div>
  );
}
