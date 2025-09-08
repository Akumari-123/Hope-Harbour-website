
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HeartHandshake } from "lucide-react";

import { Button } from "@/components/ui/button";
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

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-auto flex-col items-center justify-between py-4 sm:flex-row sm:h-20">
        <div className="flex items-center mb-4 sm:mb-0">
          <Link href="/" className="mr-6 flex items-center space-x-2 group">
            <HeartHandshake className="h-7 w-7 text-primary group-hover:animate-pulse" />
            <span className="font-bold text-xl font-headline">Hope Harbour</span>
          </Link>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          <nav className="flex flex-wrap justify-center items-center text-sm font-medium">
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
                {pathname === href && (
                  <span className="absolute inset-x-2 -bottom-1 h-0.5 bg-primary rounded-full transition-all duration-300"></span>
                )}
                <span className="absolute inset-x-2 -bottom-1 h-0.5 bg-primary rounded-full transition-all duration-300 scale-x-0 group-hover:scale-x-100"></span>
              </Link>
            ))}
          </nav>
          <Button
            asChild
            className="shadow-lg hover:shadow-xl transition-shadow bg-accent hover:bg-accent/90 rounded-full font-semibold mt-4 sm:mt-0"
          >
            <Link href="/donate">Donate Now</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
