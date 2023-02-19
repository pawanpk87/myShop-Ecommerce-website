import Order from "@/models/Order";
import db from "@/utils/db";
import { getSession } from "next-auth/react";

const handler = async (req, res) => {
  const session = await getSession({ req });
  if (!session) {
    res.status(401).send("Signin required");
  }
  const { user } = session;
  await db.connect();
  const newOrder = new Order({
    ...req.body,
    isPaid: false,
    paidAt: Date.now(),
    paymentResult: {
      id: "",
      status: "",
      email_address: "",
    },
    user: user._id,
  });
  const order = await newOrder.save();
  await db.disconnect();
  res.status(201).send(order);
};

export default handler;
