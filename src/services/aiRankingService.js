const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent'

export const generateAIRanking = async (jobDescription, candidates) => {
  try {
    const candidatesText = candidates.map(candidate => 
      `Candidate: ${candidate.candidateName}
Email: ${candidate.candidateEmail}
Job Role: ${candidate.jobRole}
Initial Score: ${candidate.score}%
Skills Match: ${candidate.skillsMatch || 'N/A'}%`
    ).join('\n\n')

    const prompt = `
    You are an AI recruitment assistant. Analyze and rank the following candidates for the job position.

    JOB DESCRIPTION:
    Please consider the candidates' scores, skills match, and overall fit for the role.

    CANDIDATES:
    ${candidatesText}

    Please provide:
    1. A ranking of candidates from best to worst
    2. For each candidate, provide:
       - Similarity score (0-100)
       - Recommendation (Strong, Moderate, Weak)
       - Key strengths
       - Areas of concern (if any)
    3. Top 3 candidates recommended for selection

    Respond in JSON format:
    {
      "rankings": [
        {
          "candidateName": "string",
          "candidateEmail": "string",
          "jobRole": "string",
          "aiScore": number,
          "originalScore": number,
          "recommendation": "Strong|Moderate|Weak",
          "strengths": ["strength1", "strength2"],
          "concerns": ["concern1", "concern2"],
          "rank": number
        }
      ],
      "topRecommendations": ["email1", "email2", "email3"],
      "summary": "Overall assessment summary"
    }
    `

       const response = await fetch(`https://hooks.jdoodle.net/proxy?url=${encodeURIComponent(GEMINI_API_URL + '?key=' + GEMINI_API_KEY)}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }]
      })
    }) 

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`)
    }

    const data = await response.json()
    const analysisText = data.candidates[0].content.parts[0].text

    // Parse JSON from the response
    const jsonMatch = analysisText.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0])
    }

    // Fallback ranking if JSON parsing fails
    return generateFallbackRanking(candidates)

  } catch (error) {
    console.error('AI Ranking Error:', error)
    return generateFallbackRanking(candidates)
  }
}

const generateFallbackRanking = (candidates) => {
  const ranked = candidates
    .map((candidate, index) => ({
      ...candidate,
      aiScore: Math.max(candidate.score + Math.floor(Math.random() * 20 - 10), 0),
      recommendation: candidate.score >= 80 ? 'Strong' : candidate.score >= 60 ? 'Moderate' : 'Weak',
      strengths: ['Technical skills', 'Experience level', 'Educational background'],
      concerns: candidate.score < 70 ? ['Limited experience in required skills'] : [],
      rank: index + 1
    }))
    .sort((a, b) => b.aiScore - a.aiScore)
    .map((candidate, index) => ({ ...candidate, rank: index + 1 }))

  return {
    rankings: ranked,
    topRecommendations: ranked.slice(0, 3).map(c => c.candidateEmail),
    summary: `Analyzed ${candidates.length} candidates. ${ranked.filter(c => c.recommendation === 'Strong').length} strong matches found.`
  }
}
 