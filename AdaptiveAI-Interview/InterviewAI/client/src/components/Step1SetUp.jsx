import React, { useState } from "react";
import { motion } from "motion/react";
import {
  FaUserTie,
  FaBriefcase,
  FaFileUpload,
  FaMicrophoneAlt,
  FaBrain,
  FaCheckCircle,
  FaCode,
  FaDatabase,
  FaServer,
  FaNetworkWired,
  FaArrowRight,
} from "react-icons/fa";
import axios from "axios";
import { serverUrl } from "../App";
import { useDispatch, useSelector } from "react-redux";
import { setuserData } from "../redux/userSlice";

function Step1SetUp({ onStart }) {
  const { userData } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const [role, setRole] = useState("");
  const [experience, setExperience] = useState("");
  const [mode, setMode] = useState("Technical");
  const [includeCoreSubjects, setIncludeCoreSubjects] = useState(true);

  const [resumeFile, setResumeFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [startError, setStartError] = useState("");

  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [resumeText, setResumeText] = useState("");
  const [analysisDone, setAnalysisDone] = useState(false);

  const handleUploadResume = async () => {
    if (!resumeFile || analyzing) return;

    setStartError("");
    setAnalyzing(true);

    const formdata = new FormData();
    formdata.append("resume", resumeFile);

    try {
      const result = await axios.post(
        serverUrl + "/api/interview/resume",
        formdata,
        { withCredentials: true }
      );

      const data = result.data || {};

      setRole(data.role || "");
      setExperience(data.experience || "");
      setProjects(data.projects || []);
      setSkills(data.skills || []);
      setResumeText(data.resumeText || "");
      setAnalysisDone(true);
    } catch (error) {
      console.error("Resume analysis error:", error);
      setStartError(
        error.response?.data?.message ||
          "Could not analyze the resume. Please try again."
      );
    } finally {
      setAnalyzing(false);
    }
  };

  const handleStart = async () => {
    setStartError("");

    if (!role.trim() || !experience.trim()) {
      setStartError("Please enter your role and experience.");
      return;
    }

    setLoading(true);

    try {
      const result = await axios.post(
        serverUrl + "/api/interview/generate-questions",
        {
          role,
          experience,
          mode,
          resumeText,
          projects,
          skills,
          includeCoreSubjects,
        },
        { withCredentials: true }
      );

      console.log("Interview setup:", {
        role,
        experience,
        mode,
        includeCoreSubjects,
        projects,
        skills,
      });

      if (userData) {
        dispatch(
          setuserData({
            ...userData,
            credits: result.data.creditsLeft,
          })
        );
      }

      onStart({
        ...result.data,
        role,
        experience,
        mode,
        resumeText,
        projects,
        skills,
        includeCoreSubjects,
      });
    } catch (err) {
      console.error(
        "Failed to start interview:",
        err.response?.data || err
      );

      setStartError(
        err.response?.data?.message ||
          "Unable to start the interview. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const coreSubjects = [
    {
      icon: <FaCode />,
      name: "OOPS",
      text: "More project-connected",
    },
    {
      icon: <FaDatabase />,
      name: "DBMS",
      text: "Mostly conceptual",
    },
    {
      icon: <FaServer />,
      name: "OS",
      text: "Mostly conceptual",
    },
    {
      icon: <FaNetworkWired />,
      name: "CN",
      text: "Mostly conceptual",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-slate-950 px-4 py-6 sm:px-8 lg:px-12"
    >
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-7 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"
        >
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-emerald-400">
              <FaMicrophoneAlt />
              AI INTERVIEW AGENT
            </div>

            <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
              Build your interview
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
              Personalize the interview using your resume, projects, skills
              and core computer-science subjects.
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-300">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.8)]" />
            AI interviewer ready
          </div>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
          {/* LEFT */}
          <motion.div
            initial={{ x: -30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="relative overflow-hidden rounded-[28px] border border-white/10 bg-gradient-to-br from-emerald-500/15 via-slate-900 to-teal-500/10 p-7 shadow-2xl sm:p-9"
          >
            <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-emerald-400/10 blur-3xl" />
            <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-teal-400/10 blur-3xl" />

            <div className="relative">
              <div className="mb-7 flex h-16 w-16 items-center justify-center rounded-2xl border border-emerald-400/20 bg-emerald-400/10 text-2xl text-emerald-400">
                <FaBrain />
              </div>

              <h2 className="text-3xl font-black text-white">
                Interview that adapts to you.
              </h2>

              <p className="mt-3 leading-7 text-slate-400">
                The AI follows your answers instead of blindly following a
                fixed list of questions.
              </p>

              <div className="mt-8 space-y-3">
                {[
                  ["01", "Resume & project deep dive"],
                  ["02", "Role-specific technical questions"],
                  ["03", "Adaptive follow-ups"],
                  ["04", "Natural real-time voice conversation"],
                ].map(([number, text]) => (
                  <div
                    key={number}
                    className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-4"
                  >
                    <span className="text-xs font-black text-emerald-400">
                      {number}
                    </span>
                    <span className="text-sm font-medium text-slate-200">
                      {text}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-8 rounded-2xl border border-emerald-400/10 bg-emerald-400/[0.06] p-5">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-400">
                  Recommended
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  Enable core subjects for a more complete technical
                  interview. OOPS can be connected to your projects more
                  frequently, while DBMS, OS and CN remain mostly conceptual.
                </p>
              </div>
            </div>
          </motion.div>

          {/* RIGHT */}
          <motion.div
            initial={{ x: 30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-2xl sm:p-8"
          >
            <div className="mb-7">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-600">
                Step 1 · Setup
              </p>
              <h2 className="mt-2 text-2xl font-black text-slate-900">
                Tell us about the interview
              </h2>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              {/* Role */}
              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  Target role
                </label>
                <div className="relative">
                  <FaUserTie className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder="e.g. Full Stack Developer"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-4 text-sm outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
                  />
                </div>
              </div>

              {/* Experience */}
              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  Experience / level
                </label>
                <div className="relative">
                  <FaBriefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    placeholder="e.g. Fresher / 1 year"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-4 text-sm outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
                  />
                </div>
              </div>
            </div>

            {/* Mode */}
            <div className="mt-5">
              <label className="mb-2 block text-sm font-bold text-slate-700">
                Interview type
              </label>

              <div className="grid grid-cols-2 gap-3">
                {["Technical", "HR"].map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setMode(item)}
                    className={`rounded-2xl border px-4 py-4 text-left transition ${
                      mode === item
                        ? "border-emerald-500 bg-emerald-50 text-emerald-700 shadow-sm"
                        : "border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold">{item}</span>
                      {mode === item && <FaCheckCircle />}
                    </div>
                    <p className="mt-1 text-xs opacity-70">
                      {item === "Technical"
                        ? "Skills, projects & CS concepts"
                        : "Behavioral & communication"}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Core subjects */}
            <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-50 p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <FaBrain className="text-emerald-600" />
                    <h3 className="font-black text-slate-900">
                      Include Core Subjects?
                    </h3>
                  </div>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Add normal interview questions from OOPS, DBMS, OS, CN,
                    DSA and SQL.
                  </p>
                </div>

                <button
                  type="button"
                  role="switch"
                  aria-checked={includeCoreSubjects}
                  onClick={() =>
                    setIncludeCoreSubjects((current) => !current)
                  }
                  className={`relative h-8 w-14 shrink-0 rounded-full transition ${
                    includeCoreSubjects
                      ? "bg-emerald-500"
                      : "bg-slate-300"
                  }`}
                >
                  <span
                    className={`absolute top-1 h-6 w-6 rounded-full bg-white shadow-md transition ${
                      includeCoreSubjects ? "left-7" : "left-1"
                    }`}
                  />
                </button>
              </div>

              {includeCoreSubjects && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="mt-4 grid grid-cols-2 gap-2"
                >
                  {coreSubjects.map((subject) => (
                    <div
                      key={subject.name}
                      className="rounded-2xl border border-white bg-white p-3"
                    >
                      <div className="flex items-center gap-2 text-sm font-bold text-slate-800">
                        <span className="text-emerald-600">
                          {subject.icon}
                        </span>
                        {subject.name}
                      </div>
                      <p className="mt-1 text-[11px] text-slate-500">
                        {subject.text}
                      </p>
                    </div>
                  ))}
                </motion.div>
              )}
            </div>

            {/* Resume */}
            <div className="mt-6">
              <label className="mb-2 block text-sm font-bold text-slate-700">
                Resume
              </label>

              {!analysisDone ? (
                <div
                  onClick={() =>
                    document.getElementById("resumeUpload").click()
                  }
                  className="cursor-pointer rounded-3xl border-2 border-dashed border-slate-200 bg-slate-50 p-6 text-center transition hover:border-emerald-400 hover:bg-emerald-50/40"
                >
                  <FaFileUpload className="mx-auto text-3xl text-emerald-600" />

                  <p className="mt-3 text-sm font-bold text-slate-700">
                    {resumeFile
                      ? resumeFile.name
                      : "Upload your PDF resume"}
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    Optional, but recommended for personalized questions
                  </p>

                  <input
                    id="resumeUpload"
                    type="file"
                    accept="application/pdf"
                    className="hidden"
                    onChange={(e) => {
                      setResumeFile(e.target.files?.[0] || null);
                      setAnalysisDone(false);
                    }}
                  />

                  {resumeFile && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleUploadResume();
                      }}
                      disabled={analyzing}
                      className="mt-4 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-slate-800 disabled:opacity-60"
                    >
                      {analyzing ? "Analyzing resume..." : "Analyze Resume"}
                    </button>
                  )}
                </div>
              ) : (
                <div className="rounded-3xl border border-emerald-100 bg-emerald-50/60 p-5">
                  <div className="flex items-center gap-2">
                    <FaCheckCircle className="text-emerald-600" />
                    <span className="font-bold text-slate-800">
                      Resume analyzed
                    </span>
                  </div>

                  {projects.length > 0 && (
                    <div className="mt-4">
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                        Projects
                      </p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {projects.slice(0, 5).map((project, index) => (
                          <span
                            key={index}
                            className="rounded-full bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm"
                          >
                            {project}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {skills.length > 0 && (
                    <div className="mt-4">
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                        Skills
                      </p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {skills.slice(0, 10).map((skill, index) => (
                          <span
                            key={index}
                            className="rounded-full bg-emerald-100 px-3 py-1.5 text-xs font-semibold text-emerald-700"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Start */}
            <motion.button
              type="button"
              onClick={handleStart}
              disabled={!role.trim() || !experience.trim() || loading}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="mt-6 flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-500 py-4 text-base font-black text-white shadow-xl shadow-emerald-600/20 transition disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                "Preparing your interview..."
              ) : (
                <>
                  Start AI Interview
                  <FaArrowRight />
                </>
              )}
            </motion.button>

            {startError && (
              <p
                className="mt-3 rounded-xl bg-red-50 p-3 text-center text-sm font-medium text-red-600"
                role="alert"
              >
                {startError}
              </p>
            )}

            <p className="mt-4 text-center text-[11px] text-slate-400">
              Your AI interviewer will adapt questions based on your answers.
            </p>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

export default Step1SetUp;
