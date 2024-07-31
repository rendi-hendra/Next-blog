"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { api } from "@/lib/api";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import FormData from "form-data";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { profileSchema, ProfileSchema } from "@/lib/formSchema";
import { useForm } from "react-hook-form";

type DataUser = {
  name: string;
  email: string;
  role: string;
};

export default function Profile() {
  const [data, setData] = useState<DataUser>();
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [imageSrc, setImageSrc] = useState<string>("");

  const cookie = Cookies.get("token");

  const fetchProfileData = () => {
    api
      .get("/users/current", {
        headers: { Authorization: cookie },
      })
      .then((response) => {
        setData(response.data.data);
      })
      .catch((error) => {
        console.log(error.response.data.errors);
      });

    api
      .get("/profiles/current", {
        headers: { Authorization: cookie },
        responseType: "arraybuffer",
      })
      .then((response) => {
        const blob = new Blob([response.data], {
          type: response.headers["content-type"],
        });
        const url = URL.createObjectURL(blob);
        setImageSrc(url);
      })
      .catch((error) => {
        console.log(error.response.data.errors);
      });
  };

  useEffect(() => {
    fetchProfileData();
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append("file", file);

      api
        .post("/profiles", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: cookie,
          },
        })
        .then((response) => {
          fetchProfileData(); // Ambil data gambar terbaru setelah unggahan berhasil
          toast.success("Image uploaded successfully");
        })
        .catch((error) => {
          toast.error("Image upload failed");
        });
    }
  };

  const form = useForm<ProfileSchema>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
        name: data?.name,
    }
  });

  const { handleSubmit, control } = form;

  const onSubmit = handleSubmit((value) => {
    setIsLoading(true);
    api
      .patch("/users/current", {
        name: value.name,
        password: value.password,
      }, {
        headers: { Authorization: cookie },
      })
      .then((response) => {
        setData(response.data.data);
        setIsLoading(false);
        toast.success("Updated successfully", {
          duration: 5000,
        });
      })
      .catch((error) => {
        setIsLoading(false);
        toast.error("Update failed", {
          duration: 5000,
        });
        setError(error.response.data.errors);
      });
  });

  return (
    <div>
      <div className="flex justify-center mt-10">
        <Card className="w-[30rem] h-52 flex items-center border-2 mx-10">
          <div>
            <Avatar className="border-4 border-black w-28 h-28 ml-5">
              <AvatarImage src={imageSrc} />
              <AvatarFallback>{data?.name}</AvatarFallback>
            </Avatar>
            <Input
              type="file"
              name="file"
              onChange={handleFileChange}
              className="block w-full text-sm text-slate-500
        file:mr-4 file:py-2 file:px-4 file:rounded-md
        file:border-0 file:text-sm file:font-semibold
        file:bg-pink-50 file:text-[#9E6AE2]
        hover:file:bg-pink-100 file:border-none border-none mt-3"
            />
          </div>
          <div className="mr-5">
            <p className="font-semibold text-lg">{data?.name}</p>
            <p className="">{data?.email}</p>
            <Badge variant="outline" className="bg-red-400 mt-3">
              {data?.role}
            </Badge>
          </div>
        </Card>
      </div>
      <div className="lg:mx-96 mx-10 mt-10">
        <Form {...form}>
          <form onSubmit={onSubmit} className="space-y-4">
            <FormField
              control={control}
              name="name"
              render={({ field }) => (
                <FormItem className="mb-10">
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input type="text" {...field} defaultValue={data?.name} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <p className="text-red-500">{error}</p>
            <div>
              <Button type="submit" className="w-full mt-5" disabled={isLoading}>
                Update
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
