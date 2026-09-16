// is package ke through we can read our file and can able to delete also
const fs = require("fs");

const { askAi } = require("../services/openRouter.services");
const pdfjsLib = require("pdfjs-dist/legacy/build/pdf.mjs");
const User = require("../models/user")
const Interview = require("../models/interview.model")



const analayzeResume = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Resume required"
            });
        }

        // 1️⃣ Multer ne jo file upload karwayi hai, uska temporary/local path le rahe hain
        // Example: "uploads/resume.pdf"
        const filePath = req.file.path;


        // 2️⃣ Ab us path se actual file ko read karke BUFFER mein convert kar rahe hain
        // Buffer = file ka raw binary data (0s & 1s jaisa data)
        // PDF ko process karne ke liye humein file ka actual data chahiye
        const fileBuffer = await fs.promises.readFile(filePath);


        // 3️⃣ Buffer ko Uint8Array mein convert kar rahe hain
        // PDF.js PDF data ko Uint8Array format mein accept karta hai
        // Buffer → Uint8Array
        const uint8Array = new Uint8Array(fileBuffer);


        // 4️⃣ Ab PDF.js ko PDF ka binary data dekar PDF document load kar rahe hain
        // .promise ka wait isliye kyunki PDF loading asynchronous hai
        // pdf = loaded PDF document
        const pdf = await pdfjsLib.getDocument({
            data: uint8Array
        }).promise;


        let resumeText = "";

        // Extract text from all pages and add gap among all text
        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {

            // Fetching text from current page
            const page = await pdf.getPage(pageNum);

            const content = await page.getTextContent();

            // Separating all text items
            const pageText = content.items
                .map(item => item.str)
                .join(" ");

            // += important hai
            // Isse previous page ka text delete/overwrite nahi hoga
            resumeText += pageText + "\n";
        }


        // Extra spaces/new lines ko clean kar rahe hain
        resumeText = resumeText.replace(/\s+/g, " ").trim();


        const messages = [
            {
                role: "system",
                content: `
                Extract structured data from resume.

                Return strictly valid JSON:

                {
                    "role": "string",
                    "experience": "string",
                    "projects": ["project1", "project2"],
                    "skills": ["skill1", "skill2"]
                }
                `
            },
            {
                role: "user",
                content: resumeText
            }
        ];


        // AI ko resume ka extracted text bhej rahe hain
        const aiResponse = await askAi(messages);

        // AI response ko clean kar rahe hain
        // Kabhi-kabhi AI JSON ko ```json ... ``` ke andar return karta hai
        const cleanedResponse = aiResponse
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .trim();


        // AI ke JSON string ko JavaScript object mein convert kar rahe hain
        const parsed = JSON.parse(cleanedResponse);


        // Analysis complete hone ke baad uploaded PDF ko delete kar rahe hain
        await fs.promises.unlink(filePath);


        // Frontend ko extracted + AI analysed data bhej rahe hain
        return res.json({
            role: parsed.role,
            experience: parsed.experience,
            projects: parsed.projects,
            skills: parsed.skills,
            resumeText
        });


    } catch (err) {

        console.log(
            "Problem during analysis in resume",
            err
        );


        // Agar analysis ke beech error aa gaya
        // toh uploaded file ko delete kar denge
        // warna storage mein unnecessary files accumulate hoti rahengi
        if (req.file && fs.existsSync(req.file.path)) {
            try {
                await fs.promises.unlink(req.file.path);
            } catch (deleteError) {
                console.log(
                    "Problem deleting uploaded resume",
                    deleteError.message
                );
            }
        }


        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
};


const generateQuestions = async (req, res) => {
    try {
        let {role , experience , mode , resumeText , projects , skills} = req.body;

        role = role?.trim();
        experience = experience?.trim();
        mode = mode?.trim();

        if (!role || !experience || !mode) {
            return res.status(400).json({
                message: "Role , mode and experience are Required"
            });
        }


        const user = await User.findById(req.userId);

        if (!user) {
            return res.status(400).json({
                message: "User not found"
            });
        }


        if (user.credits < 50) {
            return res.status(400).json({
                message: "Not enough credits . minimun 50 are required"
            });
        }


        const projectText =
            Array.isArray(projects) && projects.length
                ? projects.join(", ")
                : "None";

        const skillText =
            Array.isArray(skills) && skills.length
                ? skills.join(", ")
                : "None";

        const safeResume =
            resumeText?.trim() || "None";


        const userPrompt = `
Role:${role}
Experience:${experience}
InterviewMode:${mode}
Projects:${projectText}
Skills:${skillText}
Resume:${safeResume}
`;


        if (!userPrompt.trim()) {
            return res.status(400).json({
                message: "Prompt content is empty."
            });
        }


        const messages = [
            {
                role: "system",
                content: `
You are a real human interviewer conducting a professional interview.

Speak in simple, natural English as if you are directly talking to the candidate.

Generate exactly 5 interview questions.

Strict Rules:
- Each question must contain between 15 and 25 words.
- Each question must be a single complete sentence.
- Do NOT number them.
- Do NOT add explanations.
- Do NOT add extra text before or after.
- One question per line only.
- Keep language simple and conversational.
- Questions must feel practical and realistic.

Difficulty progression:
Question 1 ->easy
Question 2 ->medium
Question 3 ->medium
Question 4 ->Hard
Question 5 ->Hard

Make questions based on the candidate role , experience , interviewMode , projects , skills , and their resume details.
`
            },
            {
                role: "user",
                content: userPrompt
            }
        ];


        const aiResponse = await askAi(messages);


        if (!aiResponse || !aiResponse.trim()) {
            return res.status(500).json({
                message: "AI returned empty resposne"
            });
        }


        const questionArray = aiResponse
            .split("\n")
            .map(q => q.trim())
            .filter(q => q.length > 0)
            .slice(0, 5);


        if (questionArray.length == 0) {
            return res.status(500).json({
                message: "AI failed to generate questions"
            });
        }


        const interview = await Interview.create({
            userId: user._id,
            role,
            experience,
            mode,
            resumeText: safeResume,

            questions: questionArray.map((q, index) => ({
                question: q,
                difficulty: ["easy","medium","medium","hard","hard"][index] , timeLimit: [60,90,90,120,120][index],
            }))
        });

        // Deduct credits only after the interview was created successfully.
        user.credits -= 50;
        await user.save();


        return res.json({
            interviewId: interview._id,
            creditsLeft: user.credits,
            userName: user.name,
            role,
            experience,
            mode,
            resumeText: safeResume,
            projects: Array.isArray(projects) ? projects : [],
            skills: Array.isArray(skills) ? skills : [],
            questions: interview.questions
        });


    } catch (err) {
        console.error("Failed to create interview:", err);

        return res.status(500).json({
            success: false,
             message: `Failed to create the interview: ${err.message}`
        });
    }
};

// submit answer

 const submitAnswer = async (req, res) => {
    try {
        const { interviewId, questionIndex, answer, timeTaken } = req.body;

        const interview = await Interview.findById(interviewId);
        const question = interview.questions[questionIndex];

        // If no answer
        if (!answer) {
            question.score = 0;
            question.feedback = "You did not submit an answer.";
            question.answer = "";

            await interview.save();

            return res.json({
                feedback: question.feedback
            });
        }

        const messages = [
            {
                role: "system",
                content: `
You are a professional human interviewer evaluating a candidate's answer in a real interview.

Evaluate naturally and fairly, like a real person would.

Score the answer in these areas (0 to 10):

1. Confidence - Does the answer sound clear, confident, and well-presented?
2. Communication - Is the language simple, clear, and easy to understand?
3. Correctness - Is the answer accurate, relevant, and complete?

Rules:
- Be realistic and unbiased.
- Do not give random high scores.
- If the answer is weak, score low.
- If the answer is strong and detailed, score high.
- Consider clarity, structure, and relevance.

Calculate:
finalScore = average of confidence, communication, and correctness (rounded to nearest whole number).

Feedback Rules:
- Write natural human feedback.
- 10 to 15 words only.
- Sound like real interview feedback.
- Can suggest improvement if needed.
- Do NOT repeat the question.
- Do NOT explain scoring.
- Keep tone professional and honest.

Return ONLY valid JSON in this format:

{
    "confidence": number,
    "communication": number,
    "correctness": number,
    "finalScore": number,
    "feedback": "short human feedback"
}
`
            },
            {
                role: "user",
                content: `
Question: ${question.question}
Answer: ${answer}
`
            }
        ];

        const aiResponse = await askAi(messages);

        const parsed = JSON.parse(aiResponse);

        question.answer = answer;
        question.confidence = parsed.confidence;
        question.communication = parsed.communication;
        question.correctness = parsed.correctness;
        question.score = parsed.finalScore;
        question.feedback = parsed.feedback;

        await interview.save();

        return res.status(200).json({
            feedback : parsed.feedback
        })

    } catch (error) {
        return res.status(500).json({
            message : `failed to submit the answer ${error}`
        })
    }
}

 const finishInterview = async (req, res) => {
  try {
    const { interviewId } = req.body;

    const interview = await Interview.findById(interviewId);

    if (!interview) {
      return res
        .status(400)
        .json({ message: "failed to find Interview" });
    }

    const totalQuestions = interview.questions.length;

    let totalScore = 0;
    let totalConfidence = 0;
    let totalCommunication = 0;
    let totalCorrectness = 0;

    interview.questions.forEach((q) => {
      totalScore += q.score || 0;
      totalConfidence += q.confidence || 0;
      totalCommunication += q.communication || 0;
      totalCorrectness += q.correctness || 0;
    });

    const finalScore = totalQuestions
      ? totalScore / totalQuestions
      : 0;

    const avgConfidence = totalQuestions
      ? totalConfidence / totalQuestions
      : 0;

    const avgCommunication = totalQuestions
      ? totalCommunication / totalQuestions
      : 0;

    const avgCorrectness = totalQuestions
      ? totalCorrectness / totalQuestions
      : 0;

    interview.finalScore = finalScore;
    interview.status = "completed";

    await interview.save();

    return res.status(200).json({
      finalScore: Number(finalScore.toFixed(1)),
      confidence: Number(avgConfidence.toFixed(1)),
      communication: Number(avgCommunication.toFixed(1)),
      correctness: Number(avgCorrectness.toFixed(1)),

      questionWiseScore: interview.questions.map((q) => ({
        question: q.question,
        score: q.score || 0,
        feedback: q.feedback || "",
        confidence: q.confidence || 0,
        communication: q.communication || 0,
        correctness: q.correctness || 0,
      })),
    });
  } catch (error) {
    // error handling
    return res.status(400).json({
        message : "Failed to find Interview"
    })
  }
};



// Finish a Vapi voice interview and build the final adaptive-interview report.
const finishVoiceInterview = async (req, res) => {
  try {
    const { interviewId, transcript = [], durationSeconds = 0 } = req.body;

    if (!interviewId) {
      return res.status(400).json({ message: "Interview ID is required." });
    }

    const interview = await Interview.findOne({
      _id: interviewId,
      userId: req.userId,
    });

    if (!interview) {
      return res.status(404).json({ message: "Interview not found." });
    }

    const cleanTranscript = Array.isArray(transcript)
      ? transcript
          .filter((item) => item && item.content)
          .map((item) => ({
            role: item.role === "assistant" ? "assistant" : "user",
            content: String(item.content).trim(),
            timestamp: item.timestamp || new Date().toISOString(),
          }))
          .slice(-250)
      : [];

    if (!cleanTranscript.length) {
      return res.status(400).json({
        message: "No voice transcript was captured. Please try the interview again.",
      });
    }

    const transcriptText = cleanTranscript
      .map((item) => `${item.role.toUpperCase()}: ${item.content}`)
      .join("\n");

    const starterQuestions = interview.questions
      .map((q, index) => `${index + 1}. ${q.question}`)
      .join("\n");

    const messages = [
      {
        role: "system",
        content: `
You are a senior human interviewer creating a final performance report from a completed voice interview.

The interview was adaptive. The interviewer could ask follow-ups, clarify weak answers, skip a topic after repeated difficulty, or create a new question. Therefore, DO NOT assume there were only five questions.

Read the complete transcript and infer the meaningful interview question/answer pairs. Ignore greetings, filler, and duplicate conversational acknowledgements.

Return ONLY valid JSON. No markdown, no code fences, no explanation.

JSON shape:
{
  "finalScore": number,
  "confidence": number,
  "communication": number,
  "correctness": number,
  "questionWiseScore": [
    {
      "question": "string",
      "answer": "string",
      "score": number,
      "feedback": "string",
      "confidence": number,
      "communication": number,
      "correctness": number,
      "difficulty": "easy|medium|hard"
    }
  ]
}

Scoring:
- Every numeric score must be between 0 and 10.
- confidence evaluates clarity, confidence, structure and delivery inferred from the transcript.
- communication evaluates understandable, concise and professional communication.
- correctness evaluates technical/factual correctness and relevance.
- score is the overall score for that question/answer.
- Do not give inflated scores.
- Feedback must be concise, specific and useful to a student.
- If the candidate gave a weak answer, say what was missing instead of insulting them.
- If an answer was incomplete but the interviewer asked a follow-up, evaluate the combined answer fairly.
- finalScore and the three overall metrics should be averages of the meaningful evaluated turns.
- If there are no meaningful answers, return zeros and an empty questionWiseScore array.
`,
      },
      {
        role: "user",
        content: `
Role: ${interview.role}
Experience: ${interview.experience}
Interview mode: ${interview.mode}
Starter questions:
${starterQuestions}

Transcript:
${transcriptText}
`,
      },
    ];

    const aiResponse = await askAi(messages);
    const cleaned = aiResponse
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

    let report;
    try {
      report = JSON.parse(cleaned);
    } catch (parseError) {
      const start = cleaned.indexOf("{");
      const end = cleaned.lastIndexOf("}");
      if (start === -1 || end === -1) throw parseError;
      report = JSON.parse(cleaned.slice(start, end + 1));
    }

    const clamp = (value) => Math.min(10, Math.max(0, Number(value) || 0));

    const questionWiseScore = Array.isArray(report.questionWiseScore)
      ? report.questionWiseScore.map((item) => ({
          question: String(item.question || "Interview question"),
          answer: String(item.answer || ""),
          score: clamp(item.score),
          feedback: String(item.feedback || ""),
          confidence: clamp(item.confidence),
          communication: clamp(item.communication),
          correctness: clamp(item.correctness),
          difficulty: ["easy", "medium", "hard"].includes(item.difficulty)
            ? item.difficulty
            : "medium",
          timeLimit: 0,
        }))
      : [];

    const avg = (key) => {
      if (!questionWiseScore.length) return 0;
      return questionWiseScore.reduce((sum, item) => sum + item[key], 0) / questionWiseScore.length;
    };

    const finalScore = questionWiseScore.length
      ? avg("score")
      : clamp(report.finalScore);

    const confidence = questionWiseScore.length ? avg("confidence") : clamp(report.confidence);
    const communication = questionWiseScore.length ? avg("communication") : clamp(report.communication);
    const correctness = questionWiseScore.length ? avg("correctness") : clamp(report.correctness);

    interview.questions = questionWiseScore;
    interview.voiceTranscript = cleanTranscript;
    interview.durationSeconds = Math.max(0, Number(durationSeconds) || 0);
    interview.finalScore = finalScore;
    interview.status = "completed";

    await interview.save();

    return res.status(200).json({
      finalScore: Number(finalScore.toFixed(1)),
      confidence: Number(confidence.toFixed(1)),
      communication: Number(communication.toFixed(1)),
      correctness: Number(correctness.toFixed(1)),
      durationSeconds: interview.durationSeconds,
      questionWiseScore: questionWiseScore.map((q) => ({
        question: q.question,
        answer: q.answer,
        score: q.score,
        feedback: q.feedback,
        confidence: q.confidence,
        communication: q.communication,
        correctness: q.correctness,
        difficulty: q.difficulty,
      })),
    });
  } catch (error) {
    console.error("Failed to finish Vapi voice interview:", error);
    return res.status(500).json({
      message: error.message || "Failed to generate voice interview report.",
    });
  }
};

const getMyInterviews = async(req , res)=>{
    try{
        const interviews = await Interview.find({ userId: req.userId })
            .sort({ createdAt: -1 })
            .select("role experience mode finalScore status createdAt");
        return res.status(200).json(interviews)
    }catch(err){
        return res.status(500).json({
            message : `failed to find currentUser Interview ${err}`
        })
    }
}

const getInterviewReport = async(req , res)=>{
    try{
        const interview = await Interview.findById(req.params.id)

        if(!interview){
            return res.status(404).json({
                message : "Interview not found"
            })
        }

         const totalQuestions = interview.questions.length;

    let totalConfidence = 0;
    let totalCommunication = 0;
    let totalCorrectness = 0;

    interview.questions.forEach((q) => {
      totalConfidence += q.confidence || 0;
      totalCommunication += q.communication || 0;
      totalCorrectness += q.correctness || 0;
    });

    const avgConfidence = totalQuestions
      ? totalConfidence / totalQuestions
      : 0;

    const avgCommunication = totalQuestions
      ? totalCommunication / totalQuestions
      : 0;

    const avgCorrectness = totalQuestions
      ? totalCorrectness / totalQuestions
      : 0;

      return res.json({
        finalScore : interview.finalScore,
        confidence : Number(avgConfidence.toFixed(1)),
        communication : Number(avgCommunication.toFixed(1)),
        correctness : Number(avgCorrectness.toFixed(1)),
        questionWiseScore : interview.questions
      });

    }catch(err){
        console.log(500).json({
            message : `failed to get Report of interview ${err}`
        })
    }
}
// CommonJS mein function export
module.exports = {
    analayzeResume,
    generateQuestions,
    submitAnswer,
    finishInterview,
    finishVoiceInterview,
    getMyInterviews,
    getInterviewReport
};


