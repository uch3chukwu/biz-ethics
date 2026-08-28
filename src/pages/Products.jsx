import {
  ArrowUpRight,
  ChevronRight,
  MessageCircle,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

import {
  useSearchParams,
} from "react-router-dom";

import { supabase } from "../lib/supabaseClient";
import { categories } from "../data/categories";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import "./Products.css";

function Products() {
  const [searchParams, setSearchParams] =
    useSearchParams();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const selectedCategory =
    searchParams.get("category");

  const validCategory = categories.some(
    (category) =>
      category.id === selectedCategory
  );

  const activeCategory =
    validCategory ? selectedCategory : null;

  const visibleCategories = activeCategory
    ? categories.filter(
        (category) =>
          category.id === activeCategory
      )
    : categories;

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      setLoadError("");

      const {
        data,
        error,
      } = await supabase
        .from("products")
        .select("*")
        .order("created_at", {
          ascending: false,
        });

      if (error) {
        setLoadError(error.message);
        setProducts([]);
        setLoading(false);
        return;
      }

      setProducts(data || []);
      setLoading(false);
    };

    loadProducts();
  }, []);

  useEffect(() => {
    if (!window.location.hash) {
      window.scrollTo({
        top: 0,
        behavior: "auto",
      });

      return;
    }

    const id =
      window.location.hash.substring(1);

    const timer = setTimeout(() => {
      const element =
        document.getElementById(id);

      if (element) {
        element.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const handleCategoryFilter = (
    categoryId
  ) => {
    if (categoryId === "all") {
      setSearchParams({});
      return;
    }

    setSearchParams({
      category: categoryId,
    });
  };

  const formatPrice = (price) => {
    return `₦${Number(price).toLocaleString(
      "en-NG"
    )}`;
  };

  const generalMessage = encodeURIComponent(
    "Hello Biz-Ethics, I would like to make an enquiry about your products."
  );

  return (
    <div className="site products-page">
      <Navbar />

      <main>
        {/* =========================
            HERO
        ========================= */}

        <section className="products-hero">
          <div className="container">
            <span className="products-eyebrow">
              02 / EQUIPMENT CATALOGUE
            </span>

            <h1>
              Hardware for
              <br />
              <em>the job.</em>
            </h1>

            <p>
              Explore our range of networking,
              surveillance, fibre and security
              equipment. Need something specific?
              Talk to us directly and we'll help you
              find it.
            </p>
          </div>
        </section>

        {/* =========================
            FILTERS
        ========================= */}

        <section className="catalogue-filters">
          <div className="container">
            <div className="filter-header">
              <span>
                FILTER BY CATEGORY
              </span>
            </div>

            <div className="filter-options">
              <button
                className={
                  !activeCategory
                    ? "filter-option active"
                    : "filter-option"
                }
                onClick={() =>
                  handleCategoryFilter("all")
                }
              >
                All
              </button>

              {categories.map(
                (category) => (
                  <button
                    key={category.id}
                    className={
                      activeCategory ===
                      category.id
                        ? "filter-option active"
                        : "filter-option"
                    }
                    onClick={() =>
                      handleCategoryFilter(
                        category.id
                      )
                    }
                  >
                    {category.shortName}
                  </button>
                )
              )}
            </div>
          </div>
        </section>

        {/* =========================
            CATALOGUE
        ========================= */}

        <section className="catalogue-section">
          <div className="container">
            {loading ? (
              <div className="catalogue-status">
                <span>
                  CATALOGUE / LOADING
                </span>

                <p>
                  Loading available equipment...
                </p>
              </div>
            ) : loadError ? (
              <div className="catalogue-status catalogue-status-error">
                <span>
                  CATALOGUE / ERROR
                </span>

                <p>
                  We couldn't load the catalogue
                  right now. Please try again or
                  contact us directly.
                </p>
              </div>
            ) : (
              visibleCategories.map(
                (category) => {
                  const categoryProducts =
                    products.filter(
                      (product) =>
                        product.category ===
                        category.id
                    );

                  return (
                    <section
                      className="catalogue-category"
                      id={category.id}
                      key={category.id}
                    >
                      <div className="category-heading">
                        <div>
                          <span className="category-number">
                            {category.number}
                          </span>

                          <h2>
                            {category.name}
                          </h2>
                        </div>

                        <p>
                          {category.description}
                        </p>
                      </div>

                      {categoryProducts.length >
                      0 ? (
                        <div className="catalogue-products">
                          {categoryProducts.map(
                            (product) => {
                              const specs =
                                Array.isArray(
                                  product.specs
                                )
                                  ? product.specs
                                  : [];

                              return (
                                <article
                                  className="catalogue-product"
                                  key={product.id}
                                >
                                  <div className="product-image">
                                    {product.image_url ? (
                                      <img
                                        src={
                                          product.image_url
                                        }
                                        alt={`${product.manufacturer} ${product.name}`}
                                      />
                                    ) : (
                                      <span>
                                        PRODUCT IMAGE
                                      </span>
                                    )}
                                  </div>

                                  <div className="catalogue-product-info">
                                    <div className="product-topline">
                                      <span className="product-brand">
                                        {product.manufacturer}
                                      </span>

                                      <span
                                        className={
                                          product.available
                                            ? "product-status available"
                                            : "product-status unavailable"
                                        }
                                      >
                                        {product.available
                                          ? "Available"
                                          : "Unavailable"}
                                      </span>
                                    </div>

                                    <h3>
                                      {product.name}
                                    </h3>

                                    <span className="product-model">
                                      {product.model ||
                                        "Model not specified"}
                                    </span>

                                    <p>
                                      {product.description ||
                                        "Contact us for product details."}
                                    </p>

                                    {specs.length >
                                      0 && (
                                      <ul className="product-specs">
                                        {specs
                                          .slice(0, 3)
                                          .map(
                                            (
                                              spec
                                            ) => (
                                              <li
                                                key={
                                                  spec
                                                }
                                              >
                                                {
                                                  spec
                                                }
                                              </li>
                                            )
                                          )}
                                      </ul>
                                    )}

                                    <div className="product-bottom">
                                      <span
                                        className={
                                          product.show_price &&
                                          product.price !==
                                            null &&
                                          product.price !==
                                            undefined
                                            ? "product-price"
                                            : "product-price product-price-request"
                                        }
                                      >
                                        {product.show_price &&
                                        product.price !==
                                          null &&
                                        product.price !==
                                          undefined
                                          ? formatPrice(
                                              product.price
                                            )
                                          : "Request a quote"}
                                      </span>

                                      <a
                                        href={`https://wa.me/2348033883255?text=${encodeURIComponent(
                                          `Hello Biz-Ethics, I'm interested in the ${product.manufacturer} ${product.name}${product.model ? ` (${product.model})` : ""}. Is it available?`
                                        )}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="product-enquiry"
                                      >
                                        Enquire about this product
                                        <ArrowUpRight
                                          size={15}
                                        />
                                      </a>
                                    </div>
                                  </div>
                                </article>
                              );
                            }
                          )}
                        </div>
                      ) : (
                        <div className="category-empty">
                          <span>
                            PRODUCTS / COMING SOON
                          </span>

                          <p>
                            We're currently
                            updating this section.
                            Contact us if you're
                            looking for specific
                            equipment.
                          </p>

                          <a
                            href={`https://wa.me/2348033883255?text=${generalMessage}`}
                            target="_blank"
                            rel="noreferrer"
                          >
                            Ask us directly
                            <MessageCircle
                              size={15}
                            />
                          </a>
                        </div>
                      )}

                      <div className="category-divider">
                        <ChevronRight size={16} />
                      </div>
                    </section>
                  );
                }
              )
            )}
          </div>
        </section>

        {/* =========================
            CTA
        ========================= */}

        <section className="catalogue-cta">
          <div className="container catalogue-cta-inner">
            <div>
              <span className="products-eyebrow">
                CAN'T FIND WHAT YOU NEED?
              </span>

              <h2>
                Tell us what
                <br />
                <em>you're looking for.</em>
              </h2>
            </div>

            <a
              href={`https://wa.me/2348033883255?text=${generalMessage}`}
              target="_blank"
              rel="noreferrer"
              className="catalogue-cta-button"
            >
              <MessageCircle size={18} />
              Ask us directly
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default Products;