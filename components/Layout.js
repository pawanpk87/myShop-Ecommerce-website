import Head from "next/head";
import Link from "next/link";
import React from "react";

function Layout({ title, children }) {
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
