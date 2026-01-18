"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TournamentManagement } from "@/components/admin/TournamentManagement";
import { UserManagement } from "@/components/admin/UserManagement";
import { GalleryManagement } from "@/components/admin/GalleryManagement";
import { PaymentManagement } from "@/components/admin/PaymentManagement";
import { Trophy, Users, Calendar, DollarSign, Image as ImageIcon } from "lucide-react";
import useSWR from "swr";
import { arrayFetcher, swrConfig } from "@/lib/swr-config";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/lib/utils";

export function AdminDashboard() {
  const { data: tournaments, isLoading: tournamentsLoading } = useSWR("/api/tournaments", arrayFetcher, swrConfig);
  const { data: users, isLoading: usersLoading } = useSWR("/api/users", arrayFetcher, swrConfig);
  const { data: payments, isLoading: paymentsLoading } = useSWR("/api/payments", arrayFetcher, swrConfig);

  // Ensure tournaments and users are arrays
  const tournamentsArray = Array.isArray(tournaments) ? tournaments : [];
  const usersArray = Array.isArray(users) ? users : [];

  // Show loading state for stats
  if (tournamentsLoading || usersLoading || paymentsLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <Skeleton className="h-9 w-64 mb-2" />
          <Skeleton className="h-5 w-96" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6">
              <Skeleton className="h-4 w-24 mb-4" />
              <Skeleton className="h-8 w-16 mb-2" />
              <Skeleton className="h-3 w-32" />
            </div>
          ))}
        </div>
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  const totalTournaments = tournamentsArray.length || 0;
  const upcomingTournaments = tournamentsArray.filter(
    (t: any) => t && t.date && !isNaN(new Date(t.date).getTime()) && new Date(t.date) >= new Date()
  ).length || 0;
  const totalUsers = usersArray.length || 0;
  const totalRegistrations = tournamentsArray.reduce(
    (acc: number, t: any) => acc + (Array.isArray(t.registrations) ? t.registrations.length : 0),
    0
  ) || 0;
  const totalRevenue = payments?.reduce(
    (sum: number, p: any) => (p.status === "COMPLETED" ? sum + p.amount : sum),
    0
  ) || 0;

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 mt-4 text-zinc-900 dark:text-zinc-50">Admin Dashboard</h1>
        <p className="text-zinc-600 dark:text-zinc-400">
          Verwalten Sie Turniere, Benutzer und mehr
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-zinc-900 dark:text-zinc-50">Turniere</CardTitle>
            <Trophy className="h-4 w-4 text-zinc-500 dark:text-zinc-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">{totalTournaments}</div>
            <p className="text-xs text-zinc-600 dark:text-zinc-400">
              {upcomingTournaments} kommende
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-zinc-900 dark:text-zinc-50">Benutzer</CardTitle>
            <Users className="h-4 w-4 text-zinc-500 dark:text-zinc-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">{totalUsers}</div>
            <p className="text-xs text-zinc-600 dark:text-zinc-400">Registrierte Benutzer</p>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-zinc-900 dark:text-zinc-50">Anmeldungen</CardTitle>
            <Calendar className="h-4 w-4 text-zinc-500 dark:text-zinc-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">{totalRegistrations}</div>
            <p className="text-xs text-zinc-600 dark:text-zinc-400">Gesamt Anmeldungen</p>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-zinc-900 dark:text-zinc-50">Umsatz</CardTitle>
            <DollarSign className="h-4 w-4 text-zinc-500 dark:text-zinc-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">{formatCurrency(totalRevenue)}</div>
            <p className="text-xs text-zinc-600 dark:text-zinc-400">Gesamt aus erfolgreichen Zahlungen</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="tournaments" className="space-y-4">
        <TabsList className="bg-zinc-100 dark:bg-zinc-800">
          <TabsTrigger value="tournaments" className="data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-900 data-[state=active]:text-zinc-900 dark:data-[state=active]:text-zinc-50">Turniere</TabsTrigger>
          <TabsTrigger value="users" className="data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-900 data-[state=active]:text-zinc-900 dark:data-[state=active]:text-zinc-50">Benutzer</TabsTrigger>
          <TabsTrigger value="payments" className="data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-900 data-[state=active]:text-zinc-900 dark:data-[state=active]:text-zinc-50">Zahlungen</TabsTrigger>
          <TabsTrigger value="gallery" className="data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-900 data-[state=active]:text-zinc-900 dark:data-[state=active]:text-zinc-50">Galerie</TabsTrigger>
        </TabsList>
        <TabsContent value="tournaments" className="space-y-4">
          <TournamentManagement />
        </TabsContent>
        <TabsContent value="users" className="space-y-4">
          <UserManagement />
        </TabsContent>
        <TabsContent value="payments" className="space-y-4">
          <PaymentManagement />
        </TabsContent>
        <TabsContent value="gallery" className="space-y-4">
          <GalleryManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
}

