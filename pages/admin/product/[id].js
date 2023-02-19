import Layout from "@/components/Layout";
import { getError } from "@/utils/error";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useReducer } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

function reducer(state, action) {
  switch (action.type) {
    case "FETCH_REQUEST": {
      return { ...state, loading: true, error: "" };
    }
    case "FETCH_SUCCESS": {
      return { ...state, loading: false, error: "" };
    }
    case "FETCH_FAIL": {
      return { ...state, loading: false, error: action.payload };
    }

    case "UPDATE_REQUEST": {
      return { ...state, loadingUpdate: true, errorUpdate: "" };
    }
    case "UPDATE_SUCCESS": {
      return { ...state, loadingUpdate: false, errorUpdate: "" };
    }
    case "UPDATE_FAIL": {
      return { ...state, loadingUpdate: false, errorUpdate: action.payload };
    }

    case "UPLOAD_REQUEST": {
      return { ...state, loadingUpload: true, errorUpload: "" };
    }
    case "UPLOAD_SUCCESS": {
      return { ...state, loadingUpload: false, errorUpload: "" };
    }
    case "UPLOAD_FAIL": {
      return { ...state, loadingUpload: false, errorUpload: action.payload };
    }

    default: {
      return state;
    }
  }
}

export default function ProductEditScreen() {
  const { query } = useRouter();
  const productId = query.id;
  const [{ loading, error, loadingUpdate, loadingUpload }, dispatch] =
    useReducer(reducer, {
      loading: true,
      error: "",
    });

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await axios.get(`/api/admin/products/${productId}`);
        dispatch({ type: "FETCH_SUCCESS" });
        setValue("name", data.name);
        setValue("slug", data.slug);
        setValue("price", data.price);
        setValue("image", data.image);
        setValue("category", data.category);
        setValue("brand", data.brand);
        setValue("countInStock", data.countInStock);
        setValue("description", data.description);
      } catch (error) {
        dispatch({ type: "FETCH_FAIL", payload: getError(error) });
      }
    };
    fetchData();
  }, [productId, setValue]);

  const router = useRouter();

  const submitHandler = async ({
    name,
    slug,
    price,
    category,
    image,
    brand,
    countInStock,
    description,
  }) => {
    try {
      dispatch({ type: "UPDATE_REQUEST" });
      await axios.put(`/api/admin/products/${productId}`, {
        name,
        slug,
        price,
        category,
        image,
        brand,
        countInStock,
        description,
      });
      dispatch({ type: "UPDATE_SUCCESS" });
      toast.success("Product updated successfully");
      router.push("/admin/products");
    } catch (error) {
      dispatch({ type: "UPDATE_FAUL", payload: getError(error) });
      toast.error(getError(error));
    }
  };

  const uploadHandler = async (e, imageField = "image") => {
    const url = `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`;

    try {
      dispatch({ type: "UPLOAD_REQUEST" });
      const {
        data: { signature, timestamp },
      } = await axios("/api/admin/cloudinary-sign");

      const file = e.target.files[0];

      const formData = new FormData();

      formData.append("file", file);
      formData.append("signature", signature);
      formData.append("timestamp", timestamp);
      formData.append("api_key", process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY);

      const { data } = await axios.post(url, formData);

      dispatch({ type: "UPLOAD_SUCCESS" });

      setValue(imageField, data.secure_url);

      console.log("image url is:-", data.secure_url);

      toast.success("File uploaded successfully");
    } catch (error) {
      dispatch({ type: "UPLOAD_FAIL", payload: getError(error) });
      toast.error(getError(error));
    }
  };

  return (
    <Layout title={`Edit Product ${productId}`}>
      <div className="grid md:grid-cols-4 md:gap-5">
        <div>
          <ul className="leading-9">
            <li>
              <Link href="/admin/dashboard">Dashboard</Link>
            </li>
            <li>
              <Link href="/admin/orders">Orders</Link>
            </li>
            <li className="flex items-center whitespace-nowrap font-bold text-blue-700">
              <Link className="font-bold" href="/admin/products">
                Products
              </Link>
              {""}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="w-5 h-5"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M8.25 4.5l7.5 7.5-7.5 7.5"
                />
              </svg>
            </li>
            <li>
              <Link href="/admin/users">Users</Link>
            </li>
          </ul>
        </div>
        <div className="md:col-span-3">
          {loading ? (
            <div>Loading...</div>
          ) : error ? (
            <div className="alert-error">{error}</div>
          ) : (
            <form
              className="mx-auto max-w-screen-md"
              onSubmit={handleSubmit(submitHandler)}
            >
              <h1 className="mb-4 text-xl">{`Edit Product ${productId}`}</h1>

              <div className="mb-4">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  {...register("name", {
                    required: "Please enter name",
                  })}
                  className="w-full"
                  id="name"
                  autoFocus
                ></input>
                {errors.name && (
                  <div className="text-red-500">{errors.name.message}</div>
                )}
              </div>

              <div className="mb-4">
                <label htmlFor="slug">Slug</label>
                <input
                  type="text"
                  {...register("slug", {
                    required: "Please enter slug",
                  })}
                  className="w-full"
                  id="slug"
                ></input>
                {errors.slug && (
                  <div className="text-red-500">{errors.slug.message}</div>
                )}
              </div>

              <div className="mb-4">
                <label htmlFor="price">Price</label>
                <input
                  type="text"
                  {...register("price", {
                    required: "Please enter price",
                  })}
                  className="w-full"
                  id="price"
                ></input>
                {errors.price && (
                  <div className="text-red-500">{errors.price.message}</div>
                )}
              </div>

              <div className="mb-4">
                <label htmlFor="imageFile">Upload image</label>
                <input
                  type="file"
                  className="w-full"
                  id="imageFile"
                  onChange={uploadHandler}
                />

                {loadingUpload && <div>Uploading....</div>}
              </div>

              <div className="mb-4">
                <label htmlFor="category">Category</label>
                <input
                  type="text"
                  {...register("category", {
                    required: "Please enter category",
                  })}
                  className="w-full"
                  id="category"
                ></input>
                {errors.category && (
                  <div className="text-red-500">{errors.category.message}</div>
                )}
              </div>

              <div className="mb-4">
                <label htmlFor="brand">Brand</label>
                <input
                  type="text"
                  {...register("brand", {
                    required: "Please enter brand",
                  })}
                  className="w-full"
                  id="brand"
                ></input>
                {errors.brand && (
                  <div className="text-red-500">{errors.brand.message}</div>
                )}
              </div>

              <div className="mb-4">
                <label htmlFor="countInStock">Count in stock</label>
                <input
                  type="text"
                  {...register("countInStock", {
                    required: "Please enter count in stock",
                  })}
                  className="w-full"
                  id="countInStock"
                ></input>
                {errors.countInStock && (
                  <div className="text-red-500">
                    {errors.countInStock.message}
                  </div>
                )}
              </div>

              <div className="mb-4">
                <label htmlFor="description">Description</label>
                <input
                  type="text"
                  {...register("description", {
                    required: "Please enter description",
                  })}
                  className="w-full"
                  id="description"
                ></input>
                {errors.description && (
                  <div className="text-red-500">
                    {errors.description.message}
                  </div>
                )}
              </div>
              <div className="mb-4">
                <button disabled={loadingUpdate} className="primary-button">
                  {loadingUpdate ? "Loading" : "Update"}
                </button>
              </div>
              <div className="mb-4">
                <Link href={`/admin/products`}>Back</Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </Layout>
  );
}

ProductEditScreen.auth = { adminOnly: true };
