import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { motion } from "motion/react";
import {
  FaMicrophone,
  FaMicrophoneSlash,
  FaPhoneSlash,
  FaRobot,
  FaClock,
  FaSignal,
} from "react-icons/fa";
import axios from "axios";

import maleVideo from "../assets/Videos/male-ai.mp4";
import femaleVideo from "../assets/Videos/female-ai.mp4";

import { serverUrl } from "../App";
import { vapi, vapiAssistantId } from "../lib/vapi";

const TARGET_SECONDS = 35 * 60;
const MAX_SECONDS = 40 * 60;

function formatTime(seconds) {
  const safe = Math.max(0, Math.floor(seconds));
  const minutes = Math.floor(safe / 60).toString().padStart(2, "0");
  const secs = (safe % 60).toString().padStart(2, "0");
  return `${minutes}:${secs}`;
}

function safeStringify(value) {
  try {
    return JSON.stringify(
      value,
      (key, val) => {
        if (typeof val === "function") {
          return `[Function ${val.name || "anonymous"}]`;
        }
        return val;
      },
      2
    );
  } catch {
    return String(value);
  }
}

function Step2Interview({ interviewData, onFinish }) {
  const {
    interviewId,
    questions = [],
    userName,
    role,
    mode,
    experience,
    resumeText = "",
    projects = [],
    skills = [],
    includeCoreSubjects = true,
  } = interviewData || {};

  const [callStatus, setCallStatus] = useState("idle");
  const [isAISpeaking, setIsAISpeaking] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [messages, setMessages] = useState([]);
  const [elapsed, setElapsed] = useState(0);
  const [error, setError] = useState("");
  const [isFinishing, setIsFinishing] = useState(false);
  const [isReportLoading, setIsReportLoading] = useState(false);

  const voiceGender = "female";

  const messagesRef = useRef([]);
  const startTimeRef = useRef(null);
  const finishStartedRef = useRef(false);
  const targetWarningSentRef = useRef(false);
  const videoRef = useRef(null);

  const videoSource =
    voiceGender === "male" ? maleVideo : femaleVideo;

  const addMessage = useCallback((message) => {
    if (!message?.transcript) return;

    const content = String(message.transcript).trim();
    if (!content) return;

    const normalized = {
      role: message.role === "assistant" ? "assistant" : "user",
      content,
      timestamp: new Date().toISOString(),
    };

    const nextMessages = [...messagesRef.current, normalized];
    messagesRef.current = nextMessages;
    setMessages(nextMessages);
  }, []);

  const finishOnServer = useCallback(async () => {
    if (isReportLoading) return;

    setIsReportLoading(true);

    try {
      const durationSeconds = startTimeRef.current
        ? Math.min(
            MAX_SECONDS,
            Math.floor((Date.now() - startTimeRef.current) / 1000)
          )
        : elapsed;

      const result = await axios.post(
        `${serverUrl}/api/interview/finish-voice`,
        {
          interviewId,
          transcript: messagesRef.current,
          durationSeconds,
        },
        { withCredentials: true }
      );

      console.log("Interview report:", result.data);
      onFinish(result.data);
    } catch (err) {
      console.error("Voice interview report error:", err);
      setError(
        err?.response?.data?.message ||
          "Interview ended, but the final report could not be generated."
      );
      setIsReportLoading(false);
    }
  }, [elapsed, interviewId, isReportLoading, onFinish]);

  const requestFinish = useCallback((speakGoodbye = true) => {
    if (!vapi || finishStartedRef.current) return;

    finishStartedRef.current = true;
    setIsFinishing(true);
    setCallStatus("ending");

    if (speakGoodbye) {
      try {
        vapi.say(
          "Thanks for your time. That concludes the interview. I'll prepare your performance report now.",
          true
        );

        setTimeout(() => {
          try {
            vapi.stop();
          } catch (err) {
            console.error("Vapi stop failed:", err);
          }
        }, 4000);

        return;
      } catch (err) {
        console.error("Vapi say failed:", err);
      }
    }

    try {
      vapi.stop();
    } catch (err) {
      console.error("Vapi stop failed:", err);
    }
  }, []);

  const startInterview = useCallback(async () => {
    if (!vapi) {
      setError(
        "Vapi public key is missing. Add VITE_VAPI_PUBLIC_KEY to client/.env."
      );
      return;
    }

    if (!vapiAssistantId) {
      setError(
        "Vapi assistant ID is missing. Add VITE_VAPI_ASSISTANT_ID to client/.env."
      );
      return;
    }

    setError("");
    setCallStatus("connecting");
    setMessages([]);
    messagesRef.current = [];
    finishStartedRef.current = false;
    targetWarningSentRef.current = false;
    setElapsed(0);
    setIsMuted(false);
    setIsAISpeaking(false);
    setIsFinishing(false);

    const dynamicVariables = {
      candidateName: userName || "Candidate",
      role: role || "Software Developer",
      interviewMode: mode || "Technical",
      resume: resumeText || "No resume provided.",
      starterQuestions: JSON.stringify(questions || []),
      includeCoreSubjects: String(includeCoreSubjects),
    };

    console.log("========================================");
    console.log("STARTING VAPI INTERVIEW");
    console.log("Assistant ID:", vapiAssistantId);
    console.log("Candidate:", dynamicVariables.candidateName);
    console.log("Role:", dynamicVariables.role);
    console.log("Mode:", dynamicVariables.interviewMode);
    console.log(
      "Core Subjects:",
      dynamicVariables.includeCoreSubjects
    );
    console.log("Questions:", questions);
    console.log("========================================");

    try {
      await vapi.start(vapiAssistantId, {
        variableValues: dynamicVariables,
      });

      console.log("Vapi start requested successfully.");
    } catch (err) {
      console.error("VAPI START ERROR:", safeStringify(err));
      setCallStatus("error");
      setError(
        err?.message ||
          "Vapi could not start the call. Check the browser console."
      );
    }
  }, [
    includeCoreSubjects,
    mode,
    questions,
    resumeText,
    role,
    userName,
  ]);

  const toggleMute = () => {
    if (!vapi) return;

    const nextMuted = !isMuted;

    try {
      vapi.setMuted(nextMuted);
      setIsMuted(nextMuted);
    } catch (err) {
      console.error("Mute error:", err);
    }
  };

  useEffect(() => {
    if (!vapi) return undefined;

    const onCallStart = () => {
      console.log("VAPI CALL STARTED SUCCESSFULLY");
      startTimeRef.current = Date.now();

      setCallStatus("active");
      setIsFinishing(false);
      setError("");
      setElapsed(0);
    };

    const onCallEnd = () => {
      console.log("VAPI CALL ENDED");

      setCallStatus("finished");
      setIsAISpeaking(false);

      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }

      setTimeout(() => {
        finishOnServer();
      }, 700);
    };

    const onSpeechStart = () => {
      setIsAISpeaking(true);

      if (videoRef.current) {
        videoRef.current.play().catch(() => {});
      }
    };

    const onSpeechEnd = () => {
      setIsAISpeaking(false);

      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }
    };

    const onMessage = (message) => {
      console.log("VAPI MESSAGE:", message);

      if (
        message?.type === "transcript" &&
        message?.transcriptType === "final"
      ) {
        addMessage(message);
      }
    };

    const onError = (err) => {
      console.error("FULL VAPI ERROR:", safeStringify(err));

      setError(
        err?.message ||
          "Voice connection error. Check the browser console for Vapi details."
      );
      setCallStatus("error");
    };

    vapi.on("call-start", onCallStart);
    vapi.on("call-end", onCallEnd);
    vapi.on("speech-start", onSpeechStart);
    vapi.on("speech-end", onSpeechEnd);
    vapi.on("message", onMessage);
    vapi.on("error", onError);

    return () => {
      vapi.off("call-start", onCallStart);
      vapi.off("call-end", onCallEnd);
      vapi.off("speech-start", onSpeechStart);
      vapi.off("speech-end", onSpeechEnd);
      vapi.off("message", onMessage);
      vapi.off("error", onError);
    };
  }, [addMessage, finishOnServer]);

  useEffect(() => {
    if (callStatus !== "active" || !startTimeRef.current) {
      return undefined;
    }

    const timer = setInterval(() => {
      const nextElapsed = Math.floor(
        (Date.now() - startTimeRef.current) / 1000
      );

      setElapsed(Math.min(nextElapsed, MAX_SECONDS));

      if (
        nextElapsed >= TARGET_SECONDS &&
        !targetWarningSentRef.current
      ) {
        targetWarningSentRef.current = true;

        try {
          vapi?.send({
            type: "add-message",
            message: {
              role: "system",
              content:
                "The target interview duration has been reached. Begin wrapping up naturally, but only end after the current answer is complete.",
            },
          });
        } catch (err) {
          console.error("Could not send wrap-up message:", err);
        }
      }

      if (
        nextElapsed >= MAX_SECONDS &&
        !finishStartedRef.current
      ) {
        requestFinish(true);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [callStatus, requestFinish]);

  useEffect(() => {
    return () => {
      if (vapi && callStatus === "active") {
        try {
          vapi.stop();
        } catch (err) {
          console.error("Vapi cleanup error:", err);
        }
      }
    };
  }, [callStatus]);

  const currentAssistantMessage = useMemo(
    () =>
      [...messages]
        .reverse()
        .find((message) => message.role === "assistant"),
    [messages]
  );

  const currentUserMessage = useMemo(
    () =>
      [...messages]
        .reverse()
        .find((message) => message.role === "user"),
    [messages]
  );

  const progress = Math.min((elapsed / TARGET_SECONDS) * 100, 100);

  return (
    <div className="min-h-screen bg-slate-950 px-3 py-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* TOP BAR */}
        <div className="mb-4 flex flex-col gap-3 rounded-3xl border border-white/10 bg-white/[0.04] px-5 py-4 backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-emerald-400">
              <FaRobot />
              AI Interview Agent
            </div>
            <h1 className="mt-1 text-xl font-black text-white">
              Live Interview
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-slate-300">
              {mode || "Technical"}
            </span>

            <span className="max-w-[240px] truncate rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-slate-300">
              {role || "Software Developer"}
            </span>

            <span className="flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1.5 text-xs font-semibold text-emerald-300">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              {callStatus === "active"
                ? isAISpeaking
                  ? "AI speaking"
                  : "Listening"
                : callStatus === "connecting"
                ? "Connecting"
                : callStatus === "ending"
                ? "Ending"
                : callStatus === "finished"
                ? "Finished"
                : "Ready"}
            </span>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
          {/* LEFT */}
          <div className="space-y-4">
            <div className="relative overflow-hidden rounded-[30px] border border-white/10 bg-gradient-to-br from-emerald-500/10 to-slate-900 shadow-2xl">
              <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-emerald-400/10 to-transparent" />

              <div className="relative p-4 sm:p-5">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-slate-500">
                      AI Interviewer
                    </p>
                    <p className="mt-1 text-sm font-bold text-white">
                      {isAISpeaking
                        ? "Speaking to you..."
                        : callStatus === "active"
                        ? "Listening to your answer"
                        : "Ready when you are"}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 rounded-full bg-white/5 px-3 py-2 text-xs text-slate-400">
                    <FaSignal className="text-emerald-400" />
                    Live
                  </div>
                </div>

                <div className="relative overflow-hidden rounded-[24px] border border-white/10 bg-black shadow-xl">
                  <video
                    ref={videoRef}
                    src={videoSource}
                    muted
                    playsInline
                    preload="auto"
                    className={`aspect-video w-full object-cover transition duration-500 ${
                      isAISpeaking ? "scale-[1.01]" : ""
                    }`}
                  />

                  {isAISpeaking && (
                    <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-1 rounded-full border border-emerald-400/20 bg-slate-950/80 px-4 py-2 backdrop-blur">
                      {[1, 2, 3, 4, 5].map((bar) => (
                        <motion.span
                          key={bar}
                          animate={{ height: [5, 18, 7, 14, 5] }}
                          transition={{
                            duration: 0.8,
                            repeat: Infinity,
                            delay: bar * 0.08,
                          }}
                          className="w-1 rounded-full bg-emerald-400"
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* TIMER CARD */}
            <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-5 shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-500">
                    Interview time
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    <FaClock className="text-emerald-400" />
                    <span className="text-4xl font-black tracking-tight text-white">
                      {formatTime(elapsed)}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-xs text-slate-500">Target</p>
                  <p className="mt-1 text-sm font-bold text-slate-300">
                    35 min
                  </p>
                  <p className="text-xs text-slate-500">Max 40 min</p>
                </div>
              </div>

              <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/10">
                <motion.div
                  animate={{ width: `${progress}%` }}
                  className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400"
                />
              </div>

              <div className="mt-5 grid grid-cols-3 gap-2 text-center">
                <div className="rounded-2xl bg-white/[0.04] p-3">
                  <p className="text-xl font-black text-white">
                    {
                      messages.filter(
                        (message) => message.role === "user"
                      ).length
                    }
                  </p>
                  <p className="text-[10px] uppercase tracking-wider text-slate-500">
                    Your turns
                  </p>
                </div>

                <div className="rounded-2xl bg-white/[0.04] p-3">
                  <p className="text-xl font-black text-white">
                    {
                      messages.filter(
                        (message) => message.role === "assistant"
                      ).length
                    }
                  </p>
                  <p className="text-[10px] uppercase tracking-wider text-slate-500">
                    AI turns
                  </p>
                </div>

                <div className="rounded-2xl bg-white/[0.04] p-3">
                  <p className="text-xl font-black text-white">
                    {includeCoreSubjects ? "ON" : "OFF"}
                  </p>
                  <p className="text-[10px] uppercase tracking-wider text-slate-500">
                    Core CS
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="flex min-h-[650px] flex-col overflow-hidden rounded-[30px] border border-white/10 bg-white/[0.04] shadow-2xl">
            <div className="border-b border-white/10 px-5 py-5 sm:px-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-500">
                    Candidate
                  </p>
                  <h2 className="mt-1 text-lg font-black text-white">
                    {userName || "Candidate"}
                  </h2>
                </div>

                <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-3 py-2 text-right">
                  <p className="text-[10px] uppercase tracking-wider text-emerald-400">
                    Core subjects
                  </p>
                  <p className="text-xs font-bold text-white">
                    {includeCoreSubjects ? "Included" : "Skipped"}
                  </p>
                </div>
              </div>
            </div>

            {/* CHAT */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6">
              {messages.length === 0 ? (
                <div className="flex min-h-[480px] items-center justify-center">
                  <div className="max-w-md text-center">
                    <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full border border-emerald-400/20 bg-emerald-400/10 text-4xl text-emerald-400 shadow-[0_0_50px_rgba(16,185,129,0.12)]">
                      🎙️
                    </div>

                    <h3 className="mt-6 text-2xl font-black text-white">
                      Ready for your interview?
                    </h3>

                    <p className="mt-3 text-sm leading-6 text-slate-400">
                      Start the voice interview. The AI will introduce itself,
                      ask one question at a time and adapt the conversation
                      according to your answers.
                    </p>

                    <div className="mt-5 flex flex-wrap justify-center gap-2">
                      <span className="rounded-full bg-white/5 px-3 py-2 text-xs text-slate-400">
                        Resume based
                      </span>
                      <span className="rounded-full bg-white/5 px-3 py-2 text-xs text-slate-400">
                        Adaptive
                      </span>
                      <span className="rounded-full bg-white/5 px-3 py-2 text-xs text-slate-400">
                        Real-time voice
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((message, index) => (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      key={`${message.timestamp}-${index}`}
                      className={`flex ${
                        message.role === "user"
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[88%] rounded-3xl px-4 py-3 ${
                          message.role === "user"
                            ? "rounded-br-md bg-emerald-500 text-white"
                            : "rounded-bl-md border border-white/10 bg-slate-900 text-slate-200"
                        }`}
                      >
                        <p className="mb-1 text-[9px] font-black uppercase tracking-widest opacity-50">
                          {message.role === "user"
                            ? "You"
                            : "AI Interviewer"}
                        </p>
                        <p className="text-sm leading-6">
                          {message.content}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* LIVE INDICATOR */}
            {callStatus === "active" &&
              (currentAssistantMessage || currentUserMessage) && (
                <div className="mx-4 mb-3 rounded-2xl border border-emerald-400/10 bg-emerald-400/[0.06] px-4 py-3 text-center text-xs text-emerald-300">
                  {isAISpeaking
                    ? "AI is speaking..."
                    : "Listening — speak naturally. The AI will continue automatically."}
                </div>
              )}

            {/* ERROR */}
            {error && (
              <div className="mx-4 mb-3 rounded-2xl border border-red-400/20 bg-red-400/10 p-3 text-sm text-red-300">
                {error}
              </div>
            )}

            {/* CONTROLS */}
            <div className="border-t border-white/10 p-4 sm:p-5">
              {(callStatus === "idle" || callStatus === "error") && (
                <motion.button
                  onClick={startInterview}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 py-4 font-black text-slate-950 shadow-xl shadow-emerald-500/10"
                >
                  <FaMicrophone />
                  Start Voice Interview
                </motion.button>
              )}

              {callStatus === "connecting" && (
                <button
                  disabled
                  className="flex w-full items-center justify-center gap-3 rounded-2xl bg-white/10 py-4 font-bold text-slate-300"
                >
                  <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-emerald-400" />
                  Connecting to AI interviewer...
                </button>
              )}

              {callStatus === "active" && (
                <div className="flex gap-3">
                  <motion.button
                    onClick={toggleMute}
                    whileTap={{ scale: 0.95 }}
                    className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border ${
                      isMuted
                        ? "border-yellow-400/20 bg-yellow-400/10 text-yellow-300"
                        : "border-white/10 bg-white/10 text-white"
                    }`}
                    title={isMuted ? "Unmute" : "Mute"}
                  >
                    {isMuted ? (
                      <FaMicrophoneSlash size={19} />
                    ) : (
                      <FaMicrophone size={19} />
                    )}
                  </motion.button>

                  <motion.button
                    onClick={() => requestFinish(true)}
                    disabled={isFinishing}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 rounded-2xl bg-red-500 py-4 font-black text-white shadow-lg shadow-red-500/10 disabled:opacity-50"
                  >
                    <span className="flex items-center justify-center gap-2">
                      <FaPhoneSlash />
                      End Interview
                    </span>
                  </motion.button>
                </div>
              )}

              {(callStatus === "finished" || isReportLoading) && (
                <button
                  disabled
                  className="w-full rounded-2xl bg-white/10 py-4 font-bold text-slate-300"
                >
                  {isReportLoading
                    ? "Generating performance report..."
                    : "Interview finished"}
                </button>
              )}

              <p className="mt-3 text-center text-[10px] text-slate-600">
                Real-time voice powered by Vapi · No browser speech synthesis
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Step2Interview;
