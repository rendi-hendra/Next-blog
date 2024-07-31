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
import { useRouter } from "next/navigation";

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
    { title: `${params.slug}`, link: `/dashboard/post/${params.slug}` },
  ];

  const router = useRouter();

  const [post, setPost] = useState<DataPost>();
  const token = Cookies.get("token");

  useEffect(() => {
    api
      .get(`/posts/slug/${params.slug}`, {
        headers: { Authorization: token },
      })
      .then((response) => {
        setPost(response.data.data);
      });
  }, []);

  const handleSearch = (key: string | undefined, value: string | undefined) => {
    router.push(`/dashboard?${key}=${value}`);
  };

  return (
    <ScrollArea className="h-full ">
      <div className="flex h-screen">
        <div className="lg:flex items-center justify-center flex-1  text-black flex my-5">
          <div className="w-full min-h-full flex lg:mx-10 rounded-lg">
            <div className="px-10 my-5">
              <Breadcrumbs items={breadcrumbItems} />
              <h1 className="text-3xl font-bold mb-2 mt-5 text-black">
                {post?.title}
              </h1>
              <p
                className="mb-2 cursor-pointer inline"
                onClick={() => handleSearch("author", post?.author)}
              >
                {post?.author} |
              </p>
              <span
                className="cursor-pointer"
                onClick={() => handleSearch("category", post?.category)}
              >
                {" "}
                {post?.category}
              </span>
              <p className="mb-10">{post?.createdAt}</p>
              <p className="text-base font-semibold mb-6 text-black ">
                {post?.body}
              </p>
            </div>
          </div>
        </div>
      </div>
    </ScrollArea>
  );
}
