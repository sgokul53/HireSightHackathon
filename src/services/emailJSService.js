import  emailjs from '@emailjs/browser'

const EMAILJS_CONFIG = {
  serviceId: 'service_e10g3vi',
  templateId: 'template_e1a2y6r',
  publicKey: 'hYE1yUq1PwtrbFMxM'
}

export const initializeEmailJS = () => {
  emailjs.init(EMAILJS_CONFIG.publicKey)
}

export const sendSelectionEmails = async (candidates, selectedCandidates) => {
  try {
    initializeEmailJS()
    
    const emailPromises = candidates.map(async (candidate) => {
      const isSelected = selectedCandidates.includes(candidate.id || candidate.candidateEmail)
      
      const templateParams = {
        to_email: candidate.candidateEmail,
        to_name: candidate.candidateName,
        from_name: 'HireSight Recruitment Team',
        from_email: 'gokulakrishnans431@gmail.com',
        subject: isSelected ? 'Congratulations! You have been selected' : 'Thank you for your application',
        message: isSelected ? 
          `Dear ${candidate.candidateName},\n\nWe are pleased to inform you that you have been selected for the next round of interviews for the ${candidate.jobRole} position.\n\nYour application scored ${candidate.score}% in our initial screening process.\n\nWe will contact you soon with further details regarding the interview schedule.\n\nBest regards,\nHireSight Recruitment Team` :
          `Dear ${candidate.candidateName},\n\nThank you for your interest in the ${candidate.jobRole} position and for taking the time to submit your application.\n\nAfter careful review of your profile, we have decided to move forward with other candidates whose experience more closely matches our current requirements.\n\nWe encourage you to apply for future openings that match your skills and experience.\n\nBest regards,\nHireSight Recruitment Team`,
        reply_to: 'gokul.reply@gmail.com'
      }

      return emailjs.send(
        EMAILJS_CONFIG.serviceId,
        EMAILJS_CONFIG.templateId,
        templateParams,
        EMAILJS_CONFIG.publicKey
      )
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
    console.error('EmailJS error:', error)
    return {
      success: false,
      message: 'Failed to send emails. Please try again.',
      error: error.message
    }
  }
}

export const sendNotificationEmail = async (recruiterEmail, requestorEmail, data) => {
  try {
    initializeEmailJS()
    
    const templateParams = {
      to_email: requestorEmail,
      to_name: 'Requestor',
      from_name: 'HireSight System',
      from_email: 'gokulakrishnans431@gmail.com',
      subject: 'New Candidate Rankings Available',
      message: `New candidate rankings have been shared by ${recruiterEmail}.\n\nTotal candidates: ${data.candidates}\nTop score: ${data.topScore}%\n\nPlease check your dashboard to review the results.`,
      reply_to: 'gokul.reply@gmail.com'
    }

    return emailjs.send(
      EMAILJS_CONFIG.serviceId,
      EMAILJS_CONFIG.templateId,
      templateParams,
      EMAILJS_CONFIG.publicKey
    )
  } catch (error) {
    console.error('EmailJS notification error:', error)
    throw error
  }
}
 