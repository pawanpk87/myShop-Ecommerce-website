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

  const [toggle, setToggle] = useState(false);

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
          <nav className="flex h-14 justify-between shadow-md  items-center px-4">
            <div className="flex items-center space-x-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="w-6 h-6"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                />
              </svg>
              <Link href="/">
                <span className="text-2xl font-bold">myShop</span>
              </Link>
            </div>

            <form
              className="mx-auto  hidden w-full justify-center md:flex"
              onSubmit={submitHandler}
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

            <div className="hidden md:flex">
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

                    {session.user.isAdmin && (
                      <Menu.Item>
                        <DropdownLink href="/admin/dashboard">
                          Admin Dashboard
                        </DropdownLink>
                      </Menu.Item>
                    )}

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

            <div className="md:hidden flex items-center">
              <button
                type="button"
                className="mobile-menu-button"
                onClick={() => setToggle(!toggle)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="w-6 h-6"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M3.75 5.25h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5"
                  />
                </svg>
              </button>
            </div>
          </nav>
          <div
            id="mobile-menu"
            className={`${
              toggle === false ? "hidden" : ""
            } md:hidden flex flex-col my-3 mx-3 p-2 bg-gray-50 rounded-md  shadow-md`}
          >
            <form
              className="py-4 px-4 text-sm mx-auto flex"
              onSubmit={submitHandler}
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

            <div className="flex flex-col space-y-3 mx-auto">
              <div>
                <Link href="/cart">
                  <span className="p-2">Cart</span>
                  {cardItemsCount > 0 ? (
                    <span className="rounded-full bg-red-600 p-2 py-1 text-xs font-bold text-white">
                      {cardItemsCount}
                    </span>
                  ) : null}
                </Link>
              </div>
              {status === "loading" ? (
                "Loading"
              ) : session?.user ? (
                <Menu as="div" className="relative inline-block z-10">
                  <Menu.Button className="flex space-x-4 items-center">
                    {session.user.name}
                    <svg
                      className="h-4 w-6"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      class="w-6 h-6"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                      />
                    </svg>
                  </Menu.Button>
                  <Menu.Items className="absolute w-40  p-2 bg-white shadow-lg rounded-t-lg rounded-b-lg ">
                    <Menu.Item>
                      <DropdownLink href="/profile">Profile</DropdownLink>
                    </Menu.Item>

                    <Menu.Item>
                      <DropdownLink href="/order-history">
                        Order History
                      </DropdownLink>
                    </Menu.Item>

                    {session.user.isAdmin && (
                      <Menu.Item>
                        <DropdownLink href="/admin/dashboard">
                          Admin Dashboard
                        </DropdownLink>
                      </Menu.Item>
                    )}

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
            </div>
          </div>
        </header>
        <main className="container m-auto mt-4 xl:px-14 md:px-12 px-8">
          {children}
        </main>
        <footer className="flex h-10 justify-center items-center shadow-inner">
          <p>Made with ❤️ in India</p>
        </footer>
      </div>
    </>
  );
}

export default Layout;
