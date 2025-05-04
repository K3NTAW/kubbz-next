"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { GalleryHorizontal, Home, Trophy, Shield, Menu, User, LogIn, UserPlus } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

type UserWithRole = {
  role?: string;
  [key: string]: unknown;
};

function isUserWithRole(user: unknown): user is UserWithRole {
  return !!user && typeof (user as UserWithRole).role === "string";
}

export default function Navbar() {
  const { data: session, status } = useSession();
  const isAdmin = isUserWithRole(session?.user) && session?.user?.role === "admin";
  const menuItems = [
    { title: "Home", url: "/", icon: Home },
    { title: "Gallery", url: "/gallery", icon: GalleryHorizontal },
    { title: "Tournaments", url: "/tournament", icon: Trophy },
    ...(isAdmin ? [{ title: "Admin", url: "/admin", icon: Shield }] : []),
  ];

  type ProfileItem = {
    title: string;
    url: string;
    icon: React.ElementType;
    onClick?: () => void;
  };
  let profileItems: ProfileItem[];

  // Profile section logic
  if (status === "loading") {
    profileItems = [];
  } else if (session && session.user) {
    profileItems = [
      {
        title: (session.user.name as string) || (session.user.email as string) || "",
        url: "/profile",
        icon: User,
      },
      {
        title: "Sign out",
        url: "#",
        icon: LogIn,
        onClick: () => signOut({ callbackUrl: "/" }),
      },
    ];
  } else {
    profileItems = [
      { title: "Login", url: "/login", icon: LogIn },
      { title: "Register", url: "/register", icon: UserPlus },
    ];
  }

  return (
    <header className={cn("w-full border-b bg-background z-50 fixed top-0 left-0")}> 
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-lg font-semibold">Kubbz</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:gap-6">
            <NavigationMenu>
              <NavigationMenuList>
                {menuItems.map((item) => (
                  <NavigationMenuItem key={item.title}>
                    <Link
                      href={item.url}
                      className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-accent-foreground"
                    >
                      <item.icon className="mr-2 h-4 w-4" />
                      {item.title}
                    </Link>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Profile/Auth Section */}
          <div className="flex items-center gap-2">
            <div className="hidden md:flex md:items-center md:gap-2">
              {profileItems.map((item) => {
                const Icon = item.icon;
                if (item.onClick) {
                  return (
                    <Button key={item.title} variant="outline" size="sm" onClick={item.onClick}>
                      <Icon size={16} />
                      {item.title}
                    </Button>
                  );
                }
                return (
                  <Button key={item.title} variant="outline" size="sm" asChild>
                    <Link href={item.url} className="flex items-center gap-2">
                      <Icon size={16} />
                      {item.title}
                    </Link>
                  </Button>
                );
              })}
            </div>

            {/* Mobile Menu */}
            <div className="md:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent className="overflow-y-auto">
                  <SheetHeader>
                    <SheetTitle>
                      <Link href="/" className="flex items-center gap-2">
                        <span className="text-lg font-semibold">Kubbz</span>
                      </Link>
                    </SheetTitle>
                  </SheetHeader>
                  <div className="my-6 flex flex-col gap-6">
                    <Accordion
                      type="single"
                      collapsible
                      className="flex w-full flex-col gap-4"
                    >
                      {menuItems.map((item) => (
                        <AccordionItem key={item.title} value={item.title} className="border-b-0">
                          <AccordionTrigger className="py-0 font-semibold hover:no-underline">
                            {item.title}
                          </AccordionTrigger>
                          <AccordionContent className="mt-2">
                            <Link href={item.url} className="flex select-none gap-4 rounded-md p-3 leading-none outline-none transition-colors hover:bg-muted hover:text-accent-foreground">
                              <item.icon className="mr-2 h-4 w-4" />
                              <div>
                                <div className="text-sm font-semibold">{item.title}</div>
                              </div>
                            </Link>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                    <div className="border-t pt-4">
                      <div className="flex flex-col gap-3">
                        {profileItems.map((item) => {
                          const Icon = item.icon;
                          if (item.onClick) {
                            return (
                              <Button key={item.title} variant="outline" onClick={item.onClick}>
                                <Icon size={16} />
                                {item.title}
                              </Button>
                            );
                          }
                          return (
                            <Button key={item.title} variant="outline" asChild>
                              <Link href={item.url} className="flex items-center gap-2">
                                <Icon size={16} />
                                {item.title}
                              </Link>
                            </Button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
} 