"use client";
import { usePathname } from "next/navigation";
import Navbar from "./Navbar";

export default function ClientNavbarWrapper({ children }: { children?: React.ReactNode }) {
  const pathname = usePathname();
  const hideNavbar = pathname === "/login" || pathname === "/register";
  if (hideNavbar) return children || null;
  return (
    <div className="pt-20">
      <Navbar />
      {children}
    </div>
  );
} 