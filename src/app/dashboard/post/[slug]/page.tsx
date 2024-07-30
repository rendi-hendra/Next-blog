"use client";

import { api } from "@/lib/api";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Breadcrumbs } from "@/components/breadcrumbs";

type DataPost = {
  id: number;
  title: string;
  body: string;
  author: string;
  category: string;
  createdAt: string;
};

export default function Blog({ params }: { params: { slug: string } }) {
  const breadcrumbItems = [
    { title: "Dashboard", link: "/dashboard" },
    { title: "Post", link: "/dashboard/post" },
    { title: `${params.slug}`, link: `/dashboard/post/${params.slug}` },
  ];

  const [post, setPost] = useState<DataPost>();
  const token = Cookies.get("token");

  useEffect(() => {
    api
      .get(`/posts/slug/${params.slug}`, {
        headers: { Authorization: token },
      })
      .then((response) => {
        console.log(response.data.data);
        setPost(response.data.data);
      });
  }, []);

  return (
    <ScrollArea className="h-full ">
      <div className="flex h-screen">
        <div className="lg:flex items-center justify-center flex-1  text-black flex my-5">
          <div className="w-full h-full flex border-2 border-black mx-10 bg-white rounded-lg">
            <div className="px-10 my-5">
              <Breadcrumbs items={breadcrumbItems} />
              <h1 className="text-3xl font-bold mb-2 mt-5 text-black">
                {post?.title}
              </h1>
              <p className="mb-2">
                {post?.author} | {post?.category}
              </p>
              <p className="mb-10">{post?.createdAt}</p>
              <h1 className="text-base font-semibold mb-6 text-black ">
                {post?.body}
              </h1>
            </div>
          </div>
        </div>
      </div>
    </ScrollArea>
  );
}
