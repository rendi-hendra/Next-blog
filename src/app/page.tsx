"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";
import { useRouter } from "next/navigation";

const registerFormSchema = z.object({
  name: z.string().min(4).max(50),
  email: z.string().email(),
  password: z.string().min(4).max(100),
});

type RegisterFormSchema = z.infer<typeof registerFormSchema>;

export default function Register() {
  const [error, setError] = useState<string>("");
  const router = useRouter();

  const form = useForm<RegisterFormSchema>({
    resolver: zodResolver(registerFormSchema),
  });

  const { handleSubmit, control } = form;

  const onSubmit = handleSubmit((val) => {
    api
      .post("/users", {
        name: val.name,
        email: val.email,
        password: val.password,
      })
      .then((response) => {
        router.push("/login");
      })
      .catch((error) => {
        console.log(error.response.data.errors);
        setError(error.response.data.errors);
      });
  });

  return (
    <main>
      <div className="flex h-screen ">
        <div className="lg:flex items-center justify-center flex-1 bg-white text-black flex ">
          <div className="md:w-[30rem] lg:w-[30rem] flex items-center justify-center shadow-lg rounded-xl mx-5">
            <div className="max-w-md w-full p-6">
              <h1 className="text-3xl font-semibold mb-6 text-black text-center">
                Sign Up
              </h1>
              <h1 className="text-sm font-semibold mb-6 text-gray-500 text-center">
                Join to Our Community with all time access and free
              </h1>
              <Form {...form}>
                <form onSubmit={onSubmit} className="space-y-4">
                  <FormField
                    control={control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input type="text" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" {...field} />
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
                    <Button type="submit" className="w-full ">
                      Sing Up
                    </Button>
                  </div>
                </form>
              </Form>
              <div className="mt-4 text-sm text-gray-600 text-center">
                <p>
                  Already have an account?{" "}
                  <Link className="text-black hover:underline" href="/login">
                    Login
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
