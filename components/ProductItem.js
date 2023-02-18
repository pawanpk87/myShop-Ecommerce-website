import Image from "next/image";
import Link from "next/link";
import React from "react";
import ReactStars from "react-rating-stars-component";

export default function ProductItem({ product, addToCartHandler }) {
  const ratingChanged = () => {};

  return (
    <div className="card">
      <Link href={`/product/${product.slug}`}>
        <span>
          <Image
            src={product.image}
            alt={product.name}
            className="rounded shadow object-cover w-full h-64 object-top"
            height="400"
            width="400"
          />
        </span>
      </Link>
      <div className="flex flex-col items-center justify-center p-5">
        <Link href={`/product/${product.slug}`}>
          <h2 className="text-lg">{product.name}</h2>
        </Link>
        <p className="mb-2">{product.brand}</p>
        <ReactStars
          count={5}
          onChange={ratingChanged}
          size={24}
          activeColor="#ffd700"
          value={product.rating}
          edit={false}
        />
        <p>{product.price}₹</p>
        <button
          className="primary-button"
          type="button"
          onClick={() => addToCartHandler(product)}
        >
          Add to cart
        </button>
      </div>
    </div>
  );
}
