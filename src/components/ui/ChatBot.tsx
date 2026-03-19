import { useState, useRef, useEffect } from 'react';
import { X, Send, MessageCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { GoogleGenAI } from '@google/genai';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatBotProps {
  isOpen: boolean;
  onClose: () => void;
  productContext: string;
}

export default function ChatBot({ isOpen, onClose, productContext }: ChatBotProps) {
  const { t, i18n } = useTranslation();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{ role: 'assistant', content: t('chatbot.greeting') }]);
      setTimeout(() => inputRef.current?.focus(), 200);
    }
  }, [isOpen, t, messages.length]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;

    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: text }]);
    setLoading(true);

    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (!apiKey) {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: i18n.language === 'vi'
            ? 'Xin lỗi, chatbot chưa được cấu hình. Vui lòng liên hệ qua Zalo hoặc Instagram!'
            : 'Sorry, the chatbot is not configured yet. Please contact us via Zalo or Instagram!'
        }]);
        setLoading(false);
        return;
      }

      const ai = new GoogleGenAI({ apiKey });
      const systemPrompt = i18n.language === 'vi'
        ? `Bạn là tư vấn viên trang sức của Viet Jewelers. Hãy tư vấn sản phẩm một cách thân thiện, chuyên nghiệp. Trả lời ngắn gọn, dưới 150 từ. Đây là danh mục sản phẩm: ${productContext}`
        : `You are a jewelry advisor at Viet Jewelers. Provide friendly, professional product advice. Keep responses under 150 words. Here is our product catalog: ${productContext}`;

      const chatHistory = messages.map(m => `${m.role === 'user' ? 'Customer' : 'Advisor'}: ${m.content}`).join('\n');

      const response = await ai.models.generateContent({
        model: 'gemini-2.0-flash-lite',
        contents: `${systemPrompt}\n\nConversation:\n${chatHistory}\nCustomer: ${text}\nAdvisor:`,
      });

      setMessages(prev => [...prev, {
        role: 'assistant',
        content: response.text || (i18n.language === 'vi' ? 'Xin lỗi, tôi không hiểu. Bạn có thể hỏi lại không?' : 'Sorry, I didn\'t understand. Could you rephrase?'),
      }]);
    } catch {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: i18n.language === 'vi'
          ? 'Xin lỗi, có lỗi xảy ra. Vui lòng liên hệ qua Zalo hoặc Instagram!'
          : 'Sorry, an error occurred. Please contact us via Zalo or Instagram!'
      }]);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-20 right-6 z-50 w-[360px] max-w-[calc(100vw-3rem)] bg-white dark:bg-slate-900 shadow-2xl rounded-lg border border-slate-200 dark:border-slate-700 flex flex-col max-h-[500px]">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-slate-700 bg-primary text-white rounded-t-lg">
        <div className="flex items-center gap-2">
          <MessageCircle className="w-5 h-5" />
          <h3 className="font-bold text-sm uppercase tracking-widest">{t('chatbot.title')}</h3>
        </div>
        <button onClick={onClose} className="hover:bg-white/20 p-1 rounded transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[200px]">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] px-3 py-2 rounded-lg text-sm ${
              msg.role === 'user'
                ? 'bg-primary text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
            }`}>
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-slate-100 dark:bg-slate-800 px-3 py-2 rounded-lg text-sm text-slate-500">
              <span className="animate-pulse">...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form
        onSubmit={e => { e.preventDefault(); sendMessage(); }}
        className="flex items-center gap-2 px-4 py-3 border-t border-slate-200 dark:border-slate-700"
      >
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder={t('chatbot.placeholder')}
          className="flex-1 text-sm bg-transparent border-none outline-none"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={!input.trim() || loading}
          className="text-primary hover:text-primary/80 disabled:opacity-30 transition-colors"
        >
          <Send className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
}
