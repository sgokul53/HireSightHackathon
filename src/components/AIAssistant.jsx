import { useState, useEffect } from 'react'
import  { Zap, X, Send, Mail, Phone, Activity } from 'lucide-react'  
import { callChatbotAPI } from '../services/geminiService.js' // ✅ Correct relative path

const AIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    { id: 1, type: 'ai', text: 'Hello! Welcome to Help & Support. How can I assist you today?' }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const handleNotificationToggle = () => {
      if (isOpen) setIsOpen(false)
    }
    document.addEventListener('notification-opened', handleNotificationToggle)
    return () => document.removeEventListener('notification-opened', handleNotificationToggle)
  }, [isOpen])

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!inputValue.trim()) return

    const userMessage = { id: Date.now(), type: 'user', text: inputValue }
    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsLoading(true)

    const aiResponse = await callChatbotAPI(
      `You are a helpful support assistant for a recruitment platform. Question: ${userMessage.text}`
    )

    setMessages(prev => [...prev, {
      id: Date.now() + 1,
      type: 'ai',
      text: aiResponse || "I'm here to help! You can ask me about using the dashboard, uploading files, analyzing resumes, or managing applications."
    }])

    setIsLoading(false)
  }

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-full shadow-2xl hover:scale-110 transition-all z-50 flex items-center justify-center"
        title="AI Help & Support"
      >
               {isOpen ? <X className="w-6 h-6" /> : <Zap className="w-6 h-6" />} 
      </button>

      {/* Chatbot Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-80 h-96 bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 dark:border-gray-700/50 z-40">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full flex items-center justify-center">
                <Activity className="w-4 h-4 text-white" />
              </div>
              <h3 className="font-medium text-gray-900 dark:text-white">AI Help & Support</h3>
            </div>
            <button onClick={() => setIsOpen(false)} className="p-1 rounded-lg">
              <X className="w-4 h-4 text-gray-500" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex flex-col h-80">
            <div className="flex-1 p-4 overflow-y-auto space-y-3">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-xs p-3 rounded-2xl text-sm ${
                    message.type === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                  }`}>
                    {message.text}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-2xl">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ask me anything..."
                  className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-sm"
                />
                <button type="submit" disabled={!inputValue.trim() || isLoading} className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </form>

            {/* Footer */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
              <p className="text-xs text-gray-600 dark:text-gray-400 text-center mb-2">For any queries Contact Us</p>
              <div className="flex items-center justify-center space-x-4 text-xs">
                <a href="mailto:gokulakrishnans431@gmail.com" className="flex items-center space-x-1 text-blue-600 dark:text-blue-400">
                  <Mail className="w-3 h-3" /><span>gokulakrishnans431@gmail.com</span>
                </a>
                <a href="tel:9788362699" className="flex items-center space-x-1 text-green-600 dark:text-green-400">
                  <Phone className="w-3 h-3" /><span>9788362699</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default AIAssistant
