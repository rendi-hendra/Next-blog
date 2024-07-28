"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Category, postFormSchema, PostFormSchema } from "@/lib/formSchema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Cookies from "js-cookie";
import { api } from "@/lib/api";
import { toast } from "sonner";

type ButtonProps = {
  id: number;
  title: string;
  body: string;
  categoryId: number;
  onUpdate: (updatedPost: {
    id: number;
    title: string;
    body: string;
    categoryId: number;
  }) => void;
};

export default function EditPost({
  id,
  title,
  body,
  categoryId,
  onUpdate,
}: ButtonProps) {
  const token = Cookies.get("token");

  const [categories, setCategories] = useState<Category[]>();

  const form = useForm<PostFormSchema>({
    resolver: zodResolver(postFormSchema),
    defaultValues: {
      title,
      body,
    },
  });

  useEffect(() => {
    api
      .get("/categories", {
        headers: { Authorization: token },
      })
      .then((response) => {
        setCategories(response.data.data);
      });
  }, []);

  function onSubmit(data: PostFormSchema) {
    api
      .patch(
        `/posts/current/${id}`,
        {
          title: data.title,
          body: data.body,
          categoryId: Number(data.category),
        },
        {
          headers: { Authorization: token },
        }
      )
      .then((response) => {
        toast.success("Edited successfully", {
          duration: 5000,
        });
        onUpdate(response.data.data);
      });
  }

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-6"
        >
          <DialogHeader>
            <DialogTitle>Edit Post</DialogTitle>
            <DialogDescription>
              Edit your post by providing a title and body.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div>
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Tell us a little bit about yourself"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div>
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={String(categoryId)}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories?.map((category) => (
                          <SelectItem
                            key={category.id}
                            value={String(category.id)}
                          >
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div>
              <FormField
                control={form.control}
                name="body"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Body</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Tell us a little bit about yourself"
                        className="resize-y"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="submit">Save changes</Button>
            </DialogClose>
          </DialogFooter>
        </form>
      </Form>
    </>
  );
}
