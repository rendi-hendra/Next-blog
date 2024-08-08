"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";

export default function Admin() {
  return (
    <div className="h-screen">
      {/* <div className="grid grid-cols-3 lg:gap-10 w-[500px] lg:mt-10 mx-5 mt-20 gap-3 lg:text-2xl text-center text-sm"> */}
      <div className="flex justify-evenly mt-5 mx-5 gap-3 text-center">
        <Card className="neu text-2xl lg:w-72">
          <CardHeader>
            <CardTitle>
              <Image
                src="/icon/faq.png"
                width={64}
                height={64}
                alt="Picture of the author"
                className="inline"
              />
              Total posts: 10
            </CardTitle>
          </CardHeader>
        </Card>
        <Card className="neu text-2xl lg:w-72">
          <CardHeader>
            <CardTitle>
              <Image
                src="/icon/user.png"
                width={64}
                height={64}
                alt="Picture of the author"
                className="inline"
              />
              Total user: 20
            </CardTitle>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}
