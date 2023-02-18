import Layout from "@/components/Layout";
import axios from "axios";
import Link from "next/link";
import React, { useEffect, useReducer } from "react";

function reducer(state, action) {
  switch (action.type) {
    case "FETCH_REQUEST": {
      return { ...state, loading: true, error: "" };
    }
    case "FETCH_SUCCESS": {
      return { ...state, loading: false, products: action.payload, error: "" };
    }
    case "FETCH_FAIL": {
      return { ...state, loading: false, error: action.payload };
    }
    default: {
      return state;
    }
  }
}

export default function Products() {
  const [{ loading, error, products }, dispatch] = useReducer(reducer, {
    loading: true,
    products: [],
    error: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await axios.get(`/api/admin/products`);
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (err) {
        dispatch({ type: "FETCH_FAIL", payload: getError(err) });
      }
    };
    fetchData();
  }, []);

  return (
    <Layout title="Admin Dashboard">
      <div className="grid md:grid-cols-4 md:gap-5">
        <div>
          <ul>
            <li>
              <Link href="/admin/dashboard">Dashboard</Link>
            </li>
            <li>
              <Link href="/admin/orders">Orders</Link>
            </li>
            <li>
              <Link className="font-bold" href="/admin/products">
                Products
              </Link>
            </li>
            <li>
              <Link href="/admin/users">Users</Link>
            </li>
          </ul>
        </div>
        <div className="overflow-x-auto md:col-span-3">
          <h1 className="mb-4 text-xl">Admin Dashboard</h1>
          {loading ? (
            <div>Loading...</div>
          ) : error ? (
            <div className="alert-error">{error}</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="border-b">
                  <tr>
                    <th className="px-5 text-left">ID</th>
                    <th className="px-5 text-left">NAME</th>
                    <th className="px-5 text-left">PRICE</th>
                    <th className="px-5 text-left">CATEGORY</th>
                    <th className="px-5 text-left">COUNT</th>
                    <th className="px-5 text-left">RATING</th>
                    <th className="px-5 text-left">ACTION</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product._id} className="border-b">
                      <td className="p-5">{product._id.substring(20, 24)}</td>
                      <td className="p-5">{product.name}</td>
                      <td className="p-5">{product.price}</td>
                      <td className="p-5">{product.category} ₹</td>
                      <td className="p-5">{product.countInStock}</td>
                      <td className="p-5">{product.rating}</td>
                      <td className="p-5">
                        <Link href={`/admin/product/${product._id}`}>Edit</Link>
                        &nbsp;<button>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

Products.auth = { adminOnly: true };
