# AI Business Command Center

A portfolio dashboard showing how AI could support daily operations for a small online apparel company.

## Overview

This is a static-but-interactive portfolio demo representing one operating day inside **PromptWear Co.**, a fictional AI-themed apparel brand. It shows how AI can summarize information, draft responses, forecast demand, flag risks, and help managers make faster decisions — all from one dashboard.

## Problem

Small business owners manage emails, sales, inventory, marketing, customer service, suppliers, and finances across disconnected tools. This makes it hard to know what needs attention first.

## Solution

This dashboard shows how AI can summarize information, draft responses, forecast demand, flag risks, and recommend decisions across every area of a small business.

## Pages

| # | Page | What It Shows |
|---|------|---------------|
| 1 | CEO Home Dashboard | Daily summary, metrics, AI priorities, risk alerts |
| 2 | AI Email Command Center | Email urgency, AI summaries, draft replies |
| 3 | Sales Dashboard | Revenue, channels, products, trends |
| 4 | Sales Forecasting | 7-day revenue and product demand forecast |
| 5 | Inventory & Suppliers | Stock levels, reorder alerts, supplier scorecards |
| 6 | Marketing Dashboard | Campaign ROAS, A/B tests, customer segments |
| 7 | Customer Service Center | Ticket types, AI draft responses, CSAT metrics |
| 8 | Meeting Notes & Hub | AI summary, action items, translation, email draft |
| 9 | Finance Dashboard | P&L, cash tracker, AI warnings |
| 10 | AI Automation Map | Manual vs. AI workflow comparison |
| 11 | Decision Log | AI recommendation vs. human final call |
| 12 | Portfolio Case Study | Project overview, demo script, tech stack |

## Tech Stack

- **Next.js 16** — App Router, React 19
- **Tailwind CSS 4** — Utility-class styling
- **shadcn/ui** — Card, badge, table components
- **Recharts 3** — Dashboard charts
- **Lucide React** — Icons
- **Static JSON** — All data (no backend needed for V1)
- **Vercel** — Deployment

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Data Disclaimer

All business data in this project is simulated for demonstration purposes. PromptWear Co. is a fictional business. No real company, revenue, or customer data is represented.

## Future Improvements

- Connect Shopify API for real sales data
- Connect Gmail API for real email summaries
- Add OpenAI API for live AI-generated summaries and drafts
- Add Stripe API for real payment and dispute data
- Add Supabase for persistent database and authentication
- Add Google Analytics for real website traffic data
