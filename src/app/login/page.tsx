"use client";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Github, Circle, AlertCircle, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });
      if (res?.error) {
        // Map NextAuth error messages to user-friendly text
        let message = res.error;
        if (
          message === "CredentialsSignin" ||
          message.toLowerCase().includes("invalid") ||
          message.toLowerCase().includes("credentials")
        ) {
          message = "Incorrect email or password.";
        } else if (message.toLowerCase().includes("email")) {
          message = "Please enter a valid email address.";
        } else if (message.toLowerCase().includes("password")) {
          message = "Please enter your password.";
        } else if (message.toLowerCase().includes("required")) {
          message = "All fields are required.";
        }
        setError(message);
      } else if (res?.ok) {
        setSuccess("Login successful! Redirecting...");
        // Optionally, redirect here
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen">
      {/* Left panel: dark */}
      <div className="hidden lg:block lg:w-1/2 xl:w-2/3 relative border-r border-border bg-zinc-900">
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <h1 className="text-4xl font-bold text-zinc-50 mb-4">Kubbz</h1>
          <p className="text-lg text-zinc-200 max-w-md text-center">
            Welcome back! Sign in to access tournaments, gallery, and more.
          </p>
        </div>
      </div>
      {/* Right panel: cream/white */}
      <div className="flex flex-1 flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-zinc-50">
        <div className="w-full max-w-md mx-auto">
          <Card className="shadow-2xl">
            <CardHeader>
              <CardTitle className="text-2xl text-zinc-900">Sign in to your account</CardTitle>
              <CardDescription className="text-zinc-900">Welcome back! Please sign in to continue</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid grid-cols-2 gap-x-4">
                <Button size="sm" variant="outline" type="button" onClick={() => signIn("github")}> <Github className="mr-2 h-4 w-4" /> GitHub </Button>
                <Button size="sm" variant="outline" type="button" onClick={() => signIn("google")}> <Circle className="mr-2 h-4 w-4" /> Google </Button>
              </div>
              <p className="flex items-center gap-x-3 text-sm text-muted-foreground before:h-px before:flex-1 before:bg-border after:h-px after:flex-1 after:bg-border">
                or
              </p>
              <form className="grid gap-4" onSubmit={handleSubmit}>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-zinc-900">Email address</Label>
                  <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="name@example.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-zinc-900">Password</Label>
                  <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="••••••••••" />
                </div>
                {error && (
                  <div className="flex items-center gap-2 bg-red-100 border border-red-300 text-red-700 rounded-md px-3 py-2 text-sm mb-2">
                    <AlertCircle className="w-4 h-4 text-red-500" />
                    <span>{error}</span>
                  </div>
                )}
                {success && (
                  <div className="flex items-center gap-2 bg-green-100 border border-green-300 text-green-700 rounded-md px-3 py-2 text-sm mb-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    <span>{success}</span>
                  </div>
                )}
                <Button className="text-zinc-900 shadow-lg drop-shadow-xl" disabled={loading}>
                  {loading ? "Signing in..." : "Sign in"}
                </Button>
              </form>
            </CardContent>
            <CardFooter>
              <div className="grid w-full gap-y-4">
                <Button className="text-zinc-900" variant="link" size="sm" asChild>
                  <Link href="/register">
                    Don&apos;t have an account? Sign up
                  </Link>
                </Button>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
} 