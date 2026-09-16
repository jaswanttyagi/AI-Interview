import React, { useState } from 'react'
import Navbar from "../components/Navbar"
import { useSelector } from 'react-redux'
import { motion } from 'motion/react'
import { BsRobot, BsMic, BsClock, BsBarChart, BsFileEarmarkText } from 'react-icons/bs'
import { HiSparkles } from 'react-icons/hi'
import { useNavigate } from 'react-router-dom'
import AuthModel from '../components/AuthModel'
import evalImg from "../assets/images/ai-ans.png"
import hrImg from "../assets/images/HR.png"
import techImg from "../assets/images/tech.png"
import confidenceImg from "../assets/images/confi.png"
import creditImg from "../assets/images/credit.png"
import resumeImg from "../assets/images/resume.png"
import historyImg from "../assets/images/history.png"
import pdfImg from "../assets/images/pdf.png"
import Footer from "../components/Footer"


export const Home = () => {
    const { userData } = useSelector((state) => state.user);
    const [showAuth, setshowAuth] = useState(false);
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[#f7faf8] text-slate-950 overflow-hidden">
            <Navbar />

            {/* HERO */}
            <section className="relative px-5 pt-14 pb-20 sm:px-8 lg:px-12 lg:pt-20">
                <div className="absolute -top-32 left-1/2 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-emerald-200/30 blur-3xl" />
                <div className="absolute right-[-120px] top-32 h-72 w-72 rounded-full bg-teal-100/60 blur-3xl" />

                <div className="relative mx-auto max-w-7xl">
                    <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
                        <div>
                            <motion.div
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/80 px-4 py-2 text-xs font-bold text-emerald-700 shadow-sm backdrop-blur"
                            >
                                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100">
                                    <HiSparkles />
                                </span>
                                AI-POWERED INTERVIEW PLATFORM
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                            </motion.div>

                            <motion.h1
                                initial={{ opacity: 0, y: 25 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6 }}
                                className="max-w-3xl text-5xl font-black leading-[0.98] tracking-[-0.04em] sm:text-6xl lg:text-7xl"
                            >
                                Practice smarter.
                                <span className="block text-emerald-600">
                                    Interview better.
                                </span>
                            </motion.h1>

                            <motion.p
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.7, delay: 0.1 }}
                                className="mt-7 max-w-2xl text-base leading-7 text-slate-500 sm:text-lg"
                            >
                                Experience realistic mock interviews with AI-powered
                                follow-ups, resume-based questions, adaptive difficulty
                                and real-time voice interaction.
                            </motion.p>

                            <motion.div
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.7, delay: 0.2 }}
                                className="mt-9 flex flex-wrap gap-3"
                            >
                                <motion.button
                                    onClick={() => {
                                        if (!userData) {
                                            setshowAuth(true);
                                            return;
                                        }
                                        navigate("/interview");
                                    }}
                                    whileHover={{ y: -3 }}
                                    whileTap={{ scale: 0.97 }}
                                    className="group flex items-center gap-3 rounded-2xl bg-slate-950 px-6 py-4 text-sm font-bold text-white shadow-xl shadow-slate-900/15 transition"
                                >
                                    <BsMic className="text-emerald-400" />
                                    Start Interview
                                    <span className="transition group-hover:translate-x-1">→</span>
                                </motion.button>

                                <motion.button
                                    onClick={() => {
                                        if (!userData) {
                                            setshowAuth(true);
                                            return;
                                        }
                                        navigate("/history");
                                    }}
                                    whileHover={{ y: -3 }}
                                    whileTap={{ scale: 0.97 }}
                                    className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-6 py-4 text-sm font-bold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
                                >
                                    <BsBarChart />
                                    View History
                                </motion.button>
                            </motion.div>

                            <div className="mt-9 flex flex-wrap gap-x-7 gap-y-3 text-xs font-semibold text-slate-500">
                                {[
                                    "Resume-based",
                                    "Adaptive AI",
                                    "Real-time Voice",
                                    "Performance Report",
                                ].map((item) => (
                                    <span key={item} className="flex items-center gap-2">
                                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                        {item}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* HERO AI CARD */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.94, x: 25 }}
                            animate={{ opacity: 1, scale: 1, x: 0 }}
                            transition={{ duration: 0.7 }}
                            className="relative mx-auto w-full max-w-xl"
                        >
                            <div className="absolute -inset-5 rounded-[40px] bg-emerald-200/40 blur-3xl" />

                            <div className="relative overflow-hidden rounded-[34px] border border-white bg-slate-950 p-4 shadow-2xl">
                                <div className="absolute right-8 top-8 h-32 w-32 rounded-full bg-emerald-400/20 blur-3xl" />

                                <div className="relative flex items-center justify-between px-3 py-2">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-400 text-slate-950">
                                            <BsRobot size={21} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-white">
                                                AI Interviewer
                                            </p>
                                            <p className="text-[10px] text-slate-500">
                                                Adaptive voice session
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1.5 text-[10px] font-bold text-emerald-300">
                                        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                                        LIVE AI
                                    </div>
                                </div>

                                <div className="relative mt-4 overflow-hidden rounded-[27px] border border-white/10 bg-gradient-to-br from-emerald-500/10 to-slate-900">
                                    <img
                                        src={evalImg}
                                        alt="AI interview preview"
                                        className="h-[310px] w-full object-contain opacity-95 sm:h-[350px]"
                                    />

                                    <div className="absolute bottom-4 left-4 right-4 rounded-2xl border border-white/10 bg-slate-950/80 p-4 backdrop-blur-xl">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-slate-500">
                                                    Current session
                                                </p>
                                                <p className="mt-1 text-sm font-bold text-white">
                                                    Listening to your answer...
                                                </p>
                                            </div>
                                            <div className="flex items-end gap-1">
                                                {[8, 18, 12, 24, 15, 21, 9].map((height, i) => (
                                                    <motion.span
                                                        key={i}
                                                        animate={{ height: [height, height + 8, height] }}
                                                        transition={{
                                                            duration: 0.9,
                                                            repeat: Infinity,
                                                            delay: i * 0.08,
                                                        }}
                                                        className="w-1 rounded-full bg-emerald-400"
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-2 p-1 pt-4">
                                    {[
                                        ["30–40", "MIN SESSION"],
                                        ["AI", "ADAPTIVE"],
                                        ["LIVE", "VOICE"],
                                    ].map(([value, label]) => (
                                        <div key={label} className="rounded-2xl bg-white/[0.045] p-3 text-center">
                                            <p className="text-sm font-black text-white">{value}</p>
                                            <p className="mt-1 text-[8px] font-bold tracking-wider text-slate-500">
                                                {label}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* HOW IT WORKS */}
            <section className="border-y border-slate-200 bg-white px-5 py-20 sm:px-8 lg:px-12">
                <div className="mx-auto max-w-7xl">
                    <div className="mx-auto mb-12 max-w-2xl text-center">
                        <p className="text-xs font-black uppercase tracking-[0.2em] text-emerald-600">
                            How it works
                        </p>
                        <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
                            From setup to feedback in one flow.
                        </h2>
                        <p className="mt-4 text-sm leading-6 text-slate-500">
                            A simple three-step experience designed to feel closer to a
                            real interview.
                        </p>
                    </div>

                    <div className="grid gap-4 md:grid-cols-3">
                        {[
                            {
                                icon: <BsRobot />,
                                step: "01",
                                title: "Build your interview",
                                desc: "Select your role, experience and interview mode. Add your resume for personalized questions.",
                            },
                            {
                                icon: <BsMic />,
                                step: "02",
                                title: "Talk to the AI",
                                desc: "Answer naturally through voice while the interviewer adapts follow-ups to your responses.",
                            },
                            {
                                icon: <BsBarChart />,
                                step: "03",
                                title: "Understand your performance",
                                desc: "Review your answers, strengths, weaknesses and improvement areas after the session.",
                            },
                        ].map((item, index) => (
                            <motion.div
                                key={item.step}
                                initial={{ opacity: 0, y: 25 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                whileHover={{ y: -5 }}
                                className="group rounded-[26px] border border-slate-200 bg-[#f9fbfa] p-6 transition hover:border-emerald-200 hover:shadow-xl"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-lg text-emerald-600 transition group-hover:bg-emerald-500 group-hover:text-white">
                                        {item.icon}
                                    </div>
                                    <span className="text-4xl font-black text-slate-100">
                                        {item.step}
                                    </span>
                                </div>
                                <h3 className="mt-7 text-lg font-black">{item.title}</h3>
                                <p className="mt-2 text-sm leading-6 text-slate-500">
                                    {item.desc}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CAPABILITIES */}
            <section className="px-5 py-20 sm:px-8 lg:px-12">
                <div className="mx-auto max-w-7xl">
                    <div className="mb-12 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
                        <div>
                            <p className="text-xs font-black uppercase tracking-[0.2em] text-emerald-600">
                                Platform
                            </p>
                            <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
                                Built for realistic practice.
                            </h2>
                        </div>
                        <p className="max-w-md text-sm leading-6 text-slate-500">
                            Everything you need to practice, review and improve your
                            interview performance.
                        </p>
                    </div>

                    <div className="grid gap-5 md:grid-cols-2">
                        {[
                            {
                                image: evalImg,
                                icon: <BsBarChart />,
                                title: "AI Answer Evaluation",
                                desc: "Evaluate communication, technical accuracy and confidence across your responses.",
                            },
                            {
                                image: resumeImg,
                                icon: <BsFileEarmarkText />,
                                title: "Resume-Based Interview",
                                desc: "Generate questions around your projects, experience and skills instead of generic prompts.",
                            },
                            {
                                image: pdfImg,
                                icon: <BsFileEarmarkText />,
                                title: "Downloadable PDF Report",
                                desc: "Get detailed strengths, weaknesses and improvement insights after your interview.",
                            },
                            {
                                image: historyImg,
                                icon: <BsBarChart />,
                                title: "History & Analytics",
                                desc: "Track previous interviews and understand how your performance changes over time.",
                            },
                        ].map((item, index) => (
                            <motion.div
                                key={item.title}
                                initial={{ opacity: 0, y: 25 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.08 }}
                                whileHover={{ y: -4 }}
                                className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm transition hover:shadow-xl"
                            >
                                <div className="grid items-center gap-5 p-5 sm:grid-cols-[0.9fr_1.1fr] sm:p-7">
                                    <div className="flex h-52 items-center justify-center overflow-hidden rounded-2xl bg-slate-50">
                                        <img
                                            src={item.image}
                                            alt={item.title}
                                            className="h-full w-full object-contain p-4"
                                        />
                                    </div>
                                    <div className="p-2">
                                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                                            {item.icon}
                                        </div>
                                        <h3 className="mt-5 text-xl font-black">{item.title}</h3>
                                        <p className="mt-2 text-sm leading-6 text-slate-500">
                                            {item.desc}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* MODES */}
            <section className="bg-slate-950 px-5 py-20 text-white sm:px-8 lg:px-12">
                <div className="mx-auto max-w-7xl">
                    <div className="mb-12 text-center">
                        <p className="text-xs font-black uppercase tracking-[0.2em] text-emerald-400">
                            Interview modes
                        </p>
                        <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
                            Practice the way you need.
                        </h2>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        {[
                            {
                                image: techImg,
                                title: "Technical Mode",
                                desc: "Role-specific technical questioning.",
                            },
                            {
                                image: hrImg,
                                title: "HR Mode",
                                desc: "Behavioral and communication practice.",
                            },
                            {
                                image: confidenceImg,
                                title: "Voice Insights",
                                desc: "Basic tone and voice analysis insights.",
                            },
                            {
                                image: creditImg,
                                title: "Credit System",
                                desc: "Use credits to unlock interview sessions.",
                            },
                        ].map((item, index) => (
                            <motion.div
                                key={item.title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.08 }}
                                whileHover={{ y: -5 }}
                                className="rounded-[25px] border border-white/10 bg-white/[0.045] p-5 transition hover:border-emerald-400/20 hover:bg-white/[0.07]"
                            >
                                <div className="flex h-40 items-center justify-center rounded-2xl bg-white/[0.04]">
                                    <img
                                        src={item.image}
                                        alt={item.title}
                                        className="h-32 w-32 object-contain"
                                    />
                                </div>
                                <h3 className="mt-5 font-black">{item.title}</h3>
                                <p className="mt-2 text-xs leading-5 text-slate-500">
                                    {item.desc}
                                </p>
                            </motion.div>
                        ))}
                    </div>

                    <div className="mt-12 rounded-[30px] border border-emerald-400/15 bg-gradient-to-r from-emerald-500/10 to-teal-500/5 p-7 text-center sm:p-10">
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-400 text-slate-950">
                            <BsMic size={20} />
                        </div>
                        <h3 className="mt-5 text-2xl font-black">
                            Ready to practice?
                        </h3>
                        <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-400">
                            Start a personalized AI interview and experience adaptive,
                            real-time voice questioning.
                        </p>
                        <motion.button
                            onClick={() => {
                                if (!userData) {
                                    setshowAuth(true);
                                    return;
                                }
                                navigate("/interview");
                            }}
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.98 }}
                            className="mt-6 rounded-2xl bg-emerald-400 px-7 py-3.5 text-sm font-black text-slate-950 shadow-xl shadow-emerald-400/10"
                        >
                            Start Your Interview →
                        </motion.button>
                    </div>
                </div>
            </section>

            {showAuth && <AuthModel onClose={() => setshowAuth(false)} />}
            <Footer />
        </div>
    )
}
