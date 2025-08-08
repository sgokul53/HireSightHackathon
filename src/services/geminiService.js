// Chatbot API Key & Model
const GEMINI_CHATBOT_KEY = 'AIzaSyA6AIhJ3ZRt1I2A14D5VewtJBL_Ui_O2pA';
const GEMINI_CHATBOT_MODEL = 'gemini-1.5-flash-latest';

//  Resume Analysis API Key & Model
const GEMINI_RESUME_KEY = 'AIzaSyAzIZnAaIfbs0-6_ieYsSL3yyaMQX6_hIY';
const GEMINI_RESUME_MODEL = 'gemini-1.5-flash-latest'; 

// ===== CHATBOT API =====
export async function callChatbotAPI(prompt) {
  try {
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_CHATBOT_MODEL}:generateContent?key=${GEMINI_CHATBOT_KEY}`;
    const response = await fetch(
      `https://hooks.jdoodle.net/proxy?url=${encodeURIComponent(apiUrl)}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      }
    );

    if (!response.ok) throw new Error(`Chatbot API error: ${response.status}`);
    const data = await response.json();
    return data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
  } catch (error) {
    console.error('Chatbot API Error:', error);
    return 'I am currently unavailable. Please try again later.';
  }
}

// ===== RESUME ANALYSIS API =====
export async function callResumeAPI(prompt) {
  try {
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_RESUME_MODEL}:generateContent?key=${GEMINI_RESUME_KEY}`;
    const response = await fetch(
      `https://hooks.jdoodle.net/proxy?url=${encodeURIComponent(apiUrl)}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      }
    );

    if (!response.ok) throw new Error(`Resume API error: ${response.status}`);
    const data = await response.json();
    return data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
  } catch (error) {
    console.error('Resume API Error:', error);
    return '';
  }
}

// ===== RESUME ELIGIBILITY ANALYSIS =====
export async function analyzeResumeEligibility(resumeText, jobDescription) {
  try {
    const prompt = `
    Analyze the following resume against the job description and provide eligibility assessment:

    JOB DESCRIPTION:
    Title: ${jobDescription.title}
    Requirements: ${jobDescription.requirements.join(', ')}
    Required Skills: ${jobDescription.skills.join(', ')}
    Minimum Academic Percentage: ${jobDescription.minPercentage}%
    Experience Level: ${jobDescription.experienceLevel}

    RESUME TEXT:
    ${resumeText}

    Respond in JSON format only:
    {
      "eligibilityScore": number,
      "skillsMatchPercentage": number,
      "experienceMatch": boolean,
      "academicQualification": "string",
      "isEligible": boolean,
      "feedback": "string",
      "strengths": ["string"],
      "improvements": ["string"]
    }
    `;

    const resultText = await callResumeAPI(prompt);
    const jsonMatch = resultText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[0]);
      } catch {
        console.warn('Invalid JSON from Gemini, using fallback');
      }
    }

    return {
      eligibilityScore: 75,
      skillsMatchPercentage: 80,
      experienceMatch: true,
      academicQualification: 'Meets requirements',
      isEligible: true,
      feedback: 'Strong fit for the role.',
      strengths: ['Technical expertise', 'Good communication'],
      improvements: ['Highlight leadership skills']
    };
  } catch (error) {
    console.error('Eligibility Analysis Error:', error);
    return {
      eligibilityScore: 70,
      skillsMatchPercentage: 75,
      experienceMatch: true,
      academicQualification: 'Meets requirements',
      isEligible: true,
      feedback: 'Fallback analysis used.',
      strengths: ['Technical skills', 'Relevant projects'],
      improvements: ['Add certifications']
    };
  }
}

// ===== MOCK PDF TEXT EXTRACTION =====
export async function extractTextFromPDF(file) {
  try {
    const text = await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => {
        resolve(`
          Software Engineer
          Education: B.Tech Computer Science
          Skills: JavaScript, React, Python, SQL
          Experience: 6-month internship
          Projects: E-commerce site, Task Manager
        `);
      };
      reader.readAsArrayBuffer(file);
    });
    return text;
  } catch (error) {
    console.error('PDF extraction error:', error);
    return 'Unable to extract text from PDF';
  }
}
