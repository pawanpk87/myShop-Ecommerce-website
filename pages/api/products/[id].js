import Product from "@/models/Product";
import db from "@/utils/db";

const handler = async (req, res) => {
  if (req.method === "GET") {
    return getHandler(req, res);
  } else if (req.method === "PUT") {
    return putHandler(req, res);
  } else {
    return res.status(400).send({ message: "Method not allowed" });
  }
};

const getHandler = async (req, res) => {
  await db.connect();
  const product = await Product.findById(req.query.id);
  await db.disconnect();
  res.send(product);
};

function calculateRatings(star5, star4, star3, star2, star1) {
  return (
    (5 * star5 + 4 * star4 + 3 * star3 + 2 * star2 + 1 * star1) /
    (star5 + star4 + star3 + star2 + star1)
  );
}

const putHandler = async (req, res) => {
  await db.connect();
  console.log("put called....");
  const product = await Product.findById(req.query.id);
  console.log("product is:-", product);
  if (product) {
    const star5 = product.ratings[0];
    const star4 = product.ratings[1];
    const star3 = product.ratings[2];
    const star2 = product.ratings[3];
    const star1 = product.ratings[4];

    if (req.body.rating === 5) {
      product.ratings[0] = star5 + 1;
    } else if (req.body.rating === 4) {
      product.ratings[1] = star4 + 1;
    } else if (req.body.rating === 3) {
      product.ratings[2] = star3 + 1;
    } else if (req.body.rating === 2) {
      product.ratings[3] = star2 + 1;
    } else {
      product.ratings[4] = star1 + 1;
    }

    product.totalRatings = product.totalRatings + 1;

    product.rating = calculateRatings(
      product.ratings[0],
      product.ratings[1],
      product.ratings[2],
      product.ratings[3],
      product.ratings[4]
    );

    console.log("final product", product);
    await product.save();
    await db.disconnect();
    return res.send({ message: "Ratings updated successfully" });
  } else {
    await db.disconnect();
    return res.status(404).send({ message: "Product not found" });
  }
};

export default handler;
