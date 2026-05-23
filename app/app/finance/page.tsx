"use client";

import { PageHeader } from "@/components/PageHeader";
import { MetricCard } from "@/components/MetricCard";
import { AIInsightBox } from "@/components/AIInsightBox";
import finData from "@/data/finance.json";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { AlertTriangle } from "lucide-react";

const fmt = (v: number) => (v < 0 ? `-$${Math.abs(v).toLocaleString()}` : `$${v.toLocaleString()}`);

const pnlRows = [
  { label: "Gross Sales", value: finData.pnl.grossSales, bold: false, indent: false },
  { label: "Refunds", value: finData.pnl.refunds, bold: false, indent: true },
  { label: "Net Sales", value: finData.pnl.netSales, bold: true, indent: false },
  { label: "Cost of Goods Sold", value: finData.pnl.cogs, bold: false, indent: true },
  { label: "Gross Profit", value: finData.pnl.grossProfit, bold: true, indent: false },
  { label: "Ad Spend", value: finData.pnl.adSpend, bold: false, indent: true },
  { label: "Shipping Costs", value: finData.pnl.shippingCosts, bold: false, indent: true },
  { label: "Contractor Costs", value: finData.pnl.contractorCosts, bold: false, indent: true },
  { label: "Software Costs", value: finData.pnl.softwareCosts, bold: false, indent: true },
  { label: "Operating Profit", value: finData.pnl.operatingProfit, bold: true, indent: false },
];

const costData = [
  { name: "Ad Spend", value: 620 },
  { name: "Shipping", value: 310 },
  { name: "Contractors", value: 450 },
  { name: "Software", value: 95 },
  { name: "COGS", value: 1415 },
];

export default function FinancePage() {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <PageHeader
        title="Finance Dashboard"
        subtitle="Daily P&L snapshot, cash tracker, AI warnings, and cost-saving actions"
        badge={finData.date}
      />

      {/* Key metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <MetricCard label="Gross Sales" value="$3,490" status="healthy" />
        <MetricCard label="Gross Profit" value="$1,927" trend="57.7% margin" status="healthy" />
        <MetricCard label="Operating Profit" value="$452" status="healthy" />
        <MetricCard label="Cash Balance" value="$18,420" trend="6.7 mo. runway" status="healthy" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* P&L table */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <h2 className="text-sm font-semibold text-gray-700">Profit & Loss — Today</h2>
          </div>
          <table className="w-full text-sm">
            <tbody>
              {pnlRows.map((row, i) => (
                <tr
                  key={row.label}
                  className={
                    row.bold
                      ? "bg-gray-900 text-white"
                      : i % 2 === 0
                      ? "bg-white"
                      : "bg-gray-50"
                  }
                >
                  <td className={`px-4 py-2.5 ${row.indent ? "pl-8" : ""} ${row.bold ? "font-semibold" : "text-gray-600"}`}>
                    {row.label}
                  </td>
                  <td
                    className={`px-4 py-2.5 text-right font-semibold ${
                      row.bold
                        ? row.value > 0
                          ? "text-green-400"
                          : "text-red-400"
                        : row.value < 0
                        ? "text-red-600"
                        : "text-gray-900"
                    }`}
                  >
                    {fmt(row.value)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Cost breakdown chart */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">Cost Breakdown</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={costData} layout="vertical" margin={{ left: 10, right: 40 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11 }} tickFormatter={(v) => `$${v}`} />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} width={90} />
              <Tooltip formatter={(v) => [`$${Number(v).toLocaleString()}`, "Cost"]} />
              <Bar dataKey="value" fill="#ef4444" radius={[0, 4, 4, 0]} label={{ position: "right", fontSize: 11, formatter: (v: unknown) => `$${v}` }} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Cash tracker */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-6">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-700">Cash Tracker</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-0 divide-x divide-gray-100">
          {[
            ["Cash Balance", `$${finData.cashTracker.cashBalance.toLocaleString()}`, "text-green-700"],
            ["Monthly Burn", `$${finData.cashTracker.avgMonthlyNetBurn.toLocaleString()}`, "text-amber-700"],
            ["Runway", `${finData.cashTracker.estimatedRunwayMonths} months`, "text-blue-700"],
            ["AP Due This Week", `$${finData.cashTracker.accountsPayableThisWeek.toLocaleString()}`, "text-red-700"],
            ["Expected Cash In", `$${finData.cashTracker.expectedIncomingCashThisWeek.toLocaleString()}`, "text-green-700"],
            ["Hoodie Reorder Cost", `$${finData.cashTracker.proposedHoodieReorderCost.toLocaleString()}`, "text-amber-700"],
          ].map(([label, value, color]) => (
            <div key={label} className="px-5 py-4">
              <p className="text-xs text-gray-500 mb-1">{label}</p>
              <p className={`text-xl font-bold ${color}`}>{value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* AI warnings */}
      <AIInsightBox title="AI Financial Warnings" variant="warning" className="mb-6">
        <ul className="space-y-1.5">
          {finData.warnings.map((w, i) => (
            <li key={i} className="flex items-start gap-2">
              <AlertTriangle size={13} className="text-amber-500 mt-0.5 flex-shrink-0" />
              <span>{w}</span>
            </li>
          ))}
        </ul>
      </AIInsightBox>

      {/* Cost-saving actions */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-700">Recommended Cost-Saving Actions</h2>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wide">
              <th className="px-4 py-3 text-left">Action</th>
              <th className="px-4 py-3 text-right">Est. Weekly Impact</th>
            </tr>
          </thead>
          <tbody>
            {finData.costSavingActions.map((a, i) => (
              <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                <td className="px-4 py-3 text-gray-800">→ {a.action}</td>
                <td className="px-4 py-3 text-right font-semibold text-green-700">+${a.estimatedWeeklyImpact}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-gray-400 mt-8 text-center">
        All data is simulated for portfolio demonstration purposes.
      </p>
    </div>
  );
}
