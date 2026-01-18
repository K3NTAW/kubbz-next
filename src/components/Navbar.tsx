"use client";

import Link from "next/link";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, LogOut, Settings, Trophy, Moon, Sun, Menu } from "lucide-react";
import { useState, useEffect } from "react";

export function Navbar() {
  const { data: session, status } = useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <nav className="fixed top-0 w-full z-50 glass-nav transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logo.jpg"
            alt="Kubb Zürich Logo"
            width={32}
            height={32}
            className="h-8 w-auto object-contain rounded-[5px]"
            priority
          />
          <span className="font-display font-semibold tracking-tight text-lg">Kubb Zürich</span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="/" className="text-sm font-medium text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-brand-blue transition-colors">
            Home
          </Link>
          <Link href="/tournaments" className="text-sm font-medium text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-brand-blue transition-colors">
            Turniere
          </Link>
          <Link href="/gallery" className="text-sm font-medium text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-brand-blue transition-colors">
            Galerie
          </Link>
          <Link href="/about" className="text-sm font-medium text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-brand-blue transition-colors">
            Über uns
          </Link>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-100 rounded-full transition-all"
            aria-label="Toggle dark mode"
          >
            {mounted && theme === "dark" ? (
              <Sun className="w-4 h-4" />
            ) : (
              <Moon className="w-4 h-4" />
            )}
            <span className="sr-only">Toggle dark mode</span>
          </button>
          
          {status === "loading" ? (
            <div className="h-8 w-8 animate-pulse rounded-full bg-muted" />
          ) : session ? (
            <div className="hidden md:flex items-center gap-3 pl-3 border-l border-zinc-200">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <User className="h-5 w-5" />
                    <span className="sr-only">Benutzer-Menü</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">{session.user?.name || session.user?.email}</p>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400">{session.user?.email}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="flex items-center text-zinc-900 dark:text-zinc-50">
                      <Settings className="mr-2 h-4 w-4" />
                      Profil
                    </Link>
                  </DropdownMenuItem>
                  {session.user?.role === "ADMIN" && (
                    <DropdownMenuItem asChild>
                      <Link href="/admin" className="flex items-center text-zinc-900 dark:text-zinc-50">
                        <Trophy className="mr-2 h-4 w-4" />
                        Admin
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="text-red-500 dark:text-red-400 focus:bg-red-50 dark:focus:bg-red-900/20"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Abmelden
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-3 pl-3 border-l border-zinc-200">
              <Link href="/login" className="text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-brand-blue transition-colors">
                Log in
              </Link>
              <Button asChild className="bg-brand-blue text-white text-sm font-medium px-4 py-2 rounded-full hover:bg-brand-blue/90 transition-all shadow-lg shadow-brand-blue/20">
                <Link href="/register">Registrieren</Link>
              </Button>
            </div>
          )}
          
          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-zinc-900"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-zinc-200 dark:border-zinc-800 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md">
          <div className="px-6 py-4 space-y-3">
            <Link href="/" className="block text-sm font-medium text-zinc-900 dark:text-zinc-400 hover:text-brand-blue dark:hover:text-brand-blue transition-colors">Home</Link>
            <Link href="/tournaments" className="block text-sm font-medium text-zinc-900 dark:text-zinc-400 hover:text-brand-blue dark:hover:text-brand-blue transition-colors">Turniere</Link>
            <Link href="/gallery" className="block text-sm font-medium text-zinc-900 dark:text-zinc-400 hover:text-brand-blue dark:hover:text-brand-blue transition-colors">Galerie</Link>
            <Link href="/about" className="block text-sm font-medium text-zinc-900 dark:text-zinc-400 hover:text-brand-blue dark:hover:text-brand-blue transition-colors">Über uns</Link>
            {!session && (
              <>
                <Link href="/login" className="block text-sm font-medium text-zinc-900 dark:text-zinc-400 hover:text-brand-blue dark:hover:text-brand-blue transition-colors">Log in</Link>
                <Button asChild className="w-full bg-brand-blue text-white">
                  <Link href="/register">Registrieren</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
