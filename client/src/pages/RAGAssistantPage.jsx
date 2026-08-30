import React from 'react';
import { Bot, ShieldCheck, BookOpen, Sparkles, FileText, CheckCircle2, ArrowRight } from 'lucide-react';
import { RAGChatbot } from '../components/chat/RAGChatbot';
import { Link } from 'react-router-dom';

export const RAGAssistantPage = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            Verified Clinical Knowledge Retrieval Pipeline
          </div>
          <h1 className="text-3xl sm:text-4xl font-display font-bold text-white">
            AI Blood & Transfusion Assistant
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Ask complex queries on ABO/Rh compatibility, donor eligibility, deferral criteria, and emergency Massive Transfusion Protocols. Answers are synthesized with direct document citations.
          </p>
        </div>

        <Link
          to="/knowledge-admin"
          className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-bold text-slate-200 flex items-center gap-2 self-start md:self-auto transition-all"
        >
          <BookOpen className="w-4 h-4 text-amber-400" />
          Manage Documents & Embeddings <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* RAG Chatbot Integration */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Main Chatbot (8 cols) */}
        <div className="lg:col-span-8">
          <RAGChatbot />
        </div>

        {/* Clinical Knowledge Overview (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* Card 1: Grounded Medical Facts */}
          <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              Grounded & Zero-Hallucination
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Unlike generic LLMs, BloodBridge RAG extracts semantic chunks from indexed WHO, AABB, and trauma transfusion guidelines before answering. Every statement is attributed to verified clinical sources.
            </p>
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 space-y-1.5">
              <div className="font-bold text-rose-400">⚡ Universal Rules:</div>
              <ul className="list-disc list-inside text-slate-400 space-y-1 text-[11px]">
                <li><strong className="text-slate-200">O Negative:</strong> Universal red cell donor</li>
                <li><strong className="text-slate-200">AB Positive:</strong> Universal red cell recipient</li>
                <li><strong className="text-slate-200">AB Negative/Positive:</strong> Universal plasma donor</li>
              </ul>
            </div>
          </div>

          {/* Card 2: Active Vector Knowledge Docs */}
          <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-3">
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              <FileText className="w-5 h-5 text-rose-400" />
              Active Knowledge Base
            </h3>
            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-300 flex items-center justify-between">
                <span>WHO Blood Types & Transfusion</span>
                <span className="text-[10px] text-emerald-400 font-bold">Indexed</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-300 flex items-center justify-between">
                <span>Donor Screening & Deferrals</span>
                <span className="text-[10px] text-emerald-400 font-bold">Indexed</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-300 flex items-center justify-between">
                <span>Massive Transfusion Protocol (MTP)</span>
                <span className="text-[10px] text-emerald-400 font-bold">Indexed</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
