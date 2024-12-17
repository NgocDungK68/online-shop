import { useContext, useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { appContext } from "../../context/AppContext";
import bundle2Img from "../../images/bundle2.png";
import BundleImage from "../../images/home-bundle.png";
import "./home.scss";
const Home = () => {
  const {
    productData,
    showItems,
    randomSortedProductData,
    getArrows,
    currentLocation,
  } = useContext(appContext);
  const autoMove = useRef(true);
  const firstSectionRef = useRef(null);
  const laptopsRef = useRef(null);
  const keyboardsRef = useRef(null);
  const mousesRef = useRef(null);
  const headphonesRef = useRef(null);
  const [keyboards, setKeyBoards] = useState(null);
  const [mouses, setMouses] = useState(null);
  const [laptops, setLaptops] = useState(null);
  const [headphones, setHeadPhones] = useState(null);

  useEffect(() => {
    if (!productData) return;
    console.log("Loading keyboard, mouse, laptop, headphone")
    setKeyBoards(productData.filter((prod) => prod.category === "keyboard"))
    setMouses(productData.filter((prod) => prod.category === "mouse"))
    setLaptops(productData.filter((prod) => prod.category === "laptop"))
    setHeadPhones(productData.filter((prod) => prod.category === "headphone"))
  }, [productData])

  const location = useLocation();
  useEffect(() => {
    currentLocation.current = location.pathname;
  }, []);
  function scrollProducts() {
    if (!firstSectionRef || !autoMove || !currentLocation || !randomSortedProductData) return;
    if (autoMove.current && currentLocation.current === "/")
      firstSectionRef.current.scrollBy(308, 0);
    setTimeout(() => scrollProducts(), 3000);
  }
  useEffect(() => {
    if (randomSortedProductData) {
      scrollProducts();
      window.scrollTo(0, 0);
    }
  }, [randomSortedProductData]);

  return (
    <div>
      {productData && ( // Conditionally render only when productData is set
        <div className="home-page" id="mainDisplay">
          <div className="home-container">
            <div className="home-first-bar">
              <div className="left">
                <h1>All You Need In One Place</h1>
                <p>
                  Build your dream computer with our high quality computer parts and
                  accessories with more than 50% sale
                </p>
                <button className="view-products">
                  <Link to="/product">
                    <i className="fa-solid fa-shop"></i> <span>View Products</span>
                  </Link>
                </button>
                <button className="view-profile">
                  <Link to="/profile">
                    <i className="fa-solid fa-user"></i> <span>View Profile</span>
                  </Link>
                </button>
              </div>
              <div className="bundle-image">
                <img src={BundleImage} alt="" />
              </div>
            </div>
            <section
              className="section"
              onMouseEnter={() => {
                autoMove.current = false;
              }}
              onMouseLeave={() => {
                autoMove.current = true;
              }}
            >
              <div ref={firstSectionRef} className="products-line">
                {showItems(randomSortedProductData ? randomSortedProductData : [])}
              </div>
              {getArrows(firstSectionRef)}
            </section>
            <section className="home-first-bar home-section">
              <div className="left">
                <img src={bundle2Img} alt="bundle" />
              </div>
              <div className="right">
                <h1>Get the best deal for any budget</h1>
                <p>
                  We have different products for every budget, you can choose the
                  budget you want and you will get the best recommendations, use our
                  filter in products page to find the product you want
                </p>
              </div>
            </section>
            <section className="section">
              <div className="section-title">Top Laptops</div>
              <div className="products-container">
                <div ref={laptopsRef} className="products-line">
                  {showItems(laptops ? laptops : [])}
                </div>
                {getArrows(laptopsRef)}
              </div>
            </section>
            <section className="section">
              <div className="section-title">Keyboards for you</div>
              <div className="products-container">
                <div ref={keyboardsRef} className="products-line">
                  {showItems(keyboards ? keyboards : [])}
                </div>
                {getArrows(keyboardsRef)}
              </div>
            </section>
            <section className="section">
              <div className="section-title">New Mouses</div>
              <div className="products-container">
                <div ref={mousesRef} className="products-line">
                  {showItems(mouses ? mouses : [])}
                </div>
                {getArrows(mousesRef)}
              </div>
            </section>
            <section className="section">
              <div className="section-title">Special Headphones</div>
              <div className="products-container">
                <div ref={headphonesRef} className="products-line">
                  {showItems(headphones ? headphones : [])}
                </div>
                {getArrows(headphonesRef)}
              </div>
            </section>
          </div>
        </div>
      )
      }
    </div >
  );
};

export default Home;
