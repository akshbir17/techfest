import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Bird } from 'lucide-react';
import { getCrimsonResponse } from '../services/ai';
import GlassCard from './ui/GlassCard';

const CrimsonChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: "Welcome, traveler. I am Crimson, the Sentinel of this digital shrine. How may I assist your quest for knowledge about Techfest 2026?", sender: 'crimson' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMessage = { id: Date.now(), text: inputValue, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    const responseText = await getCrimsonResponse(inputValue);
    const crimsonMessage = { id: Date.now() + 1, text: responseText, sender: 'crimson' };
    
    setMessages(prev => [...prev, crimsonMessage]);
    setIsLoading(false);
  };

  return (
    <>
      {/* Floating Action Button */}
      <motion.div 
        className="chatbot-fab"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={24} /> : <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}><Bird size={24} /><span style={{ fontSize: '0.6rem', fontWeight: 'bold' }}>CRIMSON</span></div>}
      </motion.div>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className="chat-window"
            initial={{ opacity: 0, y: 50, scale: 0.9, x: 20 }}
            animate={{ opacity: 1, y: 0, scale: 1, x: 0 }}
            exit={{ opacity: 0, y: 50, scale: 0.9, x: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <GlassCard style={{ height: '100%', display: 'flex', flexDirection: 'column', padding: 0 }} className="glass-panel">
              <div className="chat-header">
                <h3>CRIMSON SENTINEL</h3>
                <button 
                  onClick={() => setIsOpen(false)}
                  style={{ background: 'transparent', border: 'none', color: 'var(--color-neon-cyan)', cursor: 'pointer' }}
                >
                  <X size={18} />
                </button>
              </div>

              <div className="chat-messages" ref={scrollRef}>
                {messages.map((msg) => (
                  <motion.div 
                    key={msg.id}
                    className={`message ${msg.sender}`}
                    initial={{ opacity: 0, x: msg.sender === 'user' ? 20 : -20 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    {msg.text}
                  </motion.div>
                ))}
                {isLoading && (
                  <motion.div 
                    className="message crimson"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <span className="dot-pulse">The scrolls are being read...</span>
                  </motion.div>
                )}
              </div>

              <form className="chat-input-container" onSubmit={handleSend}>
                <input 
                  type="text" 
                  className="chat-input"
                  placeholder="Ask the sentinel..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  disabled={isLoading}
                />
                <button 
                  type="submit" 
                  className="chat-send-btn"
                  disabled={!inputValue.trim() || isLoading}
                >
                  <Send size={18} />
                </button>
              </form>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default CrimsonChat;
