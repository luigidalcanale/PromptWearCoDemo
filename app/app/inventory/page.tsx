import { PageHeader } from "@/components/PageHeader";
import { AIInsightBox } from "@/components/AIInsightBox";
import { StatusBadge, riskToVariant } from "@/components/StatusBadge";
import invData from "@/data/inventory.json";
import { AlertTriangle, Package, Truck } from "lucide-react";

export default function InventoryPage() {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <PageHeader
        title="Inventory & Supplier Dashboard"
        subtitle="Current stock levels, reorder alerts, supplier scorecards, and purchase order suggestions"
        badge="2 Alerts"
      />

      <AIInsightBox title="AI Recommendation" variant="warning" className="mb-6">
        {invData.aiRecommendation}
      </AIInsightBox>

      {/* Inventory table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-6">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
          <Package size={16} className="text-blue-500" />
          <h2 className="text-sm font-semibold text-gray-700">Current Inventory Status</h2>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wide">
              <th className="px-4 py-3 text-left">Product</th>
              <th className="px-4 py-3 text-right">In Stock</th>
              <th className="px-4 py-3 text-right">Reorder Point</th>
              <th className="px-4 py-3 text-right">7-Day Demand</th>
              <th className="px-4 py-3 text-center">Status</th>
              <th className="px-4 py-3 text-center">Risk</th>
            </tr>
          </thead>
          <tbody>
            {invData.products.map((p, i) => (
              <tr key={p.product} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                <td className="px-4 py-3 font-medium text-gray-900 flex items-center gap-2">
                  {p.risk === "high" && <AlertTriangle size={13} className="text-red-500 flex-shrink-0" />}
                  {p.product}
                </td>
                <td className={`px-4 py-3 text-right font-semibold ${p.risk === "high" ? "text-red-700" : "text-gray-900"}`}>
                  {p.inStock}
                </td>
                <td className="px-4 py-3 text-right text-gray-600">{p.reorderPoint}</td>
                <td className="px-4 py-3 text-right text-gray-700">{p.forecastDemand7Days}</td>
                <td className="px-4 py-3 text-center">
                  <StatusBadge label={p.status} variant={riskToVariant(p.status)} />
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

      {/* Supplier scorecards */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Truck size={16} className="text-blue-500" />
          <h2 className="text-sm font-semibold text-gray-700">Supplier Scorecards</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {invData.suppliers.map((s) => (
            <div key={s.name} className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-semibold text-gray-900">{s.name}</p>
                <StatusBadge label={s.risk.charAt(0).toUpperCase() + s.risk.slice(1)} variant={riskToVariant(s.risk)} />
              </div>
              <p className="text-xs text-gray-500 mb-3">{s.products}</p>
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Lead Time</span>
                  <span className="font-medium text-gray-800">{s.leadTimeDays} days</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Quality Score</span>
                  <span className={`font-medium ${s.qualityScore >= 90 ? "text-green-700" : "text-amber-700"}`}>{s.qualityScore}%</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">On-Time Rate</span>
                  <span className={`font-medium ${s.onTimeRate >= 90 ? "text-green-700" : "text-amber-700"}`}>{s.onTimeRate}%</span>
                </div>
              </div>
              {s.note && (
                <p className="text-xs text-gray-400 mt-2 pt-2 border-t border-gray-100">{s.note}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Purchase orders */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-700">Suggested Purchase Orders</h2>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wide">
              <th className="px-4 py-3 text-left">Product</th>
              <th className="px-4 py-3 text-right">Units</th>
              <th className="px-4 py-3 text-left">Supplier</th>
              <th className="px-4 py-3 text-right">Est. Cost</th>
              <th className="px-4 py-3 text-left">Reason</th>
              <th className="px-4 py-3 text-center">Priority</th>
            </tr>
          </thead>
          <tbody>
            {invData.purchaseOrders.map((po, i) => (
              <tr key={po.product} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                <td className="px-4 py-3 font-medium text-gray-900">{po.product}</td>
                <td className="px-4 py-3 text-right font-semibold text-gray-900">{po.suggestedUnits}</td>
                <td className="px-4 py-3 text-gray-700">{po.supplier}</td>
                <td className="px-4 py-3 text-right font-semibold text-gray-900">${po.estimatedCost.toLocaleString()}</td>
                <td className="px-4 py-3 text-gray-500 text-xs">{po.reason}</td>
                <td className="px-4 py-3 text-center">
                  <StatusBadge
                    label={po.urgency.charAt(0).toUpperCase() + po.urgency.slice(1)}
                    variant={riskToVariant(po.urgency)}
                  />
                </td>
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
