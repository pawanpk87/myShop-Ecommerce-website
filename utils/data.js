import bcryptjs from "bcryptjs";

const data = {
  users: [
    {
      name: "Pawan",
      email: "admin@buildcode.org",
      password: bcryptjs.hashSync("admin123", 10),
      isAdmin: true,
    },
    {
      name: "Kumar",
      email: "kumar@buildcode.org",
      password: bcryptjs.hashSync("kumar123", 10),
      isAdmin: false,
    },
  ],
  products: [
    {
      name: "Free Shirt",
      slug: "free-shit",
      category: "Shits",
      image: "/images/shirt1.jpg",
      price: 700,
      brand: "Nike",
      rating: 4.5,
      numReviews: 9,
      countInStock: 2,
      description: "A popular shirt",
    },
    {
      name: "Slim Shirt",
      slug: "slim-shirt",
      category: "Shits",
      image: "/images/shirt2.jpg",
      price: 700,
      brand: "Nike",
      rating: 4.5,
      numReviews: 9,
      countInStock: 20,
      description: "Guru's shirt",
    },
    {
      name: "Bule Shirt",
      slug: "blue-shirt",
      category: "Shits",
      image: "/images/shirt3.jpg",
      price: 700,
      brand: "Nike",
      rating: 4.5,
      numReviews: 9,
      countInStock: 20,
      description: "Nice shirt",
    },
  ],
};

export default data;
