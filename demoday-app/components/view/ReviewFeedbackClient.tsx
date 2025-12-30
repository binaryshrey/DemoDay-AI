"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  AlertCircle,
  CheckCircle2,
  HelpCircle,
  Lightbulb,
  MessageSquare,
  FileText,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

interface FeedbackData {
  overall_score: number;
  scores: {
    [key: string]: number;
  };
  top_strengths: string[];
  top_risks: string[];
  missing_info: string[];
  suggested_improvements: string[];
  rewritten_pitch: string;
  follow_up_questions: string[];
  tts_summary: string;
}

export function FeedbackDashboard({
  data,
  startupName,
  pitchId,
  reviewStatus,
  onMarkReviewCompleted,
  markingReview,
}: {
  data: FeedbackData;
  startupName?: string;
  pitchId?: string | null;
  reviewStatus?: string | null;
  onMarkReviewCompleted?: () => Promise<void> | void;
  markingReview?: boolean;
}) {
  const getScoreColor = (score: number) => {
    if (score >= 7) return "text-emerald-500";
    if (score >= 4) return "text-amber-500";
    return "text-rose-500";
  };

  const getProgressColor = (score: number) => {
    if (score >= 7) return "bg-emerald-500";
    if (score >= 4) return "bg-amber-500";
    return "bg-rose-500";
  };

  const getStrokeColor = (score: number) => {
    if (score >= 7) return "stroke-emerald-500";
    if (score >= 4) return "stroke-amber-500";
    return "stroke-rose-500";
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="px-4 pb-6">
        {/* Header */}
        <div className="mb-4">
          <div className="flex items-center gap-3 ">
            <h1 className="text-lg font-bold mb-2 text-balance">
              {startupName
                ? `${startupName} Pitch Analysis`
                : "Pitch Analysis Feedback"}
            </h1>

            {/* Status chip */}
            {reviewStatus ? (
              <button
                onClick={onMarkReviewCompleted}
                disabled={Boolean(markingReview)}
                className={`ml-2 rounded-full px-3 -mt-1.5 text-xs font-semibold cursor-pointer disabled:cursor-not-allowed transition-all disabled:opacity-60 focus:outline-none border ${
                  reviewStatus.toLowerCase().includes("completed")
                    ? "border-emerald-200 bg-emerald-100 text-emerald-700"
                    : "border-amber-200 bg-amber-100 text-amber-700"
                }`}
                title={
                  markingReview
                    ? "Updating..."
                    : `Mark review completed for pitch ${pitchId ?? ""}`
                }
              >
                {markingReview ? "Updating…" : reviewStatus}
              </button>
            ) : null}
          </div>

          <p className="text-sm text-gray-600">
            Pitch analysis powered by Google Gemini with RAG-grounded investor
            insights
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 mb-2">
          {/* Left: Overall Score - Circular */}
          <Card className="p-4 bg-[#fffaf9]">
            <div className="mb-2">
              <p className="text-sm uppercase tracking-wide font-semibold">
                Overall Score
              </p>
            </div>

            {/* Circular Progress centered below header */}
            <div className="flex items-center justify-center">
              <div className="relative w-40 h-40 mb-2">
                <svg
                  className="w-40 h-40 transform -rotate-90"
                  viewBox="0 0 160 160"
                >
                  {/* Background circle */}
                  <circle
                    cx="80"
                    cy="80"
                    r="70"
                    stroke="white"
                    strokeWidth="12"
                    fill="none"
                    className="text-muted"
                  />
                  {/* Progress circle */}
                  <circle
                    cx="80"
                    cy="80"
                    r="70"
                    strokeWidth="12"
                    fill="none"
                    strokeLinecap="round"
                    className={getStrokeColor(data.overall_score)}
                    style={{
                      strokeDasharray: `${2 * Math.PI * 70}`,
                      strokeDashoffset: `${
                        2 * Math.PI * 70 * (1 - data.overall_score / 100)
                      }`,
                      transition: "stroke-dashoffset 1s ease",
                    }}
                  />
                </svg>
                {/* Score text overlay */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div
                    className={`text-5xl font-bold ${getScoreColor(
                      data.overall_score
                    )}`}
                  >
                    {data.overall_score}
                  </div>
                  <p className="text-sm text-muted-foreground">out of 100</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Right: Detailed Scores */}
          <Card className="lg:col-span-2 p-4 bg-[#fffaf9] border">
            <p className="text-sm uppercase tracking-wide font-semibold">
              Detailed Score
            </p>
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(data.scores).map(([key, value]) => (
                <div key={key} className="flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm capitalize text-muted-foreground">
                      {key.replace("_", " ")}
                    </span>
                    <span
                      className={`text-lg font-bold ${getScoreColor(value)}`}
                    >
                      {value}/10
                    </span>
                  </div>
                  <div className="relative w-full h-1.5 bg-white rounded-full overflow-hidden border border-gray-200">
                    <div
                      className={`absolute inset-y-0 left-0 rounded-full transition-all ${getProgressColor(
                        value
                      )}`}
                      style={{ width: `${(value / 10) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Suggested Improvements */}
        <Card className="p-4 mb-2 bg-[#fffaf9] border">
          <div className="flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-[#ff4000]" />
            <h2 className="text-sm uppercase tracking-wide font-semibold">
              Suggested Improvements
            </h2>
          </div>
          <ul className="space-y-2">
            {data.suggested_improvements.map((improvement, idx) => (
              <li key={idx} className="flex gap-3 text-sm leading-relaxed">
                <span className="text-muted-foreground">•</span>
                <span>{improvement}</span>
              </li>
            ))}
          </ul>
        </Card>

        {/* Strengths and Risks */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
          {/* Strengths */}
          <Card className="p-4 bg-[#fffaf9] border">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <h2 className="text-sm uppercase tracking-wide font-semibold">
                Top Strengths
              </h2>
            </div>
            <ul className="space-y-1">
              {data.top_strengths.map((strength, idx) => (
                <li key={idx} className="flex gap-2 text-sm leading-relaxed">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-1 shrink-0" />
                  <span>{strength}</span>
                </li>
              ))}
            </ul>
          </Card>

          {/* Risks */}
          <Card className="p-4 bg-[#fffaf9] border">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-500" />
              <h2 className="text-sm uppercase tracking-wide font-semibold">
                Top Risks
              </h2>
            </div>
            <ul className="space-y-1">
              {data.top_risks.map((risk, idx) => (
                <li key={idx} className="flex gap-2 text-sm leading-relaxed">
                  <AlertCircle className="w-4 h-4 text-rose-500 mt-1 shrink-0" />
                  <span>{risk}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>

        {/* Missing Information */}
        <Card className="p-4 mb-2 bg-[#fffaf9] border">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-[#ff4000]" />
            <h2 className="text-sm uppercase tracking-wide font-semibold">
              Missing Information
            </h2>
          </div>
          <ul className="space-y-1">
            {data.missing_info.map((info, idx) => (
              <li key={idx} className="flex gap-2 text-sm leading-relaxed">
                <span className="text-muted-foreground mt-1">•</span>
                <span>{info}</span>
              </li>
            ))}
          </ul>
        </Card>

        {/* Rewritten Pitch */}
        <Card className="p-4 mb-2 bg-[#fffaf9] border">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#ff4000]" />
            <h2 className="text-sm uppercase tracking-wide font-semibold">
              Rewritten Pitch
            </h2>
            <Badge
              variant="secondary"
              className="ml-2 border border-[#ff4000] text-[#ff4000] rounded-full px-2 py-0.5"
            >
              Improved Version
            </Badge>
          </div>
          <p className="text-sm leading-relaxed">{data.rewritten_pitch}</p>
        </Card>

        {/* Follow-up Questions */}
        <Card className="p-4 bg-[#fffaf9] border">
          <div className="flex items-center gap-2 ">
            <MessageSquare className="w-4 h-4 text-[#ff4000]" />
            <h2 className="text-sm uppercase tracking-wide font-semibold">
              Follow-up Questions
            </h2>
          </div>
          <ul className="space-y-2">
            {data.follow_up_questions.map((question, idx) => (
              <li key={idx} className="flex gap-3 text-sm leading-relaxed">
                <span className="text-primary font-semibold">{idx + 1}.</span>
                <span>{question}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}

// Default export expected by pages that import this file.
// This component now fetches feedback for a pitch on mount.
export default function ReviewFeedbackClient({
  params,
  searchParams,
  user,
}: any) {
  const paramsFromHook = useParams();
  const [data, setData] = useState<FeedbackData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [startupName, setStartupName] = useState<string | null>(null);
  const [pitchId, setPitchId] = useState<string | null>(null);
  const [reviewStatus, setReviewStatus] = useState<string | null>(null);
  const [markingReview, setMarkingReview] = useState<boolean>(false);

  useEffect(() => {
    // Priority order:
    // 1. client-side hook params (useParams) - works after hydration / client navigation
    // 2. server-provided `params` prop passed from the page
    // 3. searchParams.pitch_id
    // 4. sessionStorage fallback if the app previously stored the pitch id
    let pitchId =
      paramsFromHook?.pitch_id ??
      params?.pitch_id ??
      params?.id ??
      searchParams?.pitch_id;

    if (!pitchId && typeof window !== "undefined") {
      pitchId =
        sessionStorage.getItem("pitch_session_id") ||
        sessionStorage.getItem("pitch_id") ||
        null;
    }

    if (!pitchId) {
      setError("No pitch id provided in route params.");
      setLoading(false);
      return;
    }

    const apiBase = (
      process.env.NEXT_PUBLIC_DEMODAY_API_URI ||
      (process.env.DEMODAY_API_URI as string) ||
      ""
    ).replace(/\/$/, "");

    if (!apiBase) {
      setError("API base URL not configured (NEXT_PUBLIC_DEMODAY_API_URI).");
      setLoading(false);
      return;
    }

    const abortController = new AbortController();

    (async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(
          `${apiBase}/pitch/${encodeURIComponent(String(pitchId))}`,
          {
            signal: abortController.signal,
          }
        );
        if (!res.ok) {
          const text = await res.text().catch(() => res.statusText);
          throw new Error(`Failed to fetch pitch: ${res.status} ${text}`);
        }

        const json = await res.json();

        // Backend returns shape with `score` and `feedback` objects.
        const scoreObj = json.score ?? {};
        const fb = json.feedback ?? {};

        const mapped: FeedbackData = {
          overall_score: Number(scoreObj.overall_score ?? 0),
          scores: scoreObj.scores ?? (scoreObj as any) ?? {},
          top_strengths: fb.top_strengths ?? [],
          top_risks: fb.top_risks ?? [],
          missing_info: fb.missing_info ?? [],
          suggested_improvements: fb.suggested_improvements ?? [],
          rewritten_pitch: fb.rewritten_pitch ?? "",
          follow_up_questions: fb.follow_up_questions ?? [],
          tts_summary: fb.tts_summary ?? "",
        };

        // capture startup name from API (backend returns `startup_name`)
        const apiStartupName = json.startup_name ?? json.startupName ?? null;
        setStartupName(apiStartupName);

        // capture review status from API if provided
        const apiStatus =
          json.review_status ??
          json.reviewStatus ??
          json.status ??
          fb.review_status ??
          fb.status ??
          null;
        if (apiStatus) setReviewStatus(String(apiStatus));

        // store resolved pitch id for later actions
        setPitchId(String(pitchId));
        setData(mapped);
      } catch (err: any) {
        if (err.name === "AbortError") return;
        console.error("[ReviewFeedbackClient] fetch error:", err);
        setError(err?.message ?? "Failed to load pitch feedback");
      } finally {
        setLoading(false);
      }
    })();

    return () => abortController.abort();
  }, [params, searchParams]);

  // Handler for marking review as completed
  const markReviewCompleted = async () => {
    if (!pitchId) {
      setError("No pitch id available to mark review completed.");
      return;
    }

    const apiBase = (
      process.env.NEXT_PUBLIC_DEMODAY_API_URI ||
      (process.env.DEMODAY_API_URI as string) ||
      ""
    ).replace(/\/$/, "");

    if (!apiBase) {
      setError("API base URL not configured (NEXT_PUBLIC_DEMODAY_API_URI).");
      return;
    }

    try {
      setMarkingReview(true);
      setError(null);
      const res = await fetch(
        `${apiBase}/pitch/${encodeURIComponent(
          String(pitchId)
        )}/review-completed`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!res.ok) {
        const text = await res.text().catch(() => res.statusText);
        throw new Error(
          `Failed to mark review completed: ${res.status} ${text}`
        );
      }

      // update UI status
      setReviewStatus("Review Completed");
    } catch (err: any) {
      console.error("[ReviewFeedbackClient] markReviewCompleted error:", err);
      setError(err?.message ?? "Failed to mark review completed");
    } finally {
      setMarkingReview(false);
    }
  };

  if (loading) {
    return <div className="p-6">Loading feedback…</div>;
  }

  if (error) {
    return <div className="p-6 text-rose-600">Error: {error}</div>;
  }

  if (!data) {
    return <div className="p-6">No feedback available for this pitch.</div>;
  }

  return (
    <FeedbackDashboard
      data={data}
      startupName={startupName ?? undefined}
      pitchId={pitchId}
      reviewStatus={reviewStatus}
      onMarkReviewCompleted={markReviewCompleted}
      markingReview={markingReview}
    />
  );
}
