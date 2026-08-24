import {
  ArrowLeft,
  ArrowUpRight,
  ChevronRight,
  MessageCircle,
} from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { categories } from "../data/categories";
import { products } from "../data/products";
import "./Products.css";

function Products() {
  const [searchParams] = useSearchParams();
  const selectedCategory = searchParams.get("category");

  const visibleCategories = selectedCategory
    ? categories.filter((category) => category.id === selectedCategory)
    : categories;

  const generalMessage = encodeURIComponent(
    "Hello Biz-Ethics, I would like to make an enquiry about your products."
  );

  return (
    <div className="products-page">
      <header className="products-header">
        <div className="products-container products-nav">
          <Link to="/" className="products-back">
            <ArrowLeft size={16} />
            Back to Biz-Ethics
          </Link>

          <span className="products-nav-label">
            BIZ-ETHICS / EQUIPMENT
          </span>
        </div>
      </header>

      <main>
        <section className="products-hero">
          <div className="products-container">
            <span className="products-eyebrow">
              02 / EQUIPMENT CATALOGUE
            </span>

            <h1>
              Hardware for
              <br />
              <em>the job.</em>
            </h1>

            <p>
              Explore our range of networking, surveillance, fibre and
              security equipment. Need something specific? Talk to us
              directly and we'll help you find it.
            </p>
          </div>
        </section>

        <section className="catalogue-section">
          <div className="products-container">
            {visibleCategories.map((category) => {
              const categoryProducts = products.filter(
                (product) => product.category === category.id
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

                      <h2>{category.name}</h2>
                    </div>

                    <p>{category.description}</p>
                  </div>

                  {categoryProducts.length > 0 ? (
                    <div className="catalogue-products">
                      {categoryProducts.map((product) => (
                        <article
                          className="catalogue-product"
                          key={product.id}
                        >
                          <div className="product-image">
                            {product.image ? (
                              <img
                                src={product.image}
                                alt={`${product.brand} ${product.name}`}
                              />
                            ) : (
                              <span>PRODUCT IMAGE</span>
                            )}
                          </div>

                          <div className="catalogue-product-info">
                            <span className="product-brand">
                              {product.brand}
                            </span>

                            <h3>{product.name}</h3>

                            <span className="product-model">
                              {product.model}
                            </span>

                            <p>{product.description}</p>

                            <a
                              href={`https://wa.me/2348033883255?text=${encodeURIComponent(
                                `Hello Biz-Ethics, I'm interested in the ${product.brand} ${product.name} (${product.model}). Is it available?`
                              )}`}
                              target="_blank"
                              rel="noreferrer"
                              className="product-enquiry"
                            >
                              Enquire about this product
                              <ArrowUpRight size={15} />
                            </a>
                          </div>
                        </article>
                      ))}
                    </div>
                  ) : (
                    <div className="category-empty">
                      <span>
                        PRODUCTS / COMING SOON
                      </span>

                      <p>
                        We're currently updating this section.
                        Contact us if you're looking for specific
                        equipment.
                      </p>

                      <a
                        href={`https://wa.me/2348033883255?text=${generalMessage}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Ask us directly
                        <MessageCircle size={15} />
                      </a>
                    </div>
                  )}

                  <div className="category-divider">
                    <ChevronRight size={16} />
                  </div>
                </section>
              );
            })}

            {selectedCategory &&
              visibleCategories.length === 0 && (
                <div className="category-not-found">
                  <h2>Category not found.</h2>

                  <Link to="/products">
                    View all equipment
                    <ArrowLeft size={15} />
                  </Link>
                </div>
              )}
          </div>
        </section>

        <section className="catalogue-cta">
          <div className="products-container catalogue-cta-inner">
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
    </div>
  );
}

export default Products;