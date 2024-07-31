"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { api } from "@/lib/api";
import Cookies from "js-cookie";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type DataUser = {
  name: string;
  email: string;
  role: string;
};

export function UserNav() {
  const cookie = Cookies.get("token");
  const router = useRouter();

  const [data, setData] = useState<DataUser>();
  const [imageSrc, setImageSrc] = useState<string>("");

  useEffect(() => {
    api
      .get("/users/current", {
        headers: { Authorization: cookie },
      })
      .then((response) => {
        console.log("Render");
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
  }, []);

  const signOut = () => {
    api
      .delete("/users/current", {
        headers: { Authorization: cookie },
      })
      .then((response) => {
        Cookies.remove("token");
        router.push("/login");
      })
      .catch((error) => {
        console.log(error.response.data.errors);
      });
  };

  const session = {
    user: {
      name: data?.name,
      email: data?.email,
      role: data?.role,
      image: imageSrc,
    },
  };
  if (session) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-9 w-9 rounded-full mt-5">
            <Avatar className="h-8 w-8">
              <AvatarImage
                src={session.user?.image ?? ""}
                alt={session.user?.name ?? ""}
              />
              <AvatarFallback>{session.user?.name?.[0]}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-56"
          align="end"
          forceMount
        >
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1 ">
              <p className="text-sm font-medium leading-none">
                {session.user?.name}
              </p>
              <p className="text-xs leading-none text-muted-foreground">
                {session.user?.email}
              </p>
              <p className={`text-xs leading-none text-muted-foreground ${session.user?.role === "User" ? "font-normal" : "font-bold text-red-500"}`}>
                {session.user?.role}
              </p>
            </div>
          </DropdownMenuLabel>
          {/* <DropdownMenuSeparator className="border border-black" /> */}
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <Link href="/dashboard/profile">Profile</Link>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          {/* <DropdownMenuSeparator className="border border-black" /> */}
          <DropdownMenuItem onClick={() => signOut()}>Log out</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }
}
