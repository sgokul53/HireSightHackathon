import  { useState, useEffect } from 'react'
import { Send, Users } from 'lucide-react'

const MessagingSystem = ({ user }) => {
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [selectedContact, setSelectedContact] = useState(null)

   const contacts = user?.role === 'recruiter' ? [
    { id: 'REQ001', name: 'Harini Krishnan', role: 'requestor', online: true, email: 'govarthanan1424@gmail.com' },
    { id: 'REQ002', name: 'Kovarthini', role: 'requestor', online: false, email: 'gokul.reply@gmail.com' }
  ] : [
    { id: 'REC001', name: 'Gokul Kumar', role: 'recruiter', online: true, email: 'gokul.reply@gmail.com' }, 
    { id: 'REC002', name: 'Govardhnan', role: 'recruiter', online: false }
  ]

  useEffect(() => {
    const savedMessages = localStorage.getItem('hiresight_messages')
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages))
    }
  }, [])

   const sendMessage = (e) => {
    e.preventDefault()
    if (!newMessage.trim() || !selectedContact) return

    const message = {
      id: Date.now(),
      from: user.specialId,
      to: selectedContact.id,
      content: newMessage,
      timestamp: new Date().toISOString(),
      fromName: user.name,
      read: false
    }

    const updatedMessages = [...messages, message]
    setMessages(updatedMessages)
    localStorage.setItem('hiresight_messages', JSON.stringify(updatedMessages))
    setNewMessage('')

    // Trigger real-time notification
    window.dispatchEvent(new CustomEvent('new-message', { 
      detail: { message, recipientId: selectedContact.id } 
    }))
  } 

  const getConversation = (contactId) => {
    return messages.filter(msg => 
      (msg.from === user.specialId && msg.to === contactId) ||
      (msg.from === contactId && msg.to === user.specialId)
    ).sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
  }

  return (
       <div className="flex h-96 card animate-fade-in"> 
      <div className="w-1/3 border-r border-gray-200 dark:border-gray-700">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="font-medium text-gray-900 dark:text-white flex items-center">
            <Users className="w-4 h-4 mr-2" />
            Contacts
          </h3>
        </div>
        <div className="overflow-y-auto">
          {contacts.map((contact) => (
                       <button
              key={contact.id}
              onClick={() => setSelectedContact(contact)}
              className={`w-full p-4 text-left transition-all duration-300 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:from-blue-900/20 dark:hover:to-purple-900/20 border-b border-gray-100 dark:border-gray-600 interactive ${
                selectedContact?.id === contact.id ? 'bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20' : ''
              }`}
            > 
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${contact.online ? 'bg-green-500' : 'bg-gray-400'}`} />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{contact.name}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">{contact.role}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        {selectedContact ? (
          <>
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="font-medium text-gray-900 dark:text-white">{selectedContact.name}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">{selectedContact.role}</p>
            </div>
            
            <div className="flex-1 p-4 overflow-y-auto">
              {getConversation(selectedContact.id).map((msg) => (
                <div
                  key={msg.id}
                  className={`mb-4 flex ${msg.from === user.specialId ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-xs px-4 py-2 rounded-lg ${
                    msg.from === user.specialId 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                  }`}>
                    <p className="text-sm">{msg.content}</p>
                    <p className="text-xs mt-1 opacity-75">
                      {new Date(msg.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={sendMessage} className="p-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-gray-500 dark:text-gray-400">Select a contact to start messaging</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default MessagingSystem
 