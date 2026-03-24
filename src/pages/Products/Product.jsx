import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import PageTitle from "../../components/PageTitle";

import ProductCard from "../../components/ProductCard";
import { getProducts } from "../../services/productService";


function Product() {

  const [products, setProducts] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 5000]);

  useEffect(() => {
    const fetchProducts = async () => {
      const data = await getProducts();
      setProducts(data);
    };

    fetchProducts();
  }, []);

  const filteredProducts = products.filter(
    (p) => p.price >= priceRange[0] && p.price <= priceRange[1],
  );

  return (
    <>
      {/* header-area */}
      <Navbar />
      {/* header-area-end */}
      {/* main-area */}
      <main className="fix">
        {/* breadcrumb-area */}
        <PageTitle title="All Product" />
        {/* breadcrumb-area-end */}
        {/* product-area */}

        <section className="product__area-four">
          <div className="container">
            <div className="row gutter-20 row-cols-1 row-cols-xl-5 row-cols-lg-4 row-cols-md-3 row-cols-sm-2 justify-content-center">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            
          </div>
        </section>
        {/* product-area-end */}
      </main>
      {/* main-area-end */}

      {/* footer-area */}
      <Footer />
      {/* footer-area-end */}
    </>
  );
}

export default Product;
