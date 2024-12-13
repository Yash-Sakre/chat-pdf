"use client";

import { useUser } from "@clerk/nextjs";
// import { useRouter } from "next/navigation";
import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";
import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Check, FileText, MessageSquare, Zap } from "lucide-react";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Github } from "lucide-react";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { useTheme } from "@/hooks/useTheme";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function Home() {
  const { user } = useUser();
  const { theme } = useTheme();

  const createUser = useMutation(api.user.createUser);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    user && CheckUser();
  }, [user]);

  console.log(user);

  const CheckUser = async () => {
    await createUser({
      email: user?.primaryEmailAddress?.emailAddress || "",
      userName: user?.fullName || "",
      imageUrl: user?.imageUrl || "",
    });
  };

  return (
    <div className="min-h-screen ">
      <header className="px-4 lg:px-6 h-20 flex items-center justify-between">
        <div className="flex items-center justify-between">
          <Link className="flex items-center justify-center" href="/">
            <Image
              src={`${theme == "dark" ? "/logo.png" : "/LogoDark.png"}`}
              alt="logo"
              width={150}
              height={150}
            />
          </Link>
        </div>
        <NavigationMenu className="hidden md:flex mx-6">
          <NavigationMenuList className="gap-6">
            <NavigationMenuItem>
              <Link href="#" legacyBehavior passHref>
                <NavigationMenuLink className="text-lg">
                  Home
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="#" legacyBehavior passHref>
                <NavigationMenuLink className="text-lg">
                  About
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="#" legacyBehavior passHref>
                <NavigationMenuLink className="text-lg">
                  Pricing
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="#" legacyBehavior passHref>
                <NavigationMenuLink className="text-lg">
                  Contact
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
        <div className=" flex items-center space-x-4">
          <ModeToggle />
          <Link href={"/sign-in"}>
            <Button variant="ghost" className="">
              Sign In
            </Button>
          </Link>
          <Link href={"/sign-up"}>
            <Button className=" ">Sign Up</Button>
          </Link>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className=" px-4 md:px-6 ">
            <div className="flex flex-col items-center space-y-8 text-center">
              <div className="space-y-4 max-w-3xl">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                  Chat with Your PDFs Using AI
                </h1>
                <p className="mx-auto max-w-[700px]  md:text-xl">
                  Upload your PDF, ask questions, and get instant answers. Our
                  AI-powered tool makes document interaction seamless and
                  intelligent.
                </p>
              </div>
              <div className="space-x-4 flex items-center ">
                <Link
                  href={"https://github.com/Yash-Sakre/chat-pdf"}
                  target="__blank"
                >
                  <Button variant="outline" className=" ">
                    <Github className="mr-2 h-4 w-4" />
                    Star on Github
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
        <section className=" w-full flex items-center justify-center">
          <Image
            src="/chat.png"
            width={1200}
            height={600}
            alt="Dashboard Preview"
            className="rounded-t-lg border border-white/10 shadow-2xl flex items-center justify-center"
          />
        </section>

        <section
          id="features"
          className="w-full py-12 md:py-24 lg:py-32 flex items-center justify-center"
        >
          <div className=" px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-8">
              Key Features
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="w-full">
                <CardContent className="flex flex-col items-center p-6">
                  <FileText className="h-12 w-12 text-blue-500 mb-4" />
                  <h3 className="text-lg font-semibold mb-2">PDF Upload</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                    Easily process any PDF document
                  </p>
                </CardContent>
              </Card>
              <Card className="w-full">
                <CardContent className="flex flex-col items-center p-6">
                  <MessageSquare className="h-12 w-12 text-blue-500 mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    Interactive Chat
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                    Ask questions and get precise answers
                  </p>
                </CardContent>
              </Card>
              <Card className="w-full">
                <CardContent className="flex flex-col items-center p-6">
                  <Zap className="h-12 w-12 text-blue-500 mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    AI-Powered Analysis
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                    Advanced algorithms for accurate responses
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        <section id="pricing" className="w-full py-12 md:py-24 lg:py-32 ">
          <div className=" px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2 max-w-[600px]">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Pricings
                </h2>
                <p className="text-gray-400 md:text-xl">
                  Upgrade your plan to upload multiple pdf to chat with.
                </p>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-6 mt-8 max-w-[1000px] mx-auto">
              <Card className="relative  border-2">
                <CardContent className="p-6">
                  <div className="space-y-2 mb-4">
                    <h3 className="text-lg font-medium text-gray-200">FREE</h3>
                    <div className="flex items-baseline text-gray-200">
                      <span className="text-4xl font-bold">0</span>
                      <span className="text-xl font-semibold">$</span>
                      <span className="ml-1 text-gray-400">/month</span>
                    </div>
                  </div>
                  <ul className="space-y-4">
                    <li className="flex items-center">
                      <Check className="h-4 w-4 mr-2 " />
                      <span className="text-gray-300">5 PDF Upload</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="h-4 w-4 mr-2 " />
                      <span className="text-gray-300">limited Chats</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="h-4 w-4 mr-2 " />
                      <span className="text-gray-300">Email support</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="h-4 w-4 mr-2 " />
                      <span className="text-gray-300">Help center access</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
              <Card className="">
                <CardContent className="p-6">
                  <div className="space-y-2 mb-4">
                    <h3 className="text-lg font-medium text-gray-200">
                      Unlimited
                    </h3>
                    <div className="flex items-baseline text-gray-200">
                      <span className="text-4xl font-bold">9.99</span>
                      <span className="text-xl font-semibold">$</span>
                      <span className="ml-1 text-gray-400">/month</span>
                    </div>
                  </div>
                  <ul className="space-y-4">
                    <li className="flex items-center">
                      <Check className="h-4 w-4 mr-2 " />
                      <span className="text-gray-300">
                        Unlimited PDF Upload
                      </span>
                    </li>
                    <li className="flex items-center">
                      <Check className="h-4 w-4 mr-2 " />
                      <span className="text-gray-300">Unlimited Chats</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="h-4 w-4 mr-2 " />
                      <span className="text-gray-300">Email support</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="h-4 w-4 mr-2 " />
                      <span className="text-gray-300">Help center access</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        <section id="get-started" className="w-full py-12 md:py-24 lg:py-32 ">
          <div className=" px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Ready to Chat with Your PDFs?
                </h2>
                <p className="mx-auto max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400">
                  Join now and experience the power of AI-assisted document
                  interaction.
                </p>
              </div>
              <div className="w-full max-w-sm space-y-2">
                <form className="flex space-x-2">
                  <Input
                    className="max-w-lg flex-1"
                    placeholder="Enter your email"
                    type="email"
                  />
                  <Button type="submit">Sign Up</Button>
                </form>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  By signing up, you agree to our{" "}
                  <Link className="underline underline-offset-2" href="#">
                    Terms & Conditions
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          © 2024 ChatPDF AI. All rights reserved.
        </p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  );
}
