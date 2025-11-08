import { motion } from 'motion/react';
import { Bot, User } from 'lucide-react';

interface ChatMessageProps {
  message: string;
  isUser: boolean;
  timestamp: Date;
}

export function ChatMessage({ message, isUser, timestamp }: ChatMessageProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
        className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
          isUser
            ? 'bg-gradient-to-br from-purple-500 to-pink-500'
            : 'bg-gradient-to-br from-blue-500 to-cyan-500'
        }`}
      >
        {isUser ? (
          <User className="w-5 h-5 text-white" />
        ) : (
          <Bot className="w-5 h-5 text-white" />
        )}
      </motion.div>
      
      <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} max-w-[70%]`}>
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1 }}
          className={`px-4 py-3 rounded-2xl backdrop-blur-sm ${
            isUser
              ? 'bg-gradient-to-br from-purple-500/90 to-pink-500/90 text-white rounded-tr-sm'
              : 'bg-white/90 text-gray-800 rounded-tl-sm shadow-lg'
          }`}
        >
          <p className="break-words">{message}</p>
        </motion.div>
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ delay: 0.3 }}
          className="text-xs mt-1 px-1 opacity-60"
        >
          {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </motion.span>
      </div>
    </motion.div>
  );
}
