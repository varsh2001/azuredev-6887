import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, BotMessageSquare } from 'lucide-react';
import { ChatMessage } from './components/ChatMessage';
import { TypingIndicator } from './components/TypingIndicator';
import { FloatingOrbs } from './components/FloatingOrbs';
import { Input } from './components/ui/input';
import { Button } from './components/ui/button';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

async function sendChatMessageToBackend(message: string) {
  const res = await fetch(`${API_URL}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message }),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(body?.error || res.statusText);
  }
  return res.json();
}

export default function App() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm your AI assistant. How can I help you today?",
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const textToSend = inputValue;
    const userMessage: Message = {
      id: Date.now().toString(),
      text: textToSend,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
      const data = await sendChatMessageToBackend(textToSend);
      // backend returns { text, raw } per server implementation
      const botText =
        (data && (data.text ?? (data.raw ? JSON.stringify(data.raw) : null))) ??
        'Sorry, I could not generate a response.';

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botText,
        isUser: false,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err: any) {
      const errMsg: Message = {
        id: (Date.now() + 2).toString(),
        text: `Error: ${err?.message ?? 'Unknown error'}`,
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setIsTyping(false);
      // focus input after sending
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden">
      <FloatingOrbs />

      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,black,transparent)]" />

      <div className="relative z-10 flex flex-col h-screen max-w-5xl mx-auto p-4 md:p-8">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <motion.div
              animate={{
                rotate: [0, 360],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'linear',
              }}
            >
              <BotMessageSquare className="w-8 h-8 text-purple-400" />
            </motion.div>
            <h1 className="text-3xl text-white">AI Chat Assistant</h1>
          </div>
          <p className="text-purple-200/70 ml-11">Your intelligent conversation partner</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.2 }} className="flex-1 backdrop-blur-xl bg-white/5 rounded-3xl border border-white/10 shadow-2xl overflow-hidden flex flex-col">
          <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-purple-500/50 scrollbar-track-transparent">
            <AnimatePresence mode="popLayout">
              {messages.map((message) => (
                <ChatMessage key={message.id} message={message.text} isUser={message.isUser} timestamp={message.timestamp} />
              ))}
              {isTyping && <TypingIndicator key="typing" />}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }} className="p-6 border-t border-white/10 bg-white/5 backdrop-blur-sm">
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <Input
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  className="w-full bg-white/90 backdrop-blur-sm border-white/20 rounded-2xl px-6 py-6 pr-4 text-gray-800 placeholder:text-gray-400 focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
                />
              </div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button onClick={handleSend} disabled={!inputValue.trim() || isTyping} className="h-full px-8 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-2xl shadow-lg shadow-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
                  <Send className="w-5 h-5" />
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.6 }} className="mt-4 text-center text-purple-200/50 text-sm">
          Press Enter to send • Shift+Enter for new line
        </motion.div>
      </div>
    </div>
  );
}
