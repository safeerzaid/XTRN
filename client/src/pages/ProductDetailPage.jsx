import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import NavBar from "../components/layout/NavBar";
import ProductListCard from "../components/ui/ProductListCard";

function ProductDetailPage() {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [selectedSize, setSelectedSize] = useState("");

  const { id } = useParams();

  useEffect(() => {
    fetch(`/api/products/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setProduct(data);
        setSelectedImage(data.images.default[0]);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

    useEffect(() => {

  if (!product) return;

  fetch("/api/products")
    .then((res) => res.json())
    .then((data) => {

  // 1. Same subcategory
  let filtered = data.filter(
    (item) =>
      item._id !== id &&
      item.gender === product.gender &&
      item.category === product.category &&
      item.subcategory === product.subcategory
  );

  // 2. If less than 4, add same category
  if (filtered.length < 4) {
    const sameCategory = data.filter(
      (item) =>
        item._id !== id &&
        item.gender === product.gender &&
        item.category === product.category &&
        !filtered.some((p) => p._id === item._id)
    );

    filtered = [...filtered, ...sameCategory];
  }

  // 3. If still less than 4, add same gender
  if (filtered.length < 4) {
    const sameGender = data.filter(
      (item) =>
        item._id !== id &&
        item.gender === product.gender &&
        !filtered.some((p) => p._id === item._id)
    );

    filtered = [...filtered, ...sameGender];
  }

  setRelatedProducts(filtered.slice(0, 4));

    })
    .catch((err) => console.error(err));

    }, [id, product]);

  if (!product) return <h2>Product not found.</h2>;

  return (
    <div className="min-h-screen bg-white">

      <NavBar />

      <main className="mx-auto w-full max-w-[1280px] px-3 sm:px-4 md:px-6 lg:px-8 pt-20 sm:pt-24 lg:pt-28 pb-12 sm:pb-16 lg:pb-20">
        <div className="flex flex-col lg:flex-row lg:items-start lg:gap-10 xl:gap-14">

          {/* ── LEFT: Image Gallery ─────────────────────────────── */}
          <div className="w-full lg:w-[50%] lg:sticky lg:top-28 flex flex-col lg:flex-row lg:gap-3">

            {/* Thumbnail Strip */}
            <div className="order-2 lg:order-1 flex flex-row lg:flex-col gap-3 mt-3 lg:mt-0 overflow-x-auto lg:overflow-y-auto lg:overflow-x-hidden py-2 lg:pr-2">
              {product.images.default.map((image, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setSelectedImage(image)}
                  className={`
                    relative
                    flex-shrink-0
                    w-16 h-16 sm:w-20 sm:h-20
                    rounded-xl
                    overflow-hidden
                    border-2
                    cursor-pointer
                    transition-all duration-200 ease-in-out
                    ${
                      selectedImage === image
                        ? "border-gray-500 shadow-lg "
                        : "border-gray-300 hover:border-gray-500"
                    }
                  `}
                >
                  <img
                    src={image}
                    alt={`Thumbnail ${index + 1}`}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>

            {/* Main Image */}
            <div className="order-1 lg:order-2 flex-1 aspect-square rounded-2xl bg-gray-100 overflow-hidden">
              <img
                src={selectedImage}
                alt={product.name}
                className="w-full h-full object-contain"
              />
            </div>

          </div>

          {/* ── RIGHT: Product Information ──────────────────────── */}
          <div className="w-full lg:w-[50%] mt-8 lg:mt-0">

            {/* Name + Price */}
            <div className="flex flex-col gap-4">
              <h1 className="text-3xl sm:text-4xl font-semibold text-gray-900 leading-none font-nav">
                {product.name}
              </h1>
              <div className="flex items-center gap-">
                <span className="text-2xl font-semibold text-black font-nav">
                  ₹{product.price?.toLocaleString("en-IN")}
                </span>
                {product.originalPrice && (
                  <span className="text-gray-400 line-through font-nav">
                    ₹{product.originalPrice.toLocaleString("en-IN")}
                  </span>
                )}
              </div>
            </div>

          <div className="my-6 border-t border-gray-300"></div>

            {/* Description */}
            <div className="mt-8">
              <h2 className="text-lg font-semibold text-gray-900 font-nav">Description</h2>
              <p className="mt-1 text-gray-500 leading-8 font-nav">{product.description}</p>
            </div>

          <div className="flex flex-wrap gap-2 mt-4">

       
         {product.sizes && product.sizes.length > 0 && (
  <div className="flex flex-wrap gap-2 mt-4">
    {product.sizes.map((size) => (
      <button
        key={size}
        type="button"
        onClick={() => setSelectedSize(size)}
        className={`
          w-12
          h-12
          rounded-sm
          border
          font-nav
          font-medium
          transition-all
          duration-200
          ${
            selectedSize === size
              ? "bg-black text-white border-black"
              : "border-gray-300 hover:border-black"
          }
        `}
      >
        {size}
      </button>
    ))}
  </div>
)}

      </div>

            {/* Quantity & Add to Cart */}

          <div className="mt-8 flex flex-col sm:flex-row gap-4">

            {/* Quantity */}

          <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden">

            <button
              onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
              className="w-12 h-12 aspect-square flex items-center justify-center font-nav text-xl hover:bg-gray-100 transition cursor-pointer"
            >
              −
            </button>

            <span className="w-12 h-12 aspect-square flex items-center justify-center font-nav font-semibold">
              {quantity}
            </span>

            <button
              onClick={() => setQuantity((prev) => prev + 1)}
              className="w-10 h-12 aspect-square flex items-center font-nav justify-center text-xl hover:bg-gray-100 transition cursor-pointer"
            >
              +
            </button>

          </div>

            {/* Add to Cart */}

            <button
              className="
                font-nav
                flex-1
                h-12
                rounded-xl
                bg-black
                text-white
                font-semibold
                hover:bg-gray-900
                transition
                cursor-pointer
              "
            >
              Add to Cart
            </button>

          </div>


          </div>

        </div>
      </main>

      {/* Related Products */}
                <section className="max-w-[1280px] mx-auto px-3 sm:px-4 md:px-6 lg:px-8 mt-24 mb-20">

  {/* Section Heading */}
  <div className="flex items-center justify-between mb-8">

    <h2 className="text-3xl font-semibold font-nav text-gray-900">
      Related Products
    </h2>

  </div>

  {/* Products Grid */}
  <div className="grid grid-cols-2 lg:grid-cols-4  lg:gap-2">

    {relatedProducts.map((item) => (
      <ProductListCard
        key={item._id}
        product={item}
      />
    ))}

    </div>

  </section>

      </div>
    );
  }

export default ProductDetailPage;