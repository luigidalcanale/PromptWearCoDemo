import { PageHeader } from "@/components/PageHeader";
import { AIInsightBox } from "@/components/AIInsightBox";
import meetingData from "@/data/meetingNotes.json";
import { Users, CheckCircle, Globe, Mail } from "lucide-react";

export default function MeetingsPage() {
  return (
    <div className="p-6 max-w-5xl mx-auto">
      <PageHeader
        title="Meeting Notes & Translation Hub"
        subtitle="AI turns messy team meetings into summaries, action items, decisions, and follow-up drafts"
        badge={meetingData.date}
      />

      {/* Transcript */}
      <div className="bg-card rounded-xl border border-border shadow-sm p-5 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Users size={15} className="text-blue-500" />
          <h2 className="text-sm font-semibold text-foreground">Meeting Transcript Excerpt — {meetingData.title}</h2>
        </div>
        <div className="space-y-3">
          {meetingData.transcript.map((line, i) => (
            <div key={i} className="flex gap-3">
              <span className="text-xs font-semibold text-muted-foreground w-40 flex-shrink-0 pt-0.5">{line.speaker}:</span>
              <p className="text-sm text-foreground">&ldquo;{line.line}&rdquo;</p>
            </div>
          ))}
        </div>
      </div>

      {/* AI Summary */}
      <AIInsightBox title="AI Meeting Summary" className="mb-6">
        {meetingData.aiSummary}
      </AIInsightBox>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Action items */}
        <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-border flex items-center gap-2">
            <CheckCircle size={15} className="text-green-500" />
            <h2 className="text-sm font-semibold text-foreground">Action Items</h2>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/40 text-xs font-semibold text-muted-foreground">
                <th className="px-4 py-3 text-left">Owner</th>
                <th className="px-4 py-3 text-left">Action</th>
                <th className="px-4 py-3 text-center">Deadline</th>
              </tr>
            </thead>
            <tbody>
              {meetingData.actionItems.map((item, i) => (
                <tr key={i} className="border-b border-border last:border-b-0 hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-2.5 text-xs font-semibold text-blue-700">{item.owner}</td>
                  <td className="px-4 py-2.5 text-foreground">{item.action}</td>
                  <td className="px-4 py-2.5 text-center">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${item.deadline === "Today" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"}`}>
                      {item.deadline}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Decisions */}
        <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-border">
            <h2 className="text-sm font-semibold text-foreground">Decisions Made</h2>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/40 text-xs font-semibold text-muted-foreground">
                <th className="px-4 py-3 text-left">Decision</th>
                <th className="px-4 py-3 text-left">Reason</th>
              </tr>
            </thead>
            <tbody>
              {meetingData.decisions.map((d, i) => (
                <tr key={i} className="border-b border-border last:border-b-0 hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-2.5 font-semibold text-foreground">âœ“ {d.decision}</td>
                  <td className="px-4 py-2.5 text-muted-foreground text-xs">{d.reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Spanish translation */}
      <div className="bg-card rounded-xl border border-border shadow-sm p-5 mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Globe size={15} className="text-blue-500" />
          <h2 className="text-sm font-semibold text-foreground">{meetingData.spanishTranslation.label}</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <p className="text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wide">Original (English)</p>
            <p className="text-sm text-foreground bg-muted/30 rounded-lg p-3">{meetingData.spanishTranslation.original}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-blue-500 mb-1 uppercase tracking-wide">AI Translation (Spanish)</p>
            <p className="text-sm text-foreground bg-blue-50 rounded-lg p-3 italic">{meetingData.spanishTranslation.translated}</p>
          </div>
        </div>
      </div>

      {/* Follow-up email */}
      <div className="bg-card rounded-xl border border-border shadow-sm p-5">
        <div className="flex items-center gap-2 mb-3">
          <Mail size={15} className="text-blue-500" />
          <h2 className="text-sm font-semibold text-foreground">AI Follow-Up Email Draft</h2>
        </div>
        <p className="text-xs text-muted-foreground mb-1"><strong>Subject:</strong> {meetingData.followUpEmail.subject}</p>
        <p className="text-sm text-foreground bg-blue-50 rounded-lg p-3 italic">&ldquo;{meetingData.followUpEmail.body}&rdquo;</p>
        <p className="text-xs text-blue-600 mt-2 font-medium">Review and send to attendees.</p>
      </div>

      <p className="text-xs text-muted-foreground mt-8 text-center">
        All data is simulated for portfolio demonstration purposes.
      </p>
    </div>
  );
}
