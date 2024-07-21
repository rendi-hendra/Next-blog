/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { api } from "@/lib/api";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";

type DataPost = {
  id: number;
  title: string;
  body: string;
  slug: string;
  author: string;
  category: string;
  createdAt: string;
};

export default function Dashboard() {
  const cookie = Cookies.get("token");
  const [data, setData] = useState<DataPost[]>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api
      .get("/posts", {
        headers: { Authorization: cookie },
      })
      .then((response) => {
        setData(response.data.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error.response.data.errors);
      });
  }, []);

  return (
    <>
      <ScrollArea className="h-full">
        <h1 className="text-center text-2xl mt-10">Dashboard</h1>

        <div className="mx-10 mt-10 mb-10">
          {isLoading
            ? Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="flex flex-col space-y-3">
                  <Skeleton className="h-[200px] rounded-xl" />
                  <div className="space-y-2">
                    {/* <Skeleton className="h-4 w-[250px]" />
                  <Skeleton className="h-4 w-[200px]" /> */}
                  </div>
                </div>
              ))
            : data?.map((post) => (
                <Card key={post.id} className="mb-4">
                  <CardHeader>
                    <CardTitle>{post.title}</CardTitle>
                    <CardDescription>
                      {post.author} | {post.category}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>{post.body}</p>
                  </CardContent>
                  <CardFooter className="text-zinc-500">
                    <p>{post.createdAt}</p>
                  </CardFooter>
                </Card>
              ))}
        </div>
      </ScrollArea>
    </>
  );
}
