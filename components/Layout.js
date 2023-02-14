import { Store } from "@/utils/Store";
import Head from "next/head";
import Link from "next/link";
import React, { useContext } from "react";

function Layout({ title, children }) {
  const { state, dispatch } = useContext(Store);
  const { cart } = state;
  return (
    <>
      <Head>
        <title>{title ? title : "MyShop"} </title>
        <meta name="description" content="MyShop Ecommerce website" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="flex min-h-screen flex-col justify-between">
        <header>
          <nav className="flex h-12 justify-between shadow-md  items-center px-4">
            <Link href="/">
              <span className="text-lg font-bold">myShop</span>
            </Link>
            <div>
              <Link href="/cart">
                <span className="p-2">Cart</span>
                {cart.cartItems.length > 0 ? (
                  <span className="ml-2 rounded-full bg-red-600 p-2 py-1 text-xs font-bold text-white">
                    {cart.cartItems.reduce((a, c) => a + c.quantity, 0)}
                  </span>
                ) : null}
              </Link>
              <Link href="/login">
                <span className="p-2">Login</span>
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
