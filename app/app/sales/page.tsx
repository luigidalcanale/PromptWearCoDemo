"use client";

import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { MetricCard } from "@/components/MetricCard";
import { AIInsightBox } from "@/components/AIInsightBox";
import { LastUpdated } from "@/components/LastUpdated";
import salesData from "@/data/sales.json";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area,
} from "recharts";

const CHART_COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
];

const fmt = (v: number) => `$${v.toLocaleString()}`;

type Period = "today" | "yesterday" | "week";

const todayTotals = {
  gross: salesData.grossSales,
  net: salesData.netSales,
  orders: salesData.orders,
  conv: salesData.conversionRate,
  aov: salesData.averageOrderValue,
};

const yesterday = salesData.weeklyTrend[salesData.weeklyTrend.length - 2];
const last7 = salesData.weeklyTrend.slice(-7);
const weekTotal = last7.reduce((s, d) => s + d.revenue, 0);
const weekOrders = last7.reduce((s, d) => s + d.orders, 0);

const channelTotal = salesData.channels.reduce((s, c) => s + c.revenue, 0);

const periodData = (p: Period) => {
  if (p === "yesterday") {
    return {
      gross: yesterday.revenue,
      net: Math.round(yesterday.revenue * 0.957),
      orders: yesterday.orders,
      conv: 0.018,
      aov: yesterday.revenue / yesterday.orders,
      label: "vs. day before",
    };
  }
  if (p === "week") {
    return {
      gross: weekTotal,
      net: Math.round(weekTotal * 0.957),
      orders: weekOrders,
      conv: 0.019,
      aov: weekTotal / weekOrders,
      label: "rolling 7 days",
    };
  }
  return {
    gross: todayTotals.gross,
    net: todayTotals.net,
    orders: todayTotals.orders,
    conv: todayTotals.conv,
    aov: todayTotals.aov,
    label: "+18% vs. yesterday",
  };
};

export default function SalesDashboardPage() {
  const [period, setPeriod] = useState<Period>("today");
  const d = periodData(period);

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <PageHeader
        title="Sales Dashboard"
        subtitle={`PromptWear Co. · ${salesData.date}`}
        badge="Today's Report"
        actions={<LastUpdated minutesAgo={2} />}
      />

      {/* Period toggle */}
      <div className="no-print inline-flex rounded-lg border border-border bg-card p-1 mb-6">
        {(["today", "yesterday", "week"] as Period[]).map((p) => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              period === p
                ? "bg-foreground text-background"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {p === "today" ? "Today" : p === "yesterday" ? "Yesterday" : "Last 7 Days"}
          </button>
        ))}
      </div>

      {/* Key metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
        <MetricCard label="Gross Sales" value={fmt(d.gross)} trend={d.label} status="healthy" direction="up" />
        <MetricCard label="Net Sales" value={fmt(d.net)} trend={`After refunds`} status="healthy" />
        <MetricCard label="Orders" value={String(d.orders)} trend={period === "week" ? "7-day total" : "Strong day"} status="healthy" direction="up" />
        <MetricCard label="Conversion Rate" value={`${(d.conv * 100).toFixed(1)}%`} trend="Below 2.2% goal" status="warning" direction="down" />
        <MetricCard label="Avg Order Value" value={`$${d.aov.toFixed(2)}`} trend="Stable" status="healthy" direction="flat" />
      </div>

      {/* Secondary stats: customers + cart */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
        <MetricCard label="New Customers" value={String(salesData.newCustomers)} trend="79% of orders" status="healthy" direction="up" />
        <MetricCard label="Returning Customers" value={String(salesData.returningCustomers)} trend={`${(salesData.returningCustomerRate * 100).toFixed(0)}% of orders`} status="healthy" />
        <MetricCard label="Abandoned Carts" value={String(salesData.abandonedCarts)} trend={`${fmt(salesData.abandonedCartValue)} value at risk`} status="warning" direction="down" />
        <MetricCard label="Sessions" value={salesData.sessions.toLocaleString()} trend="Strong traffic" status="healthy" direction="up" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Revenue by channel — fixed labels */}
        <div className="bg-card text-card-foreground rounded-xl border border-border p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-foreground mb-4">Revenue by Channel</h2>
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 items-center">
            <div className="sm:col-span-3">
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={salesData.channels}
                    dataKey="revenue"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={48}
                    outerRadius={86}
                    paddingAngle={2}
                    stroke="var(--card)"
                    strokeWidth={2}
                  >
                    {salesData.channels.map((_, i) => (
                      <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v) => fmt(Number(v))} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            {/* Custom legend with percentages — readable and no overflow */}
            <ul className="sm:col-span-2 space-y-2.5">
              {salesData.channels.map((c, i) => {
                const pct = (c.revenue / channelTotal) * 100;
                return (
                  <li key={c.name} className="flex items-center gap-2.5">
                    <span
                      className="w-3 h-3 rounded-sm flex-shrink-0"
                      style={{ background: CHART_COLORS[i % CHART_COLORS.length] }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground leading-tight truncate">{c.name}</p>
                      <p className="text-xs text-muted-foreground">{fmt(c.revenue)} · {pct.toFixed(1)}%</p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {/* Units sold by product */}
        <div className="bg-card text-card-foreground rounded-xl border border-border p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-foreground mb-4">Units Sold by Product</h2>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={salesData.products} layout="vertical" margin={{ left: 10, right: 20 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--border)" />
              <XAxis type="number" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} />
              <YAxis
                dataKey="name"
                type="category"
                tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                width={140}
              />
              <Tooltip />
              <Bar dataKey="units" fill="var(--chart-1)" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Hourly today + 14-day trend */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-card text-card-foreground rounded-xl border border-border p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-foreground mb-4">Revenue by Hour — Today</h2>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={salesData.hourlyToday}>
              <defs>
                <linearGradient id="hourGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--chart-1)" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="hour" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} />
              <YAxis tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} tickFormatter={(v) => `$${v}`} />
              <Tooltip formatter={(v) => fmt(Number(v))} />
              <Area type="monotone" dataKey="revenue" stroke="var(--chart-1)" strokeWidth={2.5} fill="url(#hourGradient)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card text-card-foreground rounded-xl border border-border p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-foreground mb-4">14-Day Revenue Trend</h2>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={salesData.weeklyTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} />
              <YAxis tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} tickFormatter={(v) => `$${v.toLocaleString()}`} />
              <Tooltip formatter={(v) => fmt(Number(v))} />
              <Line type="monotone" dataKey="revenue" stroke="var(--chart-1)" strokeWidth={2.5} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Product table */}
      <div className="bg-card text-card-foreground rounded-xl border border-border shadow-sm overflow-hidden mb-6">
        <div className="px-6 py-4 border-b border-border">
          <h2 className="text-sm font-semibold text-foreground">Best-Selling Products — Today</h2>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted/40 text-xs font-semibold text-muted-foreground">
              <th className="px-5 py-3 text-left">Product</th>
              <th className="px-5 py-3 text-right">Units</th>
              <th className="px-5 py-3 text-right">Price</th>
              <th className="px-5 py-3 text-right">Revenue</th>
              <th className="px-5 py-3 text-right">Margin</th>
            </tr>
          </thead>
          <tbody>
            {salesData.products.map((p) => (
              <tr key={p.name} className="border-b border-border last:border-b-0 hover:bg-muted/30 transition-colors">
                <td className="px-5 py-3.5 font-medium text-foreground">{p.name}</td>
                <td className="px-5 py-3.5 text-right text-foreground tabular-nums">{p.units}</td>
                <td className="px-5 py-3.5 text-right text-foreground tabular-nums">${p.price}</td>
                <td className="px-5 py-3.5 text-right font-semibold text-foreground tabular-nums">${p.revenue.toLocaleString()}</td>
                <td className="px-5 py-3.5 text-right text-green-700 dark:text-green-400 font-medium tabular-nums">{(p.margin * 100).toFixed(1)}%</td>
              </tr>
            ))}
            <tr className="bg-foreground text-background">
              <td className="px-5 py-3.5 font-semibold">Total</td>
              <td className="px-5 py-3.5 text-right font-semibold tabular-nums">92</td>
              <td className="px-5 py-3.5 text-right"></td>
              <td className="px-5 py-3.5 text-right font-semibold tabular-nums">$3,490</td>
              <td className="px-5 py-3.5 text-right"></td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Referrers + Top Customers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-card text-card-foreground rounded-xl border border-border shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-border">
            <h2 className="text-sm font-semibold text-foreground">Top Traffic Sources — Today</h2>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/40 text-xs font-semibold text-muted-foreground">
                <th className="px-5 py-3 text-left">Source</th>
                <th className="px-5 py-3 text-right">Sessions</th>
                <th className="px-5 py-3 text-right">Orders</th>
                <th className="px-5 py-3 text-right">Revenue</th>
              </tr>
            </thead>
            <tbody>
              {salesData.topReferrers.map((r) => (
                <tr key={r.source} className="border-b border-border last:border-b-0 hover:bg-muted/30 transition-colors">
                  <td className="px-5 py-3 font-medium text-foreground">{r.source}</td>
                  <td className="px-5 py-3 text-right tabular-nums">{r.sessions.toLocaleString()}</td>
                  <td className="px-5 py-3 text-right tabular-nums">{r.orders}</td>
                  <td className="px-5 py-3 text-right font-semibold tabular-nums">{fmt(r.revenue)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-card text-card-foreground rounded-xl border border-border shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-border">
            <h2 className="text-sm font-semibold text-foreground">Top Customers — Lifetime Value</h2>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/40 text-xs font-semibold text-muted-foreground">
                <th className="px-5 py-3 text-left">Customer</th>
                <th className="px-5 py-3 text-right">Orders</th>
                <th className="px-5 py-3 text-right">LTV</th>
                <th className="px-5 py-3 text-right">Last Purchase</th>
              </tr>
            </thead>
            <tbody>
              {salesData.topCustomers.map((c) => (
                <tr key={c.name} className="border-b border-border last:border-b-0 hover:bg-muted/30 transition-colors">
                  <td className="px-5 py-3 font-medium text-foreground">{c.name}</td>
                  <td className="px-5 py-3 text-right tabular-nums">{c.orders}</td>
                  <td className="px-5 py-3 text-right font-semibold tabular-nums">{fmt(c.lifetimeValue)}</td>
                  <td className="px-5 py-3 text-right text-muted-foreground tabular-nums">{c.lastPurchase}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* AI insights */}
      <AIInsightBox title="AI Sales Insights">
        <ul className="space-y-2">
          {salesData.insights.map((insight, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="text-blue-500 mt-0.5">•</span>
              <span>{insight}</span>
            </li>
          ))}
        </ul>
      </AIInsightBox>

      <p className="text-xs text-muted-foreground mt-10 text-center">
        All data is simulated for portfolio demonstration purposes.
      </p>
    </div>
  );
}
