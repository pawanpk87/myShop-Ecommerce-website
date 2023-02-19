import Product from "@/models/Product";
import db from "@/utils/db";
import { getSession } from "next-auth/react";

const handler = async (req, res) => {
  const session = await getSession({ req });
  if (!session || (session && !session.user.isAdmin)) {
    res.status(401).send("Admin signin required");
  }
  if (req.method === "GET") {
    await db.connect();
    const products = await Product.find({});
    await db.disconnect();
    res.send(products);
  }
  if (req.method === "POST") {
    return postHandler(req, res);
  } else {
    return res.status(400).send({ message: "Method not allowed" });
  }
};

const postHandler = async (req, res) => {
  await db.connect();
  const newProduct = new Product({
    name: "sample name",
    slug: "sample-name-" + Math.random(),
    image: "/image/default-image.svg",
    price: 0,
    category: "sample category",
    brand: "sample brand",
    countInStock: 0,
    description: "sample description",
    rating: 0,
    ratings: [0, 0, 0, 0, 0],
    totalRatings: 0,
    numReviews: 0,
    reviews: [],
    isFeatured: false,
    banner: "",
  });

  console.log("post called....");
  console.log(newProduct);

  const product = await newProduct.save();
  await db.disconnect();
  res.send({
    message: "Product created succssfully",
    product,
  });
};

export default handler;
