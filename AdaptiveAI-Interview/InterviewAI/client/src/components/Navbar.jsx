import React, { useState } from "react";
import { motion } from "motion/react";
import { BsRobot, BsCoin, BsClockHistory } from "react-icons/bs";
import { HiOutlineLogout } from "react-icons/hi";
import { FaUserAstronaut, FaChevronDown } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { serverUrl } from "../App";
import { setuserData } from "../redux/userSlice";
import axios from "axios";
import AuthModel from "./AuthModel";

const Navbar = () => {
    const { userData } = useSelector((state) => state.user);

    const [showCreditpopUp, setshowCreditpopUp] = useState(false);
    const [showUserpopUp, setshowUserpopUp] = useState(false);
    const [showAuth, setshowAuth] = useState(false);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleLogOut = async () => {
        try {
            await axios.get(serverUrl + "/api/auth/logout", {
                withCredentials: true,
            });

            dispatch(setuserData(null));

            setshowCreditpopUp(false);
            setshowUserpopUp(false);
            setshowAuth(true);
        } catch (err) {
            console.log(err);
        }
    };

    const handleProfileClick = () => {
        if (!userData) {
            setshowAuth(true);
            return;
        }

        setshowUserpopUp((prev) => !prev);
        setshowCreditpopUp(false);
    };

    const handleCreditClick = () => {
        if (!userData) {
            setshowAuth(true);
            return;
        }

        setshowCreditpopUp((prev) => !prev);
        setshowUserpopUp(false);
    };

    const handleBuyCredits = () => {
        setshowUserpopUp(false);
        setshowCreditpopUp(false);
        navigate("/pricing");
    };

    const handleHistory = () => {
        setshowUserpopUp(false);
        navigate("/history");
    };

    return (
        <div className="bg-[#f7faf8] px-3 pt-4 sm:px-5 sm:pt-5">
            <motion.nav
                initial={{ opacity: 0, y: -25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="relative z-50 mx-auto flex w-full max-w-6xl items-center justify-between rounded-[22px] border border-slate-200 bg-white/95 px-4 py-3 shadow-sm backdrop-blur-xl sm:px-5"
            >
                {/* LOGO */}
                <button
                    type="button"
                    onClick={() => navigate("/")}
                    className="group flex items-center gap-3"
                >
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950 text-white shadow-md transition group-hover:bg-emerald-600">
                        <BsRobot size={19} />
                    </div>

                    <div className="hidden text-left sm:block">
                        <p className="text-sm font-black tracking-tight text-slate-900">
                            InterviewIQ<span className="text-emerald-600">.AI</span>
                        </p>

                        <p className="text-[9px] font-medium uppercase tracking-[0.15em] text-slate-400">
                            AI Interview Platform
                        </p>
                    </div>
                </button>

                {/* RIGHT SIDE */}
                <div className="flex items-center gap-2 sm:gap-3">

                    {/* CREDITS */}
                    <div className="relative">
                        <motion.button
                            type="button"
                            whileTap={{ scale: 0.97 }}
                            onClick={handleCreditClick}
                            className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-bold text-slate-700 transition hover:border-emerald-200 hover:bg-emerald-50"
                        >
                            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                                <BsCoin size={15} />
                            </span>

                            <span className="hidden sm:block">
                                {userData?.credits || 0}
                            </span>

                            <span className="hidden text-xs text-slate-400 sm:block">
                                credits
                            </span>
                        </motion.button>

                        {/* CREDIT POPUP */}
                        {showCreditpopUp && (
                            <motion.div
                                initial={{
                                    opacity: 0,
                                    y: -8,
                                    scale: 0.96,
                                }}
                                animate={{
                                    opacity: 1,
                                    y: 0,
                                    scale: 1,
                                }}
                                transition={{ duration: 0.18 }}
                                className="absolute right-0 mt-3 w-64 overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl"
                            >
                                <div className="rounded-xl bg-emerald-50 p-3">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
                                            <BsCoin size={19} />
                                        </div>

                                        <div>
                                            <p className="text-xs font-bold text-slate-500">
                                                Available Credits
                                            </p>

                                            <p className="text-xl font-black text-slate-900">
                                                {userData?.credits || 0}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <p className="mt-3 text-xs leading-5 text-slate-500">
                                    Need more credits to continue practicing
                                    interviews?
                                </p>

                                <button
                                    type="button"
                                    onClick={handleBuyCredits}
                                    className="mt-4 w-full rounded-xl bg-slate-950 py-3 text-xs font-black text-white transition hover:bg-emerald-600"
                                >
                                    Buy More Credits →
                                </button>
                            </motion.div>
                        )}
                    </div>

                    {/* PROFILE */}
                    <div className="relative">
                        <motion.button
                            type="button"
                            whileTap={{ scale: 0.95 }}
                            onClick={handleProfileClick}
                            className="flex items-center gap-2 rounded-full border border-slate-200 bg-white p-1.5 pr-2 transition hover:border-emerald-200 hover:shadow-sm"
                        >
                            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-950 text-sm font-black text-white">
                                {userData ? (
                                    userData?.name
                                        ?.slice(0, 1)
                                        .toUpperCase()
                                ) : (
                                    <FaUserAstronaut size={15} />
                                )}
                            </span>

                            {userData && (
                                <span className="hidden max-w-[100px] truncate text-xs font-bold text-slate-700 sm:block">
                                    {userData?.name}
                                </span>
                            )}

                            {userData && (
                                <FaChevronDown
                                    size={9}
                                    className={`hidden text-slate-400 transition sm:block ${showUserpopUp ? "rotate-180" : ""
                                        }`}
                                />
                            )}
                        </motion.button>

                        {/* PROFILE DROPDOWN */}
                        {showUserpopUp && userData && (
                            <motion.div
                                initial={{
                                    opacity: 0,
                                    y: -8,
                                    scale: 0.96,
                                }}
                                animate={{
                                    opacity: 1,
                                    y: 0,
                                    scale: 1,
                                }}
                                transition={{ duration: 0.18 }}
                                className="absolute right-0 mt-3 w-64 overflow-hidden rounded-2xl border border-slate-200 bg-white p-3 shadow-2xl"
                            >
                                {/* USER INFO */}
                                <div className="mb-2 rounded-xl bg-slate-50 p-3">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-950 text-sm font-black text-white">
                                            {userData?.name
                                                ?.slice(0, 1)
                                                .toUpperCase()}
                                        </div>

                                        <div className="min-w-0">
                                            <p className="truncate text-sm font-black text-slate-900">
                                                {userData?.name}
                                            </p>

                                            <p className="truncate text-[10px] text-slate-400">
                                                {userData?.email || "Account"}
                                            </p>
                                        </div>
                                    </div>

                                    {/* CREDIT INFO */}
                                    <div className="mt-3 flex items-center justify-between rounded-lg bg-white px-3 py-2">
                                        <span className="text-[10px] font-bold text-slate-400">
                                            Available credits
                                        </span>

                                        <span className="flex items-center gap-1 text-xs font-black text-emerald-600">
                                            <BsCoin size={13} />
                                            {userData?.credits || 0}
                                        </span>
                                    </div>
                                </div>

                                {/* BUY CREDITS */}
                                <button
                                    type="button"
                                    onClick={handleBuyCredits}
                                    className="group flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition hover:bg-emerald-50"
                                >
                                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 transition group-hover:bg-emerald-500 group-hover:text-white">
                                        <BsCoin size={17} />
                                    </span>

                                    <span className="flex-1">
                                        <span className="block text-xs font-black text-slate-800">
                                            Buy Credits
                                        </span>

                                        <span className="mt-0.5 block text-[10px] text-slate-400">
                                            Get more interview credits
                                        </span>
                                    </span>

                                    <span className="text-slate-300 transition group-hover:translate-x-1 group-hover:text-emerald-500">
                                        →
                                    </span>
                                </button>

                                {/* INTERVIEW HISTORY */}
                                <button
                                    type="button"
                                    onClick={handleHistory}
                                    className="group flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition hover:bg-slate-50"
                                >
                                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500 transition group-hover:bg-slate-200">
                                        <BsClockHistory size={17} />
                                    </span>

                                    <span className="flex-1">
                                        <span className="block text-xs font-black text-slate-800">
                                            Interview History
                                        </span>

                                        <span className="mt-0.5 block text-[10px] text-slate-400">
                                            View your previous interviews
                                        </span>
                                    </span>

                                    <span className="text-slate-300 transition group-hover:translate-x-1">
                                        →
                                    </span>
                                </button>

                                {/* DIVIDER */}
                                <div className="my-2 h-px bg-slate-100" />

                                {/* LOGOUT */}
                                <button
                                    type="button"
                                    onClick={handleLogOut}
                                    className="group flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition hover:bg-red-50"
                                >
                                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-500 transition group-hover:bg-red-100">
                                        <HiOutlineLogout size={18} />
                                    </span>

                                    <span>
                                        <span className="block text-xs font-black text-red-500">
                                            Logout
                                        </span>

                                        <span className="mt-0.5 block text-[10px] text-slate-400">
                                            Sign out of your account
                                        </span>
                                    </span>
                                </button>
                            </motion.div>
                        )}
                    </div>
                </div>
            </motion.nav>

            {/* AUTH MODAL */}
            {showAuth && (
                <AuthModel onClose={() => setshowAuth(false)} />
            )}
        </div>
    );
};

export default Navbar;