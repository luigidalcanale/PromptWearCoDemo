import { PageHeader } from "@/components/PageHeader";
import { AIInsightBox } from "@/components/AIInsightBox";
import { CheckCircle, ArrowRight } from "lucide-react";

const features = [
  "CEO daily summary with AI-ranked priorities",
  "AI email assistant — urgency, impact, and draft replies",
  "Sales dashboard with channel and product analysis",
  "7-day revenue and product demand forecasting",
  "Inventory alerts and reorder point tracking",
  "Supplier scorecards and purchase order suggestions",
  "Marketing campaign analysis with ROAS and A/B results",
  "Customer service tickets with AI draft responses",
  "Meeting summaries with action items and decisions",
  "Spanish supplier translation support",
  "Finance dashboard with P&L and cash runway",
  "AI Automation Map — manual vs. AI workflow comparison",
  "Decision log — AI recommendation vs. human final call",
];

const techStack = [
  { tool: "Next.js 16", why: "React framework with App Router" },
  { tool: "Tailwind CSS 4", why: "Fast utility-class styling" },
  { tool: "shadcn/ui", why: "Clean, customizable components" },
  { tool: "Recharts", why: "React-native chart components" },
  { tool: "Static JSON data", why: "No backend needed for V1" },
  { tool: "Lucide React", why: "Clean dashboard icons" },
  { tool: "Vercel", why: "Zero-config deployment" },
];

const futureRoadmap = [
  { item: "Shopify API", description: "Connect real sales and order data" },
  { item: "Gmail API", description: "Summarize real incoming emails" },
  { item: "Stripe API", description: "Real payment and dispute data" },
  { item: "Google Analytics", description: "Real website traffic insights" },
  { item: "OpenAI API", description: "Generate live summaries and draft replies" },
  { item: "Supabase", description: "Persistent database, auth, saved decisions" },
];

export default function CaseStudyPage() {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <PageHeader
        title="Portfolio Case Study"
        subtitle="What this project is, what it demonstrates, and how it was built"
        badge="Portfolio"
      />

      {/* Overview */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Project Overview</h2>
        <p className="text-sm text-gray-700 leading-relaxed mb-4">
          AI Business Command Center is a portfolio demo showing how AI could support daily operations for a small online apparel company. The fictional business, PromptWear Co., sells AI-themed apparel and runs operations across sales, email, inventory, marketing, customer service, finance, and team meetings.
        </p>
        <p className="text-sm text-gray-700 leading-relaxed">
          The dashboard represents a single operating day — Thursday, May 21, 2026 — and shows how AI can turn scattered business information into clear priorities, draft responses, forecasts, warnings, and recommended decisions.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Problem */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <h2 className="text-base font-semibold text-gray-900 mb-3">Business Problem</h2>
          <p className="text-sm text-gray-700 leading-relaxed">
            Small business owners manage sales, inventory, marketing, emails, customer service, suppliers, and finances across disconnected tools. This makes it hard to know what needs attention first. Important signals get buried in noise. Decisions are delayed or missed.
          </p>
        </div>

        {/* Solution */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <h2 className="text-base font-semibold text-gray-900 mb-3">AI Solution</h2>
          <p className="text-sm text-gray-700 leading-relaxed">
            This dashboard uses simulated business data to show how AI can summarize information, flag risks, draft communications, forecast demand, recommend actions, and support executive decision-making — all in one place, every day.
          </p>
        </div>
      </div>

      {/* Features */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 mb-6">
        <h2 className="text-base font-semibold text-gray-900 mb-3">What This Project Includes</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
          {features.map((f, i) => (
            <div key={i} className="flex items-start gap-2 text-sm text-gray-700">
              <CheckCircle size={14} className="text-green-500 mt-0.5 flex-shrink-0" />
              <span>{f}</span>
            </div>
          ))}
        </div>
      </div>

      {/* What it demonstrates */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 mb-6">
        <h2 className="text-base font-semibold text-gray-900 mb-3">What This Demonstrates</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            "Business operations understanding",
            "AI workflow design",
            "Dashboard design",
            "Data storytelling",
            "Executive decision support",
            "Product thinking",
            "Frontend development",
            "Portfolio-ready communication",
          ].map((d) => (
            <div key={d} className="bg-blue-50 rounded-lg p-3 border border-blue-100 text-center">
              <p className="text-xs font-medium text-blue-800">{d}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tech stack */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-6">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-700">Tech Stack</h2>
        </div>
        <table className="w-full text-sm">
          <tbody>
            {techStack.map(({ tool, why }, i) => (
              <tr key={tool} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                <td className="px-4 py-2.5 font-semibold text-gray-900 w-40">{tool}</td>
                <td className="px-4 py-2.5 text-gray-600">{why}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 60-second demo script */}
      <AIInsightBox title="60-Second Demo Script" className="mb-6">
        <p className="italic text-sm leading-relaxed">
          &ldquo;This is my AI Business Command Center, a portfolio project showing what a CEO&apos;s daily operating system could look like if AI were integrated across a small online business. The fake company is PromptWear Co., an AI-themed apparel brand. The dashboard shows one operating day across sales, emails, inventory, marketing, customer service, finance, and meetings.
        </p>
        <p className="italic text-sm leading-relaxed mt-2">
          The CEO Home page summarizes the business day and gives recommended priorities. The Email Command Center shows how AI can summarize emails, classify urgency, estimate business impact, and draft replies. The Sales and Forecasting pages show how AI turns performance data into insights and inventory warnings.
        </p>
        <p className="italic text-sm leading-relaxed mt-2">
          The goal was not to build a live simulator. The goal was to create a polished, realistic snapshot that demonstrates how AI can support business operations and decision-making.&rdquo;
        </p>
      </AIInsightBox>

      {/* Future roadmap */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 mb-6">
        <h2 className="text-base font-semibold text-gray-900 mb-3">Future Roadmap</h2>
        <div className="space-y-2">
          {futureRoadmap.map(({ item, description }) => (
            <div key={item} className="flex items-center gap-3 text-sm">
              <ArrowRight size={14} className="text-blue-500 flex-shrink-0" />
              <span className="font-medium text-gray-900">{item}</span>
              <span className="text-gray-500">— {description}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Disclaimer */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-center">
        <p className="text-sm font-semibold text-amber-800 mb-1">Important Disclaimer</p>
        <p className="text-xs text-amber-700">
          All business data in this project is simulated for demonstration purposes. PromptWear Co. is a fictional business. This project is designed to show how an AI-powered business operations dashboard could work, not to represent a real company.
        </p>
      </div>
    </div>
  );
}
