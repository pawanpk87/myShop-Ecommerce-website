import { Store } from "@/utils/Store";
import { Menu } from "@headlessui/react";
import Cookies from "js-cookie";
import { signOut, useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DropdownLink from "./DropdownLink";

function Layout({ title, children }) {
  const router = useRouter();
  const { status, data: session } = useSession();

  const { state, dispatch } = useContext(Store);
  const { cart } = state;

  const [cardItemsCount, setCardItemsCount] = useState(0);

  useEffect(() => {
    setCardItemsCount(cart.cartItems.reduce((a, c) => a + c.quantity, 0));
  }, [cart.cartItems]);

  const logoutClickHandler = () => {
    Cookies.remove("cart");
    dispatch({ type: "CART_RESET" });
    signOut({ callbackUrl: "/login" });
  };

  const [query, setQuery] = useState("");

  const submitHandler = (e) => {
    e.preventDefault();
    router.push(`/search/?query=${query}`);
  };

  return (
    <>
      <Head>
        <title>{title ? title : "MyShop"} </title>
        <meta name="description" content="MyShop Ecommerce website" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ToastContainer position="top-right" limit={1} />
      <div className="flex min-h-screen flex-col justify-between">
        <header>
          <nav className="flex h-12 justify-between shadow-md  items-center px-4">
            <Link href="/">
              <span className="text-lg font-bold">myShop</span>
            </Link>

            <form
              onSubmit={submitHandler}
              className="mx-auto  hidden w-full justify-center md:flex"
            >
              <input
                onChange={(e) => setQuery(e.target.value)}
                type="text"
                className="rounded-tr-none rounded-br-none p-1.5 text-sm  focus:ring-0"
                placeholder="Search products"
              />
              <button
                className="rounded rounded-tl-none rounded-bl-none bg-blue-400 p-1 text-sm dark:text-black"
                type="submit"
                id="button-addon2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    fillRule="evenodd"
                    d="M10.5 3.75a6.75 6.75 0 100 13.5 6.75 6.75 0 000-13.5zM2.25 10.5a8.25 8.25 0 1114.59 5.28l4.69 4.69a.75.75 0 11-1.06 1.06l-4.69-4.69A8.25 8.25 0 012.25 10.5z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </form>

            <div className="flex">
              {status === "loading" ? (
                "Loading"
              ) : session?.user ? (
                <Menu as="div" className="relative inline-block z-10">
                  <Menu.Button className="text-blue-600">
                    {session.user.name}
                  </Menu.Button>
                  <Menu.Items className="absolute right-0 w-56 origin-top-right  p-2 bg-white shadow-lg rounded-t-lg rounded-b-lg ">
                    <Menu.Item>
                      <DropdownLink href="/profile">Profile</DropdownLink>
                    </Menu.Item>

                    <Menu.Item>
                      <DropdownLink href="/order-history">
                        Order History
                      </DropdownLink>
                    </Menu.Item>

                    <Menu.Item>
                      <DropdownLink href="#" logout={logoutClickHandler}>
                        Logout
                      </DropdownLink>
                    </Menu.Item>
                  </Menu.Items>
                </Menu>
              ) : (
                <Link href="/login">
                  <span className="p-2">Login</span>
                </Link>
              )}
              <Link href="/cart">
                <span className="p-2">Cart</span>
                {cardItemsCount > 0 ? (
                  <span className="rounded-full bg-red-600 p-2 py-1 text-xs font-bold text-white">
                    {cardItemsCount}
                  </span>
                ) : null}
              </Link>
            </div>
          </nav>
        </header>
        <main className="container m-auto mt-4 px-4">{children}</main>
        <footer className="flex h-10 justify-center items-center shadow-inner">
          <p>Made by Pawan Kumar Mehta</p>
        </footer>
      </div>
    </>
  );
}

export default Layout;
