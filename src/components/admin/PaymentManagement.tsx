"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Download, RefreshCw, Search, DollarSign } from "lucide-react";
import { formatDate, formatCurrency } from "@/lib/utils";
import useSWR, { mutate } from "swr";
import { arrayFetcher, swrConfig } from "@/lib/swr-config";
import { Input } from "@/components/ui/input";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function PaymentManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const { data: payments, isLoading } = useSWR("/api/payments", arrayFetcher, swrConfig);
  const { data: tournaments } = useSWR("/api/tournaments", arrayFetcher, swrConfig);

  const handleRefund = async (paymentId: string, stripePaymentId: string) => {
    if (!confirm("Sind Sie sicher, dass Sie diese Zahlung erstatten möchten?")) {
      return;
    }

    try {
      const response = await fetch(`/api/payments/${paymentId}/refund`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stripePaymentId }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Fehler beim Erstatten");
      }

      mutate("/api/payments");
      alert("Zahlung wurde erfolgreich erstattet");
    } catch (error: any) {
      alert(error.message || "Fehler beim Erstatten der Zahlung");
    }
  };

  const filteredPayments = payments?.filter((payment: any) => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    return (
      payment.user?.name?.toLowerCase().includes(search) ||
      payment.user?.email?.toLowerCase().includes(search) ||
      payment.registration?.tournament?.name?.toLowerCase().includes(search) ||
      payment.stripePaymentId?.toLowerCase().includes(search)
    );
  }) || [];

  const totalRevenue = payments?.reduce(
    (sum: number, p: any) => (p.status === "COMPLETED" ? sum + p.amount : sum),
    0
  ) || 0;

  const pendingPayments = payments?.filter((p: any) => p.status === "PENDING").length || 0;

  if (isLoading) {
    return (
      <Card className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
        <CardContent className="p-6">
          <div className="text-zinc-600 dark:text-zinc-400">Laden...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-zinc-900 dark:text-zinc-50">Gesamtumsatz</CardTitle>
            <DollarSign className="h-4 w-4 text-zinc-500 dark:text-zinc-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">{formatCurrency(totalRevenue)}</div>
            <p className="text-xs text-zinc-600 dark:text-zinc-400">Aus erfolgreichen Zahlungen</p>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-zinc-900 dark:text-zinc-50">Ausstehende Zahlungen</CardTitle>
            <RefreshCw className="h-4 w-4 text-zinc-500 dark:text-zinc-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">{pendingPayments}</div>
            <p className="text-xs text-zinc-600 dark:text-zinc-400">Noch nicht abgeschlossen</p>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-zinc-900 dark:text-zinc-50">Gesamt Zahlungen</CardTitle>
            <Download className="h-4 w-4 text-zinc-500 dark:text-zinc-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">{payments?.length || 0}</div>
            <p className="text-xs text-zinc-600 dark:text-zinc-400">Alle Zahlungen</p>
          </CardContent>
        </Card>
      </div>

      {/* Payments Table */}
      <Card className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-zinc-900 dark:text-zinc-50">Zahlungen verwalten</CardTitle>
              <CardDescription className="text-zinc-600 dark:text-zinc-400">
                Alle Zahlungen und Erstattungen verwalten
              </CardDescription>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-400" />
              <Input
                placeholder="Suchen..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredPayments.length === 0 ? (
            <p className="text-sm text-zinc-600 dark:text-zinc-400">Keine Zahlungen gefunden.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-zinc-200 dark:border-zinc-800">
                  <TableHead className="text-zinc-600 dark:text-zinc-400">Benutzer</TableHead>
                  <TableHead className="text-zinc-600 dark:text-zinc-400">Turnier</TableHead>
                  <TableHead className="text-zinc-600 dark:text-zinc-400">Betrag</TableHead>
                  <TableHead className="text-zinc-600 dark:text-zinc-400">Status</TableHead>
                  <TableHead className="text-zinc-600 dark:text-zinc-400">Datum</TableHead>
                  <TableHead className="text-zinc-600 dark:text-zinc-400">Stripe ID</TableHead>
                  <TableHead className="text-right text-zinc-600 dark:text-zinc-400">Aktionen</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPayments.map((payment: any) => (
                  <TableRow key={payment.id} className="border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800">
                    <TableCell className="font-medium text-zinc-900 dark:text-zinc-50">
                      {payment.user?.name || payment.user?.email || "Unbekannt"}
                    </TableCell>
                    <TableCell className="text-zinc-600 dark:text-zinc-400">
                      {payment.registration?.tournament?.name || "N/A"}
                    </TableCell>
                    <TableCell className="text-zinc-600 dark:text-zinc-400">
                      {formatCurrency(payment.amount)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          payment.status === "COMPLETED"
                            ? "default"
                            : payment.status === "PENDING"
                            ? "secondary"
                            : payment.status === "FAILED"
                            ? "destructive"
                            : "outline"
                        }
                        className={
                          payment.status === "COMPLETED"
                            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                            : payment.status === "PENDING"
                            ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
                            : payment.status === "FAILED"
                            ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                            : ""
                        }
                      >
                        {payment.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-zinc-600 dark:text-zinc-400">
                      {formatDate(payment.createdAt)}
                    </TableCell>
                    <TableCell className="text-zinc-600 dark:text-zinc-400 font-mono text-xs">
                      {payment.stripePaymentId ? payment.stripePaymentId.slice(-8) : "-"}
                    </TableCell>
                    <TableCell className="text-right">
                      {payment.status === "COMPLETED" && payment.stripePaymentId && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRefund(payment.id, payment.stripePaymentId)}
                          className="bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 border-zinc-200 dark:border-zinc-700"
                        >
                          Erstatten
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

