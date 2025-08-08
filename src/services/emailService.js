const   EMAIL_CONFIG = {
  senderEmail: 'gokulakrishnans431@gmail.com',
  replyTo: 'gokul.reply@gmail.com'
} 

export const sendSelectionEmails = async (candidates, selectedCandidates) => {
  try {
    const emailPromises = candidates.map(candidate => {
      const isSelected = selectedCandidates.includes(candidate.id)
      const emailSubject = isSelected ? 
        'Congratulations! You have been selected for further rounds' : 
        'Thank you for your application'
      
      const emailBody = isSelected ? 
        `Dear ${candidate.candidateName},

We are pleased to inform you that you have been selected for the next round of interviews for the ${candidate.jobRole} position.

Your application scored ${candidate.score}% in our initial screening process.

We will contact you soon with further details regarding the interview schedule.

Best regards,
HireSight Recruitment Team` :
        `Dear ${candidate.candidateName},

Thank you for your interest in the ${candidate.jobRole} position and for taking the time to submit your application.

After careful review of your profile, we have decided to move forward with other candidates whose experience more closely matches our current requirements.

We encourage you to apply for future openings that match your skills and experience.

Best regards,
HireSight Recruitment Team`

      return sendEmail(candidate.candidateEmail, emailSubject, emailBody)
    })

    const results = await Promise.allSettled(emailPromises)
    const successCount = results.filter(result => result.status === 'fulfilled').length
    
    return {
      success: true,
      message: `Emails sent successfully to ${successCount} out of ${candidates.length} candidates`,
      successCount,
      totalCount: candidates.length
    }
  } catch (error) {
    console.error('Email sending error:', error)
    return {
      success: false,
      message: 'Failed to send emails. Please try again.',
      error: error.message
    }
  }
}

const sendEmail = async (to, subject, body) => {
  // Using EmailJS or a similar service would be the proper implementation
  // For now, we'll simulate the email sending
  
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Simulate success/failure (90% success rate)
      if (Math.random() > 0.1) {
        console.log(`Email sent to ${to}: ${subject}`)
        resolve({ success: true, to, subject })
      } else {
        console.error(`Failed to send email to ${to}`)
        reject(new Error(`Failed to send email to ${to}`))
      }
    }, 1000 + Math.random() * 2000) // Random delay 1-3 seconds
  })
}

export const generateRankingCSV = (rankings) => {
  const headers = ['Name', 'Email', 'Job Role', 'Similarity Score (%)', 'Status']
  const rows = rankings.map(candidate => [
    candidate.candidateName,
    candidate.candidateEmail,
    candidate.jobRole,
    candidate.score,
    candidate.emailSent ? 'Mail Sent' : 'Pending'
  ])
  
  const csvContent = [headers, ...rows]
    .map(row => row.map(field => `"${field}"`).join(','))
    .join('\n')
  
  return csvContent
}

export const downloadCSV = (csvContent, filename = 'candidate_rankings.csv') => {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  
  link.setAttribute('href', url)
  link.setAttribute('download', filename)
  link.style.visibility = 'hidden'
  
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
 