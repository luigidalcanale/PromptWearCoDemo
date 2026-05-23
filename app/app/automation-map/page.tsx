import { PageHeader } from "@/components/PageHeader";
import { AIInsightBox } from "@/components/AIInsightBox";
import autoData from "@/data/automationMap.json";
import { Zap, Clock } from "lucide-react";

const totalTimeSaved = autoData.reduce((sum, row) => {
  const match = row.timeSavedPerDay.match(/\d+/);
  return sum + (match ? parseInt(match[0]) : 0);
}, 0);

export default function AutomationMapPage() {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <PageHeader
        title="AI Automation Map"
        subtitle="How AI compresses manual workflows — time saved, business value created"
        badge={`~${totalTimeSaved} min saved/day`}
      />

      <AIInsightBox title="AI Demonstration" className="mb-6">
        This page shows exactly where AI creates time savings and business value. AI is not just generating text — it is helping with workflow compression, faster decisions, and better operating speed across every area of the business.
      </AIInsightBox>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Workflows Automated", value: "8", icon: Zap },
          { label: "Time Saved Per Day", value: `~${totalTimeSaved} min`, icon: Clock },
          { label: "Time Saved Per Week", value: `~${Math.round(totalTimeSaved * 5 / 60)} hrs`, icon: Clock },
          { label: "Areas Covered", value: "All Ops", icon: Zap },
        ].map(({ label, value, icon: Icon }) => (
          <div key={label} className="bg-card rounded-xl border border-border p-4 shadow-sm text-center">
            <Icon size={20} className="text-blue-500 mx-auto mb-2" />
            <p className="text-xl font-bold text-foreground">{value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Automation table */}
      <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-border">
          <h2 className="text-sm font-semibold text-foreground">Manual vs. AI-Assisted Workflows</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/40 text-xs font-semibold text-muted-foreground">
                <th className="px-4 py-3 text-left">Business Task</th>
                <th className="px-4 py-3 text-left">Manual Workflow</th>
                <th className="px-4 py-3 text-left">AI-Assisted Workflow</th>
                <th className="px-4 py-3 text-right whitespace-nowrap">Time Saved</th>
                <th className="px-4 py-3 text-left">Business Value</th>
              </tr>
            </thead>
            <tbody>
              {autoData.map((row, i) => (
                <tr key={row.task} className="border-b border-border last:border-b-0 hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 font-semibold text-foreground whitespace-nowrap">{row.task}</td>
                  <td className="px-4 py-3 text-muted-foreground text-xs max-w-xs">{row.manualWorkflow}</td>
                  <td className="px-4 py-3 text-blue-800 text-xs max-w-xs bg-blue-50/30">{row.aiWorkflow}</td>
                  <td className="px-4 py-3 text-right font-semibold text-green-700 whitespace-nowrap">{row.timeSavedPerDay}</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{row.businessValue}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Future tools */}
      <div className="mt-6 bg-card rounded-xl border border-border shadow-sm p-5">
        <h2 className="text-sm font-semibold text-foreground mb-3">Potential Future Integrations</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {[
            { tool: "OpenAI API", use: "Live AI summaries and drafts" },
            { tool: "Gmail API", use: "Real email ingestion" },
            { tool: "Shopify API", use: "Real sales data" },
            { tool: "Stripe API", use: "Real payments and disputes" },
            { tool: "Meta Ads API", use: "Real marketing data" },
            { tool: "Google Analytics", use: "Real website traffic" },
            { tool: "Supabase", use: "Persistent database and auth" },
            { tool: "Vercel", use: "Production hosting" },
          ].map(({ tool, use }) => (
            <div key={tool} className="border border-border rounded-lg p-3 bg-muted/30">
              <p className="text-xs font-semibold text-foreground">{tool}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{use}</p>
            </div>
          ))}
        </div>
      </div>

      <p className="text-xs text-muted-foreground mt-8 text-center">
        All data is simulated for portfolio demonstration purposes.
      </p>
    </div>
  );
}
