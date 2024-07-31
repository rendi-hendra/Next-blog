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
import Link from "next/link";
import {useSearchParams} from "next/navigation";

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
  const token = Cookies.get("token");
  const [data, setData] = useState<DataPost[]>();
  const [isLoading, setIsLoading] = useState(true);
  const queryAuthor = useSearchParams().get("author");
  const queryCategory = useSearchParams().get("category");

  useEffect(() => {
    api
      .get("/posts", {
        headers: { Authorization: token },
        params: {author: queryAuthor, category: queryCategory},
      })
      .then((response) => {
        setData(response.data.data);
        setIsLoading(false);
      });
  }, [queryAuthor, queryCategory]);

  return (
    <>
      <ScrollArea className="h-full">
        <h1 className="text-center text-4xl mt-10 font-bold">Dashboard</h1>

        <div className="mx-3 mt-10 mb-10 lg:mx-10">
          {isLoading
            ? Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="flex flex-col space-y-3">
                  <Skeleton className="h-[200px]" />
                  <div className="space-y-2"></div>
                </div>
              ))
            : data?.map((post) => (
                <Link key={post.id} href={`/dashboard/post/${post.slug}`}>
                  <Card className="mb-10 border-2 border-black cursor-pointer bg-slate-100 hover:bg-white neu neu-active">
                    <CardHeader>
                      <CardTitle className="">
                        {post.title}
                      </CardTitle>
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
                </Link>
              ))}
        </div>
      </ScrollArea>
    </>
  );
}
