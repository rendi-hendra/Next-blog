/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { api } from "@/lib/api";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

type DataUser = {
  name: string;
  email: string;
  role: string;
};

export default function Dashboard() {
  const cookie = Cookies.get("token");
  const router = useRouter();

  const [data, setData] = useState<DataUser>();

  useEffect(() => {
    api
      .get("/users/current", {
        headers: { Authorization: cookie },
      })
      .then((response) => {
        console.log(response.data);
        setData(response.data.data);
      })
      .catch((error) => {
        console.log(error.response.data.errors);
      });
  }, []);

  const logout = () => {
    api
      .delete("/users/current", {
        headers: { Authorization: cookie },
      })
      .then((response) => {
        console.log(response.data);
        Cookies.remove("token");
        router.push("/login");
      })
      .catch((error) => {
        console.log(error.response.data.errors);
      });
  };

  return (
    <>
      <h1 className="text-center text-2xl font-bold mt-10">Dashboard</h1>

      {data ? (
        <div className="text-center mt-5">
          <p className="text-lg">Nama: {data.name}</p>
          <p className="text-lg">Email: {data.email}</p>
          <p className="text-lg">Role: {data.role}</p>
        </div>
      ) : (
        <div className="text-center mt-5">
          <p>Loading...</p>
        </div>
      )}

      <div className="text-center">
        <Button className="mt-10 " variant={"destructive"} onClick={logout}>
          Logout
        </Button>
      </div>
    </>
  );
}
