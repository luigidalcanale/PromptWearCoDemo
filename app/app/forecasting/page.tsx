"use client";

import { PageHeader } from "@/components/PageHeader";
import { AIInsightBox } from "@/components/AIInsightBox";
import { StatusBadge } from "@/components/StatusBadge";
import { riskToVariant } from "@/components/StatusBadge";
import forecastData from "@/data/forecast.json";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";

export default function ForecastingPage() {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <PageHeader
        title="Sales Forecasting"
        subtitle="7-day revenue and product demand forecast — AI-powered"
        badge="7-Day Outlook"
      />

      {/* 7-day revenue forecast chart */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm mb-6">
        <h2 className="text-sm font-semibold text-gray-700 mb-4">7-Day Revenue Forecast</h2>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={forecastData.weeklyRevenue}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `$${v.toLocaleString()}`} domain={[2800, 3800]} />
            <Tooltip formatter={(v) => [`$${Number(v).toLocaleString()}`, "Forecast Revenue"]} />
            <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} strokeDasharray="5 5" dot={{ r: 4, fill: "#3b82f6" }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Orders forecast chart */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm mb-6">
        <h2 className="text-sm font-semibold text-gray-700 mb-4">7-Day Orders Forecast</h2>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={forecastData.weeklyRevenue}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} domain={[70, 110]} />
            <Tooltip />
            <Bar dataKey="orders" fill="#10b981" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Forecast table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-6">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-700">Revenue Forecast by Date</h2>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wide">
              <th className="px-4 py-3 text-left">Date</th>
              <th className="px-4 py-3 text-right">Forecast Revenue</th>
              <th className="px-4 py-3 text-right">Forecast Orders</th>
            </tr>
          </thead>
          <tbody>
            {forecastData.weeklyRevenue.map((row, i) => (
              <tr key={row.date} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                <td className="px-4 py-3 font-medium text-gray-900">{row.date}</td>
                <td className="px-4 py-3 text-right text-gray-900 font-semibold">${row.revenue.toLocaleString()}</td>
                <td className="px-4 py-3 text-right text-gray-700">{row.orders}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Product demand forecast */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-6">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-700">Product-Level Demand Forecast</h2>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wide">
              <th className="px-4 py-3 text-left">Product</th>
              <th className="px-4 py-3 text-right">Current Inventory</th>
              <th className="px-4 py-3 text-right">7-Day Demand</th>
              <th className="px-4 py-3 text-right">Days Left</th>
              <th className="px-4 py-3 text-center">Risk</th>
            </tr>
          </thead>
          <tbody>
            {forecastData.productDemand.map((p, i) => (
              <tr key={p.product} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                <td className="px-4 py-3 font-medium text-gray-900">
                  <div>{p.product}</div>
                  <div className="text-xs text-gray-400 font-normal mt-0.5">{p.formulaNote}</div>
                </td>
                <td className="px-4 py-3 text-right text-gray-700">{p.currentInventory}</td>
                <td className="px-4 py-3 text-right font-semibold text-gray-900">{p.forecastDemand7Days}</td>
                <td className={`px-4 py-3 text-right font-semibold ${p.estimatedDaysLeft <= 5 ? "text-red-700" : p.estimatedDaysLeft <= 10 ? "text-amber-700" : "text-green-700"}`}>
                  {p.estimatedDaysLeft} days
                </td>
                <td className="px-4 py-3 text-center">
                  <StatusBadge
                    label={p.risk.charAt(0).toUpperCase() + p.risk.slice(1)}
                    variant={riskToVariant(p.risk)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AIInsightBox title="AI Forecast Explanation" variant="warning">
        {forecastData.explanation}
      </AIInsightBox>

      <p className="text-xs text-gray-400 mt-8 text-center">
        All forecast data is simulated for portfolio demonstration purposes.
      </p>
    </div>
  );
}
