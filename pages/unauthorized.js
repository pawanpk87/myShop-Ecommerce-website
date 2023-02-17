import Layout from "@/components/Layout";
import { useRouter } from "next/router";
import React from "react";

function Unauthorized() {
  const router = useRouter();
  const { message } = router.query;

  return (
    <Layout title="Unauthorized Page">
      <h1 className="text-xl">Access Denied</h1>
      <div className="flex">
        {message && <div className="mb-4 text-red-600">{message}</div>}
      </div>
    </Layout>
  );
}

export default Unauthorized;
