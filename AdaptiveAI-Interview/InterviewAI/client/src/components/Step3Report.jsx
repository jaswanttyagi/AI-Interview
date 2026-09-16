import React from 'react'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { buildStyles, CircularProgressbar } from 'react-circular-progressbar';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import 'react-circular-progressbar/dist/styles.css';

function Step3Report({ report }) {
  const navigate = useNavigate();

  if (!report) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className='text-gray-500 text-lg'>
          Loading Report...
        </p>

      </div>
    );
  }
  const {
    finalScore = 0,
    confidence = 0,
    communication = 0,
    correctness = 0,
    questionWiseScore = [],
  } = report;

  const questionScoreData = questionWiseScore.map((question, index) => ({
    name: `Q${index + 1}`,
    score: question.score || 0,
  }));

  const skills = [
    { label: "Confidence", value: confidence },
    { label: "Communication", value: communication },
    { label: "Correctness", value: correctness },
  ];

  let performanceText = "";
  let shortTagline = "";

  if (finalScore >= 8) {
    performanceText = "Ready for job opportunities.";
    shortTagline = "Excellent clarity and structured responses.";
  } else if (finalScore >= 5) {
    performanceText = "Needs minor improvement before interviews.";
    shortTagline = "Good foundation, refine articulation.";
  } else {
    performanceText = "Significant improvement required.";
    shortTagline = "Work on clarity and confidence.";
  }

  const score = finalScore;
  const percentage = (score / 10) * 100;

  const downloadPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(20);
    doc.text("AI Interview Performance Report", 14, 20);
    doc.setFontSize(10);
    doc.text(`Overall Score: ${Number(score).toFixed(1)}/10`, 14, 29);
    doc.text(`Confidence: ${Number(confidence).toFixed(1)}/10`, 14, 36);
    doc.text(`Communication: ${Number(communication).toFixed(1)}/10`, 14, 43);
    doc.text(`Correctness: ${Number(correctness).toFixed(1)}/10`, 14, 50);

    autoTable(doc, {
      startY: 60,
      head: [["Question", "Score", "Feedback"]],
      body: questionWiseScore.map((item) => [
        item.question || "",
        `${Number(item.score || 0).toFixed(1)}/10`,
        item.feedback || "",
      ]),
      styles: { fontSize: 8, cellPadding: 3 },
      headStyles: { fillColor: [16, 185, 129] },
      columnStyles: { 0: { cellWidth: 65 }, 1: { cellWidth: 20 }, 2: { cellWidth: 95 } },
    });

    doc.save(`AI-Interview-Report-${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-green-50 px-4 sm:px-6 lg:px-10 py-8">

      <div className='mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-center gap-4'>

        <div className="md:mb-10 w-full flex items-start gap-4 flex-wrap">
          <button
            onClick={() => navigate("/history")}
            className="mt-1 p-3 rounded-full bg-white shadow hover:shadow-md transition"
          >
            <FaArrowLeft className="text-gray-600" />
          </button>

          <div>
            <h1 className="text-3xl font-bold flex-nowrap text-gray-800">
              Interview Analytics Dashboard
            </h1>

            <p className="text-gray-500 mt-2">
              AI-powered performance insights
            </p>
          </div>
        </div>

        <button onClick={downloadPDF} className='bg-emerald-600 hover:bg-emerald-700 text-white py-3 px-5 rounded-xl shadow-md transition-all duration-300 font-semibold text-sm sm:text-base text-nowrap'>Download PDF</button>
      </div>

      {/* Overall score card */}
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-start'>
        <div className='w-full max-w-sm space-y-6'>
        <motion.div
        initial = {{opacity : 0}}
        animate = {{opacity:1}}
        className='w-full bg-white rounded-2xl sm:rounded-3xl shadow-lg border border-gray-100 p-6 sm:p-8 text-center'
        >
          <p className="mb-4 text-sm font-semibold text-gray-700">Overall Score</p>

          <div className='w-28 h-28 mx-auto'>
            <CircularProgressbar value={percentage} text={`${score}/10`}
                styles={buildStyles({
                  textSize : "15px",
                  pathColor : "#10b981",
                  textColor : "#ef4444",
                  trailColor : "#e5e7eb",
                })}
                />
          </div>

          <p className="text-gray-400 mt-3 text-xs sm:text-sm">
            Out of 10
          </p>

          <div className="mt-4">
            <p className="font-semibold text-gray-800 text-sm sm:text-base">
              {performanceText}
            </p>

            <p className="text-gray-500 text-xs sm:text-sm mt-1">
              {shortTagline}
            </p>
          </div>
        </motion.div>
          <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="w-full max-w-sm bg-white rounded-2xl sm:rounded-3xl shadow-lg border border-gray-100 p-6 sm:p-8"
        >
          <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-6">
            Skill Evaluation
          </h3>

          <div className="space-y-5">
            {skills.map((skill) => {
              const value = Math.min(Math.max(Number(skill.value) || 0, 0), 10);

              return (
                <div key={skill.label}>
                  <div className="flex justify-between mb-2 text-sm sm:text-base">
                    <span className="text-gray-600">{skill.label}</span>
                    <span className="font-semibold text-green-600">{value}/10</span>
                  </div>

                  <div className="bg-gray-200 h-2 sm:h-3 rounded-full overflow-hidden">
                    <div
                      className="bg-green-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${value * 10}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
          </motion.div>

        </div>

        <div className='lg:col-span-2 space-y-6'>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-2xl sm:rounded-3xl shadow-lg border border-gray-100 p-5 sm:p-8"
          >
            <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-4 sm:mb-6">
              Performance Trend
            </h3>

            <div className="h-64 sm:h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={questionScoreData} margin={{ top: 10, right: 12, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="name" />
                  <YAxis domain={[0, 10]} allowDecimals={false} />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="score"
                    stroke="#22c55e"
                    fill="#bbf7d0"
                    strokeWidth={3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-2xl sm:rounded-3xl shadow-lg border border-gray-100 p-5 sm:p-8"
          >
            <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-5 sm:mb-6">Question Breakdown</h3>

            <div className="space-y-4">
              {questionWiseScore.length ? questionWiseScore.map((question, index) => (
                <article key={question._id || index} className="rounded-2xl border border-gray-100 bg-gray-50 p-4 sm:p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-medium text-gray-400">Question {index + 1}</p>
                      <p className="mt-1 text-sm sm:text-base font-semibold leading-relaxed text-gray-800">{question.question}</p>
                    </div>
                    <span className="shrink-0 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                      {Number(question.score || 0).toFixed(1)}/10
                    </span>
                  </div>

                  <div className="mt-4 rounded-xl border border-emerald-100 bg-emerald-50 p-3 sm:p-4">
                    <p className="text-xs font-semibold text-emerald-600">AI Feedback</p>
                    <p className="mt-1 text-sm leading-relaxed text-gray-700">
                      {question.feedback || "No feedback is available for this answer."}
                    </p>
                  </div>
                </article>
              )) : (
                <p className="text-sm text-gray-500">Question details are not available for this interview.</p>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default Step3Report
