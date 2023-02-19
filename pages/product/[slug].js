import Layout from "@/components/Layout";
import Product from "@/models/Product";
import db from "@/utils/db";
import { getError } from "@/utils/error";
import { Store } from "@/utils/Store";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useContext, useState } from "react";
import ReactStars from "react-rating-stars-component";
import { toast } from "react-toastify";

export default function ProductDetail(props) {
  const { product } = props;

  const { state, dispatch } = useContext(Store);

  const router = useRouter();

  if (!product) {
    return (
      <Layout title="Product Not found">
        <div>Product Not Found</div>
      </Layout>
    );
  }

  const addToCartHandler = async () => {
    const existItem = state.cart.cartItems.find(
      (item) => item.slug === product.slug
    );
    const quantity = existItem ? existItem.quantity + 1 : 1;

    const { data } = await axios.get(`/api/products/${product._id}`);

    if (data.countInStock < quantity) {
      toast.error("Sorry. Product is out of stock");
      return;
    }

    dispatch({
      type: "CART_ADD_ITEM",
      payload: { ...product, quantity: quantity },
    });

    router.push("/cart");
  };

  const ratingChanged = async (productId, count) => {
    try {
      await axios.put(`/api/products/${productId}`, {
        rating: count,
      });
      toast.success(
        "We really appreciate you taking the time to share your rating with us"
      );
    } catch (error) {
      dispatch({ type: "UPDATE_FAUL", payload: getError(error) });
      toast.error(getError(error));
    }
  };

  return (
    <Layout title={product.name}>
      <div className="grid md:grid-cols-4 md:gap-3 my-2">
        <div className="md:col-span-2 items-center">
          <Image
            src={product.image}
            alt={product.name}
            width={500}
            height={500}
            className="rounded-md"
          ></Image>
        </div>
        <div>
          <ul className="leading-9">
            <li>
              <h1 className="text-lg">{product.name}</h1>
            </li>
            <li>Category: {product.category}</li>
            <li>Brand: {product.brand}</li>
            <li className="whitespace-nowrap">
              <div className="flex items-center space-x-6">
                <ReactStars
                  count={5}
                  size={26}
                  activeColor="#ffd700"
                  value={product.rating}
                  edit={false}
                />
                {product.totalRatings} Ratings
              </div>
            </li>
            <li>Description: {product.description}</li>
            <br />
            <li className="flex items-center space-x-4 whitespace-nowrap">
              Rate Product:
              <ReactStars
                count={5}
                onChange={(count) => {
                  ratingChanged(product._id, count);
                }}
                size={24}
                activeColor="#ffd700"
                edit={true}
              />
            </li>
          </ul>
        </div>
        <div>
          <div className="card p-5 my-2">
            <div className="mb-2 flex  justify-between">
              <div>Price</div>
              <div>{product.price} ₹</div>
            </div>
            <div className="mb-2 flex justify-between">
              <div>Status</div>
              <div>{product.countInStock > 0 ? "In Stock" : "Unavailable"}</div>
            </div>
            <button
              className="primary-button w-full"
              onClick={addToCartHandler}
            >
              Add to cart
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export async function getServerSideProps(context) {
  const { params } = context;
  const { slug } = params;
  await db.connect();
  const product = await Product.findOne({
    slug: slug,
  }).lean();
  await db.disconnect();
  return {
    props: {
      product: product ? db.convertDocToObj(product) : null,
    },
  };
}
