import React, { useState, useEffect, useRef } from 'react';
import {
  Bot,
  Send,
  Sparkles,
  Mic,
  MicOff,
  BookOpen,
  FileText,
  CheckCircle2,
  HelpCircle,
  Loader2,
  Trash2,
  ExternalLink,
  ShieldCheck,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { chatbotApi } from '../../services/api';
import { useToast } from '../../context/ToastContext';

const SUGGESTED_QUESTIONS = [
  'Who can donate blood to an O+ patient?',
  'Why is O Negative the universal red cell donor?',
  'What are the donor deferral rules for tattoos and antibiotics?',
  'What is the Massive Transfusion Protocol (MTP) 1:1:1 ratio?',
  'What are the minimum weight and hemoglobin requirements?'
];

export const RAGChatbot = () => {
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      sender: 'assistant',
      text: 'Hello! I am **BloodBridge AI**, your verified clinical blood transfusion and donor compatibility assistant.\n\nAsk me anything regarding blood compatibility, donor health screening, emergency trauma transfusion guidelines, or deferral periods.',
      timestamp: new Date().toISOString(),
      sources: []
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [expandedSources, setExpandedSources] = useState({});
  const messagesEndRef = useRef(null);
  const toast = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  // Voice Input using Web Speech API
  const handleVoiceInput = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast.warning('Speech recognition is not supported in this browser.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListening(true);
        toast.info('🎙️ Listening for medical blood query...');
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (e) {
      setIsListening(false);
    }
  };

  const handleSend = async (questionToSend) => {
    const q = (questionToSend || input).trim();
    if (!q || loading) return;

    const userMessage = {
      id: `user_${Date.now()}`,
      sender: 'user',
      text: q,
      timestamp: new Date().toISOString()
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const history = messages
        .filter((m) => m.id !== 'welcome')
        .map((m) => ({
          role: m.sender === 'user' ? 'user' : 'model',
          parts: [{ text: m.text }]
        }));

      const res = await chatbotApi.ask(q, history);
      if (res.success) {
        const botMessage = {
          id: `bot_${Date.now()}`,
          sender: 'assistant',
          text: res.answer,
          confidence: res.confidence,
          sources: res.sources || [],
          timestamp: new Date().toISOString()
        };
        setMessages((prev) => [...prev, botMessage]);
      }
    } catch (err) {
      toast.error(err.message || 'Failed to retrieve answer from knowledge base.');
      setMessages((prev) => [
        ...prev,
        {
          id: `bot_err_${Date.now()}`,
          sender: 'assistant',
          text: '⚠️ An error occurred while retrieving clinical context. Please try again.',
          timestamp: new Date().toISOString(),
          sources: []
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const toggleSource = (msgId) => {
    setExpandedSources((prev) => ({
      ...prev,
      [msgId]: !prev[msgId]
    }));
  };

  const clearChat = () => {
    setMessages([
      {
        id: 'welcome',
        sender: 'assistant',
        text: 'Chat history cleared. How can I assist you with clinical blood guidelines?',
        timestamp: new Date().toISOString(),
        sources: []
      }
    ]);
  };

  return (
    <div className="flex flex-col h-[700px] w-full rounded-2xl glass-panel-glow border border-slate-800 shadow-2xl overflow-hidden">
      
      {/* Chatbot Header */}
      <div className="px-6 py-4 bg-slate-900/90 border-b border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-600 to-indigo-600 p-0.5 shadow-lg shadow-rose-950/50">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Bot className="w-5 h-5 text-rose-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-display font-bold text-base text-white">
                BloodBridge RAG Assistant
              </h3>
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-800/80 text-[10px] text-emerald-300 font-bold">
                <ShieldCheck className="w-3 h-3 text-emerald-400" /> Verified Clinical RAG
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Retrieval-Augmented Generation grounded in WHO, AABB & Hospital Transfusion Manuals
            </p>
          </div>
        </div>

        <button
          onClick={clearChat}
          className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
          title="Clear Conversation"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Suggested Questions Bar */}
      <div className="px-4 py-2 bg-slate-950/60 border-b border-slate-800/60 flex items-center gap-2 overflow-x-auto text-xs no-scrollbar">
        <span className="text-slate-400 shrink-0 flex items-center gap-1 font-semibold">
          <Sparkles className="w-3 h-3 text-amber-400" /> Suggested:
        </span>
        {SUGGESTED_QUESTIONS.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(q)}
            className="shrink-0 px-3 py-1 rounded-full bg-slate-900 hover:bg-rose-950/60 text-slate-300 hover:text-rose-300 border border-slate-800 transition-all font-medium"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Message Stream */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'} space-y-1.5 animate-fade-in`}
          >
            <div
              className={`max-w-[88%] sm:max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-gradient-to-r from-crimson-600 to-rose-600 text-white shadow-lg shadow-crimson-950/40 rounded-br-none'
                  : 'bg-slate-900/90 border border-slate-800 text-slate-200 rounded-bl-none shadow-md'
              }`}
            >
              {/* Bot Header with Confidence */}
              {msg.sender === 'assistant' && msg.confidence && (
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 text-[11px] text-slate-400">
                  <span className="flex items-center gap-1 font-semibold text-rose-400">
                    <Bot className="w-3.5 h-3.5" /> Clinical Guidance
                  </span>
                  <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                    msg.confidence >= 70
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                      : 'bg-amber-950 text-amber-300 border border-amber-800'
                  }`}>
                    {msg.confidence}% Retrieval Match
                  </span>
                </div>
              )}

              {/* Message text with basic markdown bold rendering */}
              <div className="whitespace-pre-line text-sm">
                {msg.text}
              </div>

              {/* RAG Source Citations Box */}
              {msg.sources && msg.sources.length > 0 && (
                <div className="mt-3 pt-3 border-t border-slate-800/80">
                  <button
                    onClick={() => toggleSource(msg.id)}
                    className="flex items-center justify-between w-full text-xs font-semibold text-rose-400 hover:text-rose-300 transition-colors"
                  >
                    <span className="flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5" />
                      Verified Document Citations ({msg.sources.length})
                    </span>
                    {expandedSources[msg.id] ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </button>

                  {expandedSources[msg.id] && (
                    <div className="mt-2 space-y-2">
                      {msg.sources.map((src, idx) => (
                        <div
                          key={idx}
                          className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 space-y-1"
                        >
                          <div className="flex items-center justify-between font-bold text-rose-300">
                            <span className="flex items-center gap-1 truncate max-w-[240px]">
                              <FileText className="w-3 h-3 text-rose-400 shrink-0" />
                              {src.documentTitle}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono">
                              Match: {Math.round((src.relevanceScore || 0.8) * 100)}%
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 italic">
                            "{src.snippet}"
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            <span className="text-[10px] text-slate-400 px-1">
              {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        ))}

        {loading && (
          <div className="flex items-start gap-2 animate-fade-in">
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-slate-300 text-sm flex items-center gap-3">
              <Loader2 className="w-5 h-5 animate-spin text-crimson-500" />
              <div className="space-y-0.5">
                <p className="font-semibold text-xs text-white">Searching vector embeddings...</p>
                <p className="text-[11px] text-slate-400">Retrieving relevant medical chunks & synthesizing response</p>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Chat Input Bar */}
      <div className="p-4 bg-slate-900/90 border-t border-slate-800">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <button
            type="button"
            onClick={handleVoiceInput}
            className={`p-2.5 rounded-xl border transition-all ${
              isListening
                ? 'bg-rose-600 text-white border-rose-500 animate-pulse'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
            }`}
            title={isListening ? 'Stop Listening' : 'Voice Input'}
          >
            {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask anything about blood groups, compatibility, eligibility..."
            disabled={loading}
            className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700/80 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-rose-500 disabled:opacity-50"
          />

          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-crimson-600 to-rose-600 hover:from-crimson-500 hover:to-rose-500 text-white font-bold text-sm shadow-lg shadow-crimson-950/50 flex items-center gap-1.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">Ask</span>
          </button>
        </form>
      </div>
    </div>
  );
};
