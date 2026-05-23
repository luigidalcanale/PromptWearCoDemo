"use client";

import { PageHeader } from "@/components/PageHeader";
import { MetricCard } from "@/components/MetricCard";
import { AIInsightBox } from "@/components/AIInsightBox";
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
  Legend,
  LineChart,
  Line,
} from "recharts";

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

const fmt = (v: number) => `$${v.toLocaleString()}`;

export default function SalesDashboardPage() {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <PageHeader
        title="Sales Dashboard"
        subtitle={`PromptWear Co. · ${salesData.date}`}
        badge="Today's Report"
      />

      {/* Key metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        <MetricCard label="Gross Sales" value="$3,490" trend="+18% vs. yesterday" status="healthy" />
        <MetricCard label="Net Sales" value="$3,342" trend="After $148 refunds" status="healthy" />
        <MetricCard label="Orders" value="92" trend="Strong day" status="healthy" />
        <MetricCard label="Conversion Rate" value="1.9%" trend="Below 2.2% goal" status="warning" />
        <MetricCard label="Avg Order Value" value="$37.93" trend="Stable" status="healthy" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Revenue by channel */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">Revenue by Channel</h2>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={salesData.channels}
                dataKey="revenue"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                labelLine={false}
              >
                {salesData.channels.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(v) => fmt(Number(v))} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Units sold by product */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">Units Sold by Product</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={salesData.products} layout="vertical" margin={{ left: 10, right: 20 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11 }} />
              <YAxis
                dataKey="name"
                type="category"
                tick={{ fontSize: 10 }}
                width={130}
              />
              <Tooltip />
              <Bar dataKey="units" fill="#3b82f6" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 7-day revenue trend */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm mb-6">
        <h2 className="text-sm font-semibold text-gray-700 mb-4">7-Day Revenue Trend</h2>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={salesData.weeklyTrend}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `$${v.toLocaleString()}`} />
            <Tooltip formatter={(v) => fmt(Number(v))} />
            <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Product table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-6">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-700">Best-Selling Products — Today</h2>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wide">
              <th className="px-4 py-3 text-left">Product</th>
              <th className="px-4 py-3 text-right">Units</th>
              <th className="px-4 py-3 text-right">Price</th>
              <th className="px-4 py-3 text-right">Revenue</th>
              <th className="px-4 py-3 text-right">Margin</th>
            </tr>
          </thead>
          <tbody>
            {salesData.products.map((p, i) => (
              <tr key={p.name} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                <td className="px-4 py-3 font-medium text-gray-900">{p.name}</td>
                <td className="px-4 py-3 text-right text-gray-700">{p.units}</td>
                <td className="px-4 py-3 text-right text-gray-700">${p.price}</td>
                <td className="px-4 py-3 text-right font-semibold text-gray-900">${p.revenue.toLocaleString()}</td>
                <td className="px-4 py-3 text-right text-green-700 font-medium">{(p.margin * 100).toFixed(1)}%</td>
              </tr>
            ))}
            <tr className="bg-gray-900 text-white">
              <td className="px-4 py-3 font-semibold">Total</td>
              <td className="px-4 py-3 text-right font-semibold">92</td>
              <td className="px-4 py-3 text-right"></td>
              <td className="px-4 py-3 text-right font-semibold">$3,490</td>
              <td className="px-4 py-3 text-right"></td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* AI insights */}
      <AIInsightBox title="AI Sales Insights">
        <ul className="space-y-1.5">
          {salesData.insights.map((insight, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="text-blue-500 mt-0.5">•</span>
              <span>{insight}</span>
            </li>
          ))}
        </ul>
      </AIInsightBox>

      <p className="text-xs text-gray-400 mt-8 text-center">
        All data is simulated for portfolio demonstration purposes.
      </p>
    </div>
  );
}
