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
      <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden mb-6">
        <div className="px-5 py-4 border-b border-border flex items-center gap-2">
          <Package size={16} className="text-blue-500" />
          <h2 className="text-sm font-semibold text-foreground">Current Inventory Status</h2>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted/40 text-xs font-semibold text-muted-foreground">
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
              <tr key={p.product} className="border-b border-border last:border-b-0 hover:bg-muted/30 transition-colors">
                <td className="px-4 py-3 font-medium text-foreground flex items-center gap-2">
                  {p.risk === "high" && <AlertTriangle size={13} className="text-red-500 flex-shrink-0" />}
                  {p.product}
                </td>
                <td className={`px-4 py-3 text-right font-semibold ${p.risk === "high" ? "text-red-700" : "text-foreground"}`}>
                  {p.inStock}
                </td>
                <td className="px-4 py-3 text-right text-muted-foreground">{p.reorderPoint}</td>
                <td className="px-4 py-3 text-right text-foreground">{p.forecastDemand7Days}</td>
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
          <h2 className="text-sm font-semibold text-foreground">Supplier Scorecards</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {invData.suppliers.map((s) => (
            <div key={s.name} className="bg-card rounded-xl border border-border p-4 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-semibold text-foreground">{s.name}</p>
                <StatusBadge label={s.risk.charAt(0).toUpperCase() + s.risk.slice(1)} variant={riskToVariant(s.risk)} />
              </div>
              <p className="text-xs text-muted-foreground mb-3">{s.products}</p>
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Lead Time</span>
                  <span className="font-medium text-foreground">{s.leadTimeDays} days</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Quality Score</span>
                  <span className={`font-medium ${s.qualityScore >= 90 ? "text-green-700" : "text-amber-700"}`}>{s.qualityScore}%</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">On-Time Rate</span>
                  <span className={`font-medium ${s.onTimeRate >= 90 ? "text-green-700" : "text-amber-700"}`}>{s.onTimeRate}%</span>
                </div>
              </div>
              {s.note && (
                <p className="text-xs text-muted-foreground mt-2 pt-2 border-t border-border">{s.note}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Purchase orders */}
      <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-border">
          <h2 className="text-sm font-semibold text-foreground">Suggested Purchase Orders</h2>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted/40 text-xs font-semibold text-muted-foreground">
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
              <tr key={po.product} className="border-b border-border last:border-b-0 hover:bg-muted/30 transition-colors">
                <td className="px-4 py-3 font-medium text-foreground">{po.product}</td>
                <td className="px-4 py-3 text-right font-semibold text-foreground">{po.suggestedUnits}</td>
                <td className="px-4 py-3 text-foreground">{po.supplier}</td>
                <td className="px-4 py-3 text-right font-semibold text-foreground">${po.estimatedCost.toLocaleString()}</td>
                <td className="px-4 py-3 text-muted-foreground text-xs">{po.reason}</td>
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

      <p className="text-xs text-muted-foreground mt-8 text-center">
        All data is simulated for portfolio demonstration purposes.
      </p>
    </div>
  );
}
