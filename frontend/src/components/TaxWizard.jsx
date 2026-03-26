import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, FileText, Edit3, User, Sparkles, UploadCloud, Image as ImageIcon } from 'lucide-react'
import ReactMarkdown from 'react-markdown'

export default function TaxWizard() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: "Hi! I'm your ET Tax Wizard. Need help deciding between the Old and New tax regimes, or looking for missing deductions? How can I help you save some money today?"
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef(null)
  const fileInputRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async (messageObject = null) => {
    // If no messageObject is passed, we create one from inputValue
    if (!messageObject && !inputValue.trim()) return

    const newMsg = messageObject || { role: 'user', text: inputValue }
    const newMessages = [...messages, newMsg]
    
    setMessages(newMessages)
    setInputValue('')
    setIsLoading(true)

    try {
      const response = await fetch('http://localhost:8080/api/tax/wizard', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ history: newMessages })
      })
      
      const data = await response.json()
      
      if (response.ok && data.response) {
        setMessages([...newMessages, { role: 'assistant', text: data.response }])
      } else {
        setMessages([...newMessages, { role: 'assistant', text: "Hmm, I encountered an issue connecting to my brain. Is your Spring Boot backend running with the Gemini API key?" }])
      }
    } catch (error) {
       console.error(error)
       setMessages([...newMessages, { role: 'assistant', text: "Oops, I couldn't reach the backend server. Make sure your Spring Boot app is running on port 8080." }])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const pasteManualTemplate = () => {
    setInputValue("Here are my details for FY 24-25:\n- Gross Salary: ₹\n- 80C Investments (PPF, ELSS, etc.): ₹\n- HRA (Annual Rent Paid): ₹\n- Home Loan Interest: ₹\n- NPS (80CCD): ₹\n- Medical Insurance (80D): ₹")
  }

  const triggerFileUpload = () => {
    fileInputRef.current?.click()
  }

  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return

    // Limit to PDF and images
    if (file.type !== 'application/pdf' && !file.type.startsWith('image/')) {
      alert('Please upload a valid PDF or Image file.')
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      const base64String = reader.result.split(',')[1] // Get base64 data only
      const newMsg = {
        role: 'user',
        text: `I have attached my document: ${file.name}.`,
        inlineData: {
          mimeType: file.type,
          data: base64String
        },
        fileName: file.name
      }
      handleSend(newMsg)
    }
    reader.readAsDataURL(file)
  }

  return (
    <section id="tax" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-blue-900/10 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center mb-10">
          <div className="section-tag mx-auto mb-4 border-blue-400/20 bg-blue-400/10 text-blue-400">
            <Sparkles size={11} />
            AI Chatbot
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-4">
            Meet the <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">Tax Wizard</span>
          </h2>
          <p className="text-white/60 text-lg">
            An expert advisor embedded with Economic Times intelligence to optimize your salary structure.
          </p>
        </div>

        {/* Chat Window */}
        <div className="glass-card border border-white/10 rounded-2xl overflow-hidden flex flex-col h-[600px] shadow-2xl">
          {/* Header */}
          <div className="bg-white/5 border-b border-white/10 p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
                <Sparkles size={20} className="text-blue-400" />
              </div>
              <div>
                <h3 className="text-white font-bold text-sm">ET Tax Wizard</h3>
                <p className="text-xs text-green-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span> Online
                </p>
              </div>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 scroll-smooth">
            <AnimatePresence>
              {messages.map((msg, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
                >
                  <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center mt-1 border ${msg.role === 'user' ? 'bg-white/10 border-white/20' : 'bg-blue-500/20 border-blue-500/30'}`}>
                    {msg.role === 'user' ? <User size={14} className="text-white" /> : <Sparkles size={14} className="text-blue-400" />}
                  </div>
                  <div className={`p-4 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                    msg.role === 'user' 
                      ? 'bg-blue-600 text-white rounded-tr-none' 
                      : 'bg-white/5 text-white/90 border border-white/10 rounded-tl-none prose prose-invert prose-blue max-w-none'
                  }`}>
                    {msg.role === 'user' ? (
                      <div>
                        {msg.text}
                        {msg.inlineData && (
                          <div className="mt-3 flex items-center gap-2 bg-white/20 px-3 py-2 rounded-lg border border-white/30 text-xs w-fit">
                            {msg.inlineData.mimeType.startsWith('image/') ? (
                               <img src={`data:${msg.inlineData.mimeType};base64,${msg.inlineData.data}`} alt="upload" className="w-12 h-12 object-cover rounded shadow-sm" />
                            ) : (
                               <FileText size={14} />
                            )}
                            <span className="truncate max-w-[200px] font-medium">{msg.fileName || 'Document'}</span>
                          </div>
                        )}
                      </div>
                    ) : (
                      <ReactMarkdown>{msg.text}</ReactMarkdown>
                    )}
                  </div>
                </motion.div>
              ))}
              
              {isLoading && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-3 max-w-[85%]"
                >
                  <div className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center mt-1 bg-blue-500/20 border border-blue-500/30">
                    <Sparkles size={14} className="text-blue-400" />
                  </div>
                  <div className="p-4 rounded-2xl bg-white/5 text-white/50 border border-white/10 flex items-center gap-2 rounded-tl-none">
                    <span className="w-2 h-2 bg-white/40 rounded-full animate-bounce"></span>
                    <span className="w-2 h-2 bg-white/40 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                    <span className="w-2 h-2 bg-white/40 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Actions & Input Area */}
          <div className="p-4 bg-navy-900 border-t border-white/10">
            {messages.length === 1 && (
              <div className="flex gap-2 mb-3 overflow-x-auto pb-2 scrollbar-hide">
                <button onClick={pasteManualTemplate} className="flex flex-shrink-0 items-center gap-1.5 px-3 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-300 text-xs hover:bg-blue-500/20 transition-colors">
                  <Edit3 size={12} /> Enter Details Manually
                </button>
                <button onClick={triggerFileUpload} className="flex flex-shrink-0 items-center gap-1.5 px-3 py-1.5 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-300 text-xs hover:bg-purple-500/20 transition-colors shadow-[0_0_15px_rgba(168,85,247,0.2)]">
                  <UploadCloud size={12} /> Upload File / Photo
                </button>
              </div>
            )}
            
            <input 
              type="file" 
              accept="application/pdf,image/*" 
              className="hidden" 
              ref={fileInputRef} 
              onChange={handleFileUpload} 
            />

            <div className="relative flex items-end">
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask your tax question here..."
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pr-12 text-sm text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 resize-none max-h-32 min-h-[50px] transition-all"
                rows={inputValue.split('\n').length > 1 ? Math.min(6, inputValue.split('\n').length) : 1}
              />
              <button 
                onClick={handleSend}
                disabled={!inputValue.trim() || isLoading}
                className="absolute right-2 bottom-2 p-2 rounded-lg bg-blue-600 text-white hover:bg-blue-500 disabled:opacity-50 disabled:hover:bg-blue-600 transition-colors"
              >
                <Send size={16} />
              </button>
            </div>
            <p className="text-[10px] text-white/40 text-center mt-3">
              * The Wizard calculates based on FY 2024-25 standards. Consult a certified CA for final filings.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
