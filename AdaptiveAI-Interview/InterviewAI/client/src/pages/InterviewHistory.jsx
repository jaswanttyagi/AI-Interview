import React, { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import { serverUrl } from "../App";
import {
  FaArrowLeft,
  FaCalendarAlt,
  FaChevronRight,
  FaClock,
  FaCode,
  FaHistory,
  FaMicrophone,
  FaTrophy,
} from "react-icons/fa";
import axios from "axios";

const InterviewHistory = () => {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const getMyInterviews = async () => {
      try {
        const res = await axios.get(
          serverUrl + "/api/interview/get-interview",
          {
            withCredentials: true,
          }
        );
        setInterviews(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.log("Interview not fetch", err);
      } finally {
        setLoading(false);
      }
    };

    getMyInterviews();
  }, []);

  const stats = useMemo(() => {
    const completed = interviews.filter(
      (item) => item.status === "completed"
    );

    const scores = completed
      .map((item) => Number(item.finalScore || 0))
      .filter((score) => !Number.isNaN(score));

    const average =
      scores.length > 0
        ? (scores.reduce((sum, score) => sum + score, 0) / scores.length).toFixed(1)
        : "0.0";

    const best =
      scores.length > 0 ? Math.max(...scores).toFixed(1) : "0.0";

    return {
      total: interviews.length,
      completed: completed.length,
      average,
      best,
    };
  }, [interviews]);

  return (
    <div className="min-h-screen bg-[#f6f9f7] text-slate-950">
      {/* subtle background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-emerald-100/70 blur-3xl" />
        <div className="absolute -right-32 top-1/3 h-96 w-96 rounded-full bg-teal-100/50 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-7 flex items-center justify-between"
        >
          <button
            onClick={() => navigate("/")}
            className="group flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:-translate-x-0.5 hover:border-emerald-200 hover:text-emerald-600"
            title="Back to home"
          >
            <FaArrowLeft className="text-sm transition group-hover:-translate-x-0.5" />
          </button>

          <div className="flex items-center gap-2 rounded-full border border-emerald-100 bg-white px-4 py-2 text-[10px] font-black uppercase tracking-[0.15em] text-emerald-600 shadow-sm">
            <FaHistory />
            Your Interview Journey
          </div>
        </motion.div>

        {/* TITLE */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="mb-8"
        >
          <p className="text-xs font-black uppercase tracking-[0.2em] text-emerald-600">
            Interview performance
          </p>

          <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
                Interview History
              </h1>
              <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
                Review your previous AI interviews, scores and detailed reports
                to see how your preparation is progressing.
              </p>
            </div>

            <button
              onClick={() => navigate("/interview")}
              className="flex items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 py-3 text-xs font-black text-white shadow-lg shadow-slate-900/10 transition hover:-translate-y-0.5"
            >
              <FaMicrophone className="text-emerald-400" />
              Start New Interview
            </button>
          </div>
        </motion.div>

        {/* STATS */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 grid grid-cols-2 gap-3 lg:grid-cols-4"
        >
          {[
            {
              label: "Total Interviews",
              value: stats.total,
              icon: <FaHistory />,
            },
            {
              label: "Completed",
              value: stats.completed,
              icon: <FaTrophy />,
            },
            {
              label: "Average Score",
              value: `${stats.average}/10`,
              icon: <FaCode />,
            },
            {
              label: "Best Score",
              value: `${stats.best}/10`,
              icon: <FaTrophy />,
            },
          ].map((stat, index) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-sm text-emerald-600">
                  {stat.icon}
                </span>
                <span className="text-[9px] font-black text-slate-300">
                  0{index + 1}
                </span>
              </div>
              <p className="mt-4 text-2xl font-black text-slate-900">
                {stat.value}
              </p>
              <p className="mt-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {stat.label}
              </p>
            </div>
          ))}
        </motion.div>

        {/* LIST CARD */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-xl shadow-slate-900/[0.04]"
        >
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-5 sm:px-6">
            <div>
              <h2 className="text-lg font-black">Recent Interviews</h2>
              <p className="mt-1 text-xs text-slate-400">
                Select an interview to view its detailed report.
              </p>
            </div>

            <span className="rounded-full bg-slate-50 px-3 py-1.5 text-[10px] font-black text-slate-500">
              {interviews.length} session{interviews.length !== 1 ? "s" : ""}
            </span>
          </div>

          <div className="p-3 sm:p-4">
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((item) => (
                  <div
                    key={item}
                    className="animate-pulse rounded-2xl border border-slate-100 p-5"
                  >
                    <div className="h-4 w-40 rounded bg-slate-100" />
                    <div className="mt-3 h-3 w-64 rounded bg-slate-100" />
                    <div className="mt-5 h-2 w-full rounded bg-slate-100" />
                  </div>
                ))}
              </div>
            ) : interviews.length === 0 ? (
              <div className="flex min-h-[360px] flex-col items-center justify-center rounded-2xl bg-slate-50 px-6 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-2xl text-emerald-500 shadow-sm">
                  <FaHistory />
                </div>

                <h3 className="mt-5 text-lg font-black text-slate-800">
                  No interviews found
                </h3>

                <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
                  Start your first AI interview and your performance reports
                  will appear here.
                </p>

                <button
                  onClick={() => navigate("/interview")}
                  className="mt-5 rounded-xl bg-slate-950 px-5 py-3 text-xs font-black text-white"
                >
                  Start Your First Interview →
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {interviews.map((item, index) => {
                  const score = Number(item.finalScore || 0);
                  const percentage = Math.min(Math.max(score * 10, 0), 100);
                  const completed = item.status === "completed";

                  return (
                    <motion.button
                      type="button"
                      key={item._id || index}
                      onClick={() => navigate(`/report/${item._id}`)}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.04 }}
                      whileHover={{ y: -2 }}
                      className="group w-full rounded-2xl border border-slate-200 bg-white p-4 text-left transition hover:border-emerald-200 hover:bg-emerald-50/[0.25] hover:shadow-lg sm:p-5"
                    >
                      <div className="flex flex-col gap-5 lg:flex-row lg:items-center">
                        {/* LEFT */}
                        <div className="flex min-w-0 flex-1 items-start gap-4">
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-emerald-400 shadow-sm">
                            {item.mode === "HR" ? (
                              <FaMicrophone />
                            ) : (
                              <FaCode />
                            )}
                          </div>

                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="truncate text-base font-black text-slate-900">
                                {item.role || "Interview"}
                              </h3>

                              <span
                                className={`rounded-full px-2.5 py-1 text-[9px] font-black uppercase tracking-wider ${
                                  completed
                                    ? "bg-emerald-100 text-emerald-700"
                                    : "bg-amber-100 text-amber-700"
                                }`}
                              >
                                {item.status || "pending"}
                              </span>
                            </div>

                            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] font-medium text-slate-400">
                              <span>{item.experience || "Experience not specified"}</span>

                              <span className="h-1 w-1 rounded-full bg-slate-300" />

                              <span>{item.mode || "Technical"}</span>

                              <span className="h-1 w-1 rounded-full bg-slate-300" />

                              <span className="flex items-center gap-1">
                                <FaCalendarAlt />
                                {item.createdAt
                                  ? new Date(item.createdAt).toLocaleDateString(
                                      undefined,
                                      {
                                        day: "2-digit",
                                        month: "short",
                                        year: "numeric",
                                      }
                                    )
                                  : "Date unavailable"}
                              </span>
                            </div>

                            {/* score progress */}
                            <div className="mt-4 flex max-w-md items-center gap-3">
                              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: `${percentage}%` }}
                                  transition={{ duration: 0.7, delay: index * 0.04 }}
                                  className="h-full rounded-full bg-emerald-500"
                                />
                              </div>
                              <span className="text-[10px] font-bold text-slate-400">
                                {percentage}%
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* SCORE */}
                        <div className="flex items-center justify-between gap-5 border-t border-slate-100 pt-4 lg:min-w-[190px] lg:border-t-0 lg:pt-0">
                          <div>
                            <p className="text-[9px] font-black uppercase tracking-[0.16em] text-slate-400">
                              Overall Score
                            </p>
                            <p className="mt-1 text-3xl font-black tracking-tight text-emerald-600">
                              {score.toFixed(1)}
                              <span className="ml-1 text-sm text-slate-300">
                                /10
                              </span>
                            </p>
                          </div>

                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 text-slate-400 transition group-hover:bg-emerald-500 group-hover:text-white">
                            <FaChevronRight className="text-xs" />
                          </div>
                        </div>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            )}
          </div>
        </motion.div>

        {/* FOOTER TIP */}
        <div className="mt-5 flex flex-col items-center justify-between gap-2 px-2 text-[10px] font-medium text-slate-400 sm:flex-row">
          <span>Keep practicing to build confidence and improve your performance.</span>
          <span className="flex items-center gap-1">
            <FaClock />
            Review your report after every session.
          </span>
        </div>
      </div>
    </div>
  );
};

export default InterviewHistory;
