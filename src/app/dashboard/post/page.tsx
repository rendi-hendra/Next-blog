"use client";

import { Breadcrumbs } from "@/components/breadcrumbs";
import CreatePost from "@/components/post/create-post/create-post";
import YouPost from "@/components/post/you-post/you-post";
import { Heading } from "@/components/ui/heading";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";

const breadcrumbItems = [
  { title: "Dashboard", link: "/dashboard" },
  { title: "Post", link: "/dashboard/post" },
];

export default function Post() {
  const [postToogle, setPostToggle] = useState<boolean>(true);

  return (
    <>
      <ScrollArea className="h-full">
        <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
          <Breadcrumbs items={breadcrumbItems} />
          <div className="pt-5">
            <Tabs defaultValue="createPost" className="">
              <TabsList>
                <TabsTrigger
                  value="createPost"
                  onClick={() => {
                    setPostToggle(true);
                  }}
                >
                  Create Post
                </TabsTrigger>
                <TabsTrigger
                  value="youPost"
                  onClick={() => {
                    setPostToggle(false);
                  }}
                >
                  You Post
                </TabsTrigger>
              </TabsList>
              <div className="flex items-center justify-between my-5">
                <Heading title={postToogle ? "Create Post" : "Your Post"} />
              </div>
              <TabsContent value="createPost">
                <CreatePost />
              </TabsContent>
              <TabsContent value="youPost">
                <YouPost />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </ScrollArea>
    </>
  );
}
