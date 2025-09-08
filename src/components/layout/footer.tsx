import Link from "next/link";
import { HeartHandshake, Twitter, Facebook, Instagram } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-secondary text-secondary-foreground">
      <div className="container py-12 md:py-16">
        <div className="flex flex-col items-center gap-8 md:flex-row md:justify-between">
          <div className="flex flex-col items-center md:items-start">
            <Link
              href="/"
              className="mb-4 flex items-center space-x-2 text-foreground"
            >
              <HeartHandshake className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold font-headline">
                Hope Harbour
              </span>
            </Link>
            <p className="max-w-xs text-center text-sm text-muted-foreground md:text-left">
              Connecting communities, providing relief, and fostering hope in
              times of crisis.
            </p>
          </div>
          <div className="flex flex-col items-center gap-4 md:items-end">
            <div className="flex space-x-4">
              <Link
                href="#"
                className="text-muted-foreground hover:text-primary"
                aria-label="Twitter"
              >
                <Twitter />
              </Link>
              <Link
                href="#"
                className="text-muted-foreground hover:text-primary"
                aria-label="Facebook"
              >
                <Facebook />
              </Link>
              <Link
                href="#"
                className="text-muted-foreground hover:text-primary"
                aria-label="Instagram"
              >
                <Instagram />
              </Link>
            </div>
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Hope Harbour. All Rights Reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
