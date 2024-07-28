"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Category, postFormSchema, PostFormSchema } from "@/lib/formSchema";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import Cookies from "js-cookie";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";

export default function CreatePost() {
  const router = useRouter();
  const token = Cookies.get("token");

  const [categories, setCategories] = useState<Category[]>();

  const form = useForm<PostFormSchema>({
    resolver: zodResolver(postFormSchema),
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
      .post(
        "/posts",
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
        toast.success("Created successfully", {
          duration: 5000,
        });
        router.replace("/dashboard");
      })
      .catch(() => {
        router.refresh();
      });
  }
  return (
    <div className="">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-6"
        >
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
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories?.map((category) => (
                      <SelectItem key={category.id} value={String(category.id)}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
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

          <Button type="submit" className="w-full h-12">
            Post
          </Button>
        </form>
      </Form>
    </div>
  );
}
