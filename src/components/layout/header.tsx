
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HeartHandshake, Menu } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/updates", label: "Updates" },
  { href: "/resources", label: "Resources" },
  { href: "/lost-and-found", label: "Lost & Found" },
  { href: "/support-chat", label: "AI Chat" },
  { href: "/faq", label: "FAQ" },
  { href: "/volunteer", label: "Volunteer" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-20 items-center justify-between">
        <Link href="/" className="mr-6 flex items-center space-x-2 group">
          <HeartHandshake className="h-7 w-7 text-primary group-hover:animate-pulse" />
          <span className="font-bold text-xl font-headline">Hope Harbour</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
          {navLinks.map(({ href, label }) => (
            <Link
              key={label}
              href={href}
              className={cn(
                "relative px-3 py-2 transition-colors hover:text-primary group",
                pathname === href
                  ? "text-primary font-semibold"
                  : "text-foreground/70"
              )}
            >
              {label}
              {pathname !== href && (
                 <span className="absolute inset-x-2 -bottom-1 h-0.5 bg-primary rounded-full transition-all duration-300 scale-x-0 group-hover:scale-x-100"></span>
              )}
              {pathname === href && (
                <span className="absolute inset-x-2 -bottom-1 h-0.5 bg-primary rounded-full"></span>
              )}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <Button
            asChild
            className="shadow-lg hover:shadow-xl transition-shadow bg-accent hover:bg-accent/90 rounded-full font-semibold"
          >
            <Link href="/donate">Donate Now</Link>
          </Button>
        </div>

        <div className="md:hidden">
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <div className="flex flex-col h-full">
                <div className="p-6">
                   <Link href="/" className="mr-6 flex items-center space-x-2 group" onClick={() => setIsMobileMenuOpen(false)}>
                      <HeartHandshake className="h-7 w-7 text-primary" />
                      <span className="font-bold text-xl font-headline">Hope Harbour</span>
                    </Link>
                </div>
                <nav className="flex flex-col gap-4 p-6 text-lg font-medium">
                  {navLinks.map(({ href, label }) => (
                    <SheetClose key={label} asChild>
                       <Link
                          href={href}
                          className={cn(
                            "transition-colors hover:text-primary",
                            pathname === href
                              ? "text-primary font-semibold"
                              : "text-muted-foreground"
                          )}
                        >
                          {label}
                        </Link>
                    </SheetClose>
                  ))}
                </nav>
                <div className="mt-auto p-6">
                    <SheetClose asChild>
                        <Button asChild size="lg" className="w-full bg-accent hover:bg-accent/90">
                            <Link href="/donate">Donate Now</Link>
                        </Button>
                    </SheetClose>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
