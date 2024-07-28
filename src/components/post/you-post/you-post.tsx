"use client";

import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { api } from "@/lib/api";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import EditPost from "./edit-post";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { toast } from "sonner";

type DataPost = {
  id: number;
  title: string;
  body: string;
  slug: string;
  category: string;
  categoryId: number;
  createdAt: string;
};

export default function YouPost() {
  const [data, setData] = useState<DataPost[]>();
  const token = Cookies.get("token");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    api
      .get("/posts/current", {
        headers: { Authorization: token },
      })
      .then((response) => {
        setData(response.data.data);
      })
      .catch((error) => {
        console.log(error.response.data.errors);
      });
  };

  const handleUpdate = (updatedPost: any) => {
    setData((prevData) =>
      prevData?.map((post) => (post.id === updatedPost.id ? updatedPost : post))
    );
  };

  const handleDelete = (id: number) => {
    api
      .delete(`/posts/current/${id}`, {
        headers: { Authorization: token },
      })
      .then((response) => {
        toast.success("Deleted successfully", {
          duration: 5000,
        });
        setData((prevData) => prevData?.filter((post) => post.id !== id));
      });
  };

  return (
    <>
      <Table>
        {data && data.length === 0 && <TableCaption>No posts</TableCaption>}
        <TableHeader>
          <TableRow>
            <TableHead className="">id</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Category</TableHead>
            <TableHead className="">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.map((post, index) => (
            <TableRow key={post.id}>
              <TableCell className="font-medium">{index + 1}</TableCell>
              <TableCell>{post.title}</TableCell>
              <TableCell>{post.category}</TableCell>
              <TableCell className="">
                <DropdownMenu>
                  <DropdownMenuTrigger className="ml-2">
                    . . .
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <Dialog>
                      <DialogTrigger asChild>
                        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                          Edit
                        </DropdownMenuItem>
                      </DialogTrigger>
                      <DialogContent>
                        <EditPost
                          id={post.id}
                          title={post.title}
                          body={post.body}
                          categoryId={post.categoryId}
                          onUpdate={handleUpdate}
                        />
                      </DialogContent>
                    </Dialog>
                    <Dialog>
                      <DialogTrigger asChild>
                        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                          Delete
                        </DropdownMenuItem>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Delete Post</DialogTitle>
                          <DialogDescription>
                            Delete your post
                          </DialogDescription>
                        </DialogHeader>
                        {/* <Trash className="justify-center" /> */}
                        <DialogFooter className="">
                          <DialogClose asChild>
                            <Button
                              type="button"
                              variant="destructive"
                              onClick={() => handleDelete(post.id)}
                            >
                              Delete
                            </Button>
                          </DialogClose>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
