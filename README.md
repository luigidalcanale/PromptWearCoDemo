# AI Business Command Center

A polished portfolio dashboard showing how AI could support the daily operations of a small online apparel company. The fictional company is **PromptWear Co.**, an AI-themed apparel brand.

## Problem

Small business owners manage sales, inventory, marketing, emails, customer service, suppliers, and finances across disconnected tools. It is hard to know what needs attention first.

## Solution

This dashboard shows how AI can summarize information, draft responses, forecast demand, flag risks, and recommend decisions — all in one operating snapshot of a single business day.

## Features

- **CEO Home Dashboard** — daily summary, priorities, risk alerts, key metrics
- **AI Email Command Center** — urgency filtering, summaries, AI-drafted replies
- **Sales Dashboard** — channel mix, product performance, 7-day trend charts
- **Sales Forecasting** — 7-day revenue forecast and product demand risk
- **Inventory & Supplier Dashboard** — reorder alerts, supplier scorecards, suggested POs
- **Marketing Dashboard** — campaign ROAS, A/B tests, segments, AI content ideas
- **Customer Service Center** — ticket clustering, draft responses, CSAT metrics
- **Meeting Notes & Translation Hub** — AI summary, action items, Spanish translation, follow-up email
- **Finance Dashboard** — P&L, cash tracker, AI warnings, cost-saving actions
- **AI Automation Map** — manual vs. AI workflow comparison and time savings
- **Decision Log** — AI recommendation vs. human decision, expandable
- **Portfolio Case Study** — project explanation, disclaimer, future roadmap

## Tech Stack

- [Next.js 16](https://nextjs.org/) with App Router
- [React 19](https://react.dev/)
- [Tailwind CSS 4](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/) components
- [Recharts](https://recharts.org/) for data visualization
- [Lucide React](https://lucide.dev/) icons
- Static JSON data (no backend in v1)
- Deployed on [Vercel](https://vercel.com/)

## Running Locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the dashboard.

## Data Disclaimer

All business data in this project is **simulated for portfolio demonstration purposes**. PromptWear Co. is a fictional business. The numbers, emails, customers, suppliers, and meetings are not real.

## Future Improvements

- Connect Shopify API for live sales data
- Connect Gmail API for real email ingestion
- Add OpenAI API for live AI-generated summaries and drafts
- Add Supabase for persistent storage and authentication
- Add Stripe API for real payments and dispute data
