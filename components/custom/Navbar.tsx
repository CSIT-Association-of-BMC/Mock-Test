"use client";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { Button } from "../ui/button";
import Image from "next/image";
import Link from "next/link";
import {
  MenuIcon,
  ExternalLink,
  ChevronDown,
  User,
  LogOut,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const NavLinks = [
  {
    title: "Home",
    href: "/",
  },

  {
    title: "Mock",
    href: "/practice",
  },
  {
    title: "Subjects",
    href: "/",
    children: [
      {
        title: "Physics",
        href: "/practice/subject/physics",
      },
      {
        title: "Chemistry",
        href: "/practice/subject/chemistry",
      },
      {
        title: "Mathematics",
        href: "/practice/subject/mathematics",
      },
      {
        title: "Computer",
        href: "/practice/subject/computer",
      },
      {
        title: "English",
        href: "/practice/subject/english",
      },
    ],
  },
];

const Navbar = () => {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 640) {
        setIsSheetOpen(false);
      }
    };

    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/check", {
          method: "GET",
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          if (data.authenticated) {
            setUser(data.user);
          }
        }
      } catch (err) {
        console.error("Auth check failed:", err);
      } finally {
        setLoading(false);
      }
    };

    window.addEventListener("resize", handleResize);
    checkAuth();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      setUser(null);
      router.push("/");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <nav className="bg-white/95 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0 ">
            <Link href="/" className="flex items-center">
              <Image
                src="https://res.cloudinary.com/dol8m5gx7/image/upload/v1723191383/logohero_nsqj8h.png"
                alt="CSITABMC Logo"
                priority={true}
                height={40}
                width={40}
                className="rounded-lg shadow-sm"
              />
            </Link>
          </div>

          <NavigationMenu className="hidden sm:flex">
            <NavigationMenuList className="space-x-2">
              {NavLinks.map((link) =>
                link.children && link.children.length > 0 ? (
                  <DropdownMenu key={link.title}>
                    <DropdownMenuTrigger>
                      <span className="font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-colors duration-200 flex text-sm items-center gap-1 px-3 py-2 rounded-md cursor-pointer">
                        {link.title}
                      </span>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56 mt-2 shadow-lg border-gray-200">
                      {link.children.map((child) => (
                        <DropdownMenuItem asChild key={child.title}>
                          <Link
                            href={child.href}
                            target={
                              child.href.startsWith("http") ? "_blank" : "_self"
                            }
                            rel={
                              child.href.startsWith("http")
                                ? "noopener noreferrer"
                                : ""
                            }
                            className="flex items-center justify-between w-full px-3 py-2 text-left font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-colors duration-200"
                          >
                            <span>{child.title}</span>
                            {child.href.startsWith("http") && (
                              <ExternalLink className="h-3 w-3 text-gray-400" />
                            )}
                          </Link>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <NavigationMenuItem key={link.title}>
                    <NavigationMenuLink asChild>
                      <Link
                        href={link.href}
                        className="font-medium text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md hover:bg-gray-100 transition-colors duration-200v"
                      >
                        {link.title}
                      </Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                )
              )}
            </NavigationMenuList>
          </NavigationMenu>

          <div className="hidden sm:flex items-center space-x-4">
            {!loading &&
              (user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="flex items-center gap-2 font-medium text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                    >
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-primary" />
                      </div>
                      <span className="hidden md:block">{user.name}</span>
                      <ChevronDown className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56 mt-2 shadow-lg border-gray-200">
                    <DropdownMenuItem asChild>
                      <Link
                        href="/dashboard"
                        className="flex items-center w-full px-3 py-2 text-left font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-colors duration-200"
                      >
                        <User className="w-4 h-4 mr-2" />
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="flex items-center w-full px-3 py-2 text-left font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link href="/login">
                  <Button
                    variant="outline"
                    className="font-medium border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
                  >
                    Login
                  </Button>
                </Link>
              ))}
          </div>

          {/* Mobile Menu Button */}
          <div className="sm:hidden">
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="border-gray-300 hover:bg-gray-50 transition-colors duration-200"
                >
                  <MenuIcon className="h-5 w-5 text-gray-700" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <MobileView
                setIsSheetOpen={setIsSheetOpen}
                user={user}
                loading={loading}
                handleLogout={handleLogout}
              />
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};

function MobileView({
  setIsSheetOpen,
  user,
  loading,
  handleLogout,
}: {
  setIsSheetOpen: (open: boolean) => void;
  user: any;
  loading: boolean;
  handleLogout: () => void;
}) {
  const handleLinkClick = () => {
    setIsSheetOpen(false);
  };

  return (
    <SheetContent className="w-[280px] sm:w-[400px] px-0 bg-white overflow-y-auto">
      <SheetHeader className="px-6 pb-3 border-b border-gray-200">
        <SheetTitle className="text-left flex items-center gap-3">
          <Image
            src="https://res.cloudinary.com/dol8m5gx7/image/upload/v1723191383/logohero_nsqj8h.png"
            alt="CSITABMC Logo"
            height={32}
            width={32}
            className="rounded-lg"
          />
          <span className="text-lg font-semibold text-gray-900">CSITABMC</span>
        </SheetTitle>
      </SheetHeader>

      <div className="px-6 py-6">
        <nav className="space-y-1">
          {NavLinks.map((link) =>
            link.children && link.children.length > 0 ? (
              <div key={link.title} className="space-y-3">
                <div className="text-sm font-semibold text-gray-900 px-3 py-2 bg-gray-50 rounded-lg">
                  {link.title}
                </div>
                <div className="pl-4 space-y-1">
                  {link.children.map((child) => (
                    <Link
                      key={child.title}
                      href={child.href}
                      target={
                        child.href.startsWith("http") ? "_blank" : "_self"
                      }
                      rel={
                        child.href.startsWith("http")
                          ? "noopener noreferrer"
                          : ""
                      }
                      onClick={handleLinkClick}
                      className="flex items-center justify-between w-full px-3 py-2 text-left font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors duration-200"
                    >
                      <span>{child.title}</span>
                      {child.href.startsWith("http") && (
                        <ExternalLink className="h-4 w-4 text-gray-400" />
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <Link
                key={link.title}
                href={link.href}
                onClick={handleLinkClick}
                className="flex items-center w-full px-3 py-3 text-left font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                {link.title}
              </Link>
            )
          )}
        </nav>

        <div className="pt-6 mt-6 border-t border-gray-200">
          {!loading &&
            (user ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3 px-3 py-2 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-primary" />
                  </div>
                  <span className="font-medium text-gray-900">{user.name}</span>
                </div>
                <Link href="/dashboard" onClick={handleLinkClick}>
                  <Button
                    variant="outline"
                    className="w-full font-medium border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
                  >
                    <User className="w-4 h-4 mr-2" />
                    Dashboard
                  </Button>
                </Link>
                <Button
                  onClick={() => {
                    handleLogout();
                    handleLinkClick();
                  }}
                  variant="outline"
                  className="w-full font-medium border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </div>
            ) : (
              <Link href="/login" onClick={handleLinkClick}>
                <Button
                  variant="outline"
                  className="w-full font-medium border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
                >
                  Login
                </Button>
              </Link>
            ))}
        </div>
      </div>
    </SheetContent>
  );
}

export default Navbar;
