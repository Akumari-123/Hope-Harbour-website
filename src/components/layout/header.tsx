
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X, HeartHandshake } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/updates", label: "Updates" },
  { href: "/resources", label: "Resources" },
  { href: "/lost-and-found", label: "Lost & Found" },
  { href: "/faq", label: "FAQ" },
  { href: "/volunteer", label: "Volunteer" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-20 items-center">
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2 group">
            <HeartHandshake className="h-7 w-7 text-primary group-hover:animate-pulse" />
            <span className="font-bold text-xl font-headline">Hope Harbour</span>
          </Link>
          <nav className="hidden items-center space-x-1 text-sm font-medium md:flex">
            {navLinks.map(({ href, label }) => (
              <Link
                key={label}
                href={href}
                className={cn(
                  "relative px-3 py-2 transition-colors hover:text-primary group",
                  pathname === href ? "text-primary font-semibold" : "text-foreground/70"
                )}
              >
                {label}
                {pathname === href && (
                   <span className="absolute inset-x-2 -bottom-2 h-0.5 bg-primary rounded-full transition-all duration-300"></span>
                )}
                 <span className="absolute inset-x-2 -bottom-2 h-0.5 bg-primary rounded-full transition-all duration-300 scale-x-0 group-hover:scale-x-100"></span>
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex flex-1 items-center justify-end space-x-2">
          <Button asChild className="hidden md:inline-flex shadow-sm hover:shadow-lg transition-shadow bg-accent hover:bg-accent/90">
            <Link href="/donate">Donate Now</Link>
          </Button>
          <Sheet open={isMobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                className="px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
                aria-label="Open navigation menu"
              >
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="pr-0">
              <div className="flex items-center justify-between pl-6 mb-4">
                <Link href="/" className="flex items-center space-x-2">
                  <HeartHandshake className="h-6 w-6 text-primary" />
                  <span className="font-bold">Hope Harbour</span>
                </Link>
              </div>
              <div className="my-4 h-[calc(100vh-8rem)] pb-10 pl-6">
                <div className="flex flex-col space-y-4">
                  {navLinks.map(({ href, label }) => (
                    <Link
                      key={label}
                      href={href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        "text-lg transition-colors hover:text-foreground",
                        pathname === href
                          ? "text-foreground font-semibold"
                          : "text-foreground/60"
                      )}
                    >
                      {label}
                    </Link>
                  ))}
                </div>
              </div>
              <div className="pl-6">
                <Button asChild className="w-full">
                  <Link href="/donate">Donate Now</Link>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
