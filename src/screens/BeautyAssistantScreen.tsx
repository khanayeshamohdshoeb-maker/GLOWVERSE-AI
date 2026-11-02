import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext.tsx';
import {
  Sparkles,
  Send,
  Plus,
  Trash2,
  Copy,
  Check,
  RotateCcw,
  ShieldCheck,
  MessageSquare,
  ChevronRight,
  Layers,
  HelpCircle,
  ExternalLink,
  Info,
  Clock,
  X
} from 'lucide-react';

interface ChatMessage {
  id: string;
  conversationId?: string;
  sender: 'user' | 'assistant';
  text: string;
  provider?: string;
  model?: string;
  disclaimer?: string;
  suggestedQuestions?: string[];
  createdAt?: string;
  isError?: boolean;
}

interface ConversationSummary {
  id: string;
  title: string;
  messages: ChatMessage[];
  updatedAt: string;
  createdAt: string;
}

const CURATED_PROMPTS = [
  'What is niacinamide?',
  'What does hyaluronic acid do?',
  'Explain sunscreen SPF.',
  'What is a good basic skincare routine?',
  'What is the difference between a serum and moisturiser?',
  'Explain my skin-analysis results.',
  'What is salicylic acid?',
  'Which ingredients should I learn about?',
  'What can GLOWVERSE AI do?'
];

export const BeautyAssistantScreen: React.FC = () => {
  const { user, profile, activeAnalysis, showToast } = useApp();

  const [conversations, setConversations] = useState<ConversationSummary[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputQuery, setInputQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [systemStatus, setSystemStatus] = useState<{
    status: string;
    model: string;
    geminiConfigured: boolean;
    provider: string;
  } | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load Assistant status & conversations on mount
  useEffect(() => {
    fetchStatus();
    loadConversations();
  }, []);

  const fetchStatus = async () => {
    try {
      const res = await fetch('/api/assistant/status');
      if (res.ok) {
        const data = await res.json();
        setSystemStatus(data);
      }
    } catch {
      // Fallback
    }
  };

  const loadConversations = async (preferredId?: string) => {
    try {
      const res = await fetch('/api/assistant/conversations');
      if (res.ok) {
        const data: ConversationSummary[] = await res.json();
        setConversations(data);
        if (data.length > 0) {
          const selected = preferredId
            ? data.find(c => c.id === preferredId) || data[0]
            : data[0];
          setActiveConversationId(selected.id);
          setMessages(selected.messages || []);
        } else {
          // Create initial starter conversation
          handleNewConversation();
        }
      }
    } catch (e) {
      console.error('Failed to load conversations', e);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSelectConversation = (conv: ConversationSummary) => {
    setActiveConversationId(conv.id);
    setMessages(conv.messages || []);
    setSidebarOpen(false);
  };

  const handleNewConversation = async () => {
    try {
      const res = await fetch('/api/assistant/conversations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'New Skincare Exploration' })
      });
      if (res.ok) {
        const newConv: ConversationSummary = await res.json();
        setConversations(prev => [newConv, ...prev]);
        setActiveConversationId(newConv.id);
        setMessages(newConv.messages || []);
        setSidebarOpen(false);
        showToast('Created new consultation thread', 'info');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteConversation = async (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    try {
      const res = await fetch(`/api/assistant/conversations/${id}`, { method: 'DELETE' });
      if (res.ok) {
        const remaining = conversations.filter(c => c.id !== id);
        setConversations(remaining);
        showToast('Conversation deleted', 'info');
        if (activeConversationId === id) {
          if (remaining.length > 0) {
            handleSelectConversation(remaining[0]);
          } else {
            handleNewConversation();
          }
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleClearAllConversations = async () => {
    if (!confirm('Are you sure you want to clear your consultation history?')) return;
    try {
      const res = await fetch('/api/assistant/conversations', { method: 'DELETE' });
      if (res.ok) {
        showToast('All consultation histories cleared', 'info');
        handleNewConversation();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputQuery).trim();
    if (!query || loading) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}-user`,
      conversationId: activeConversationId || undefined,
      sender: 'user',
      text: query,
      createdAt: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');
    setLoading(true);

    try {
      const res = await fetch('/api/assistant/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          conversationId: activeConversationId || undefined,
          context: {
            skinProfile: {
              skinType: profile?.skinType,
              skinConcerns: profile?.skinConcerns,
              routinePreference: profile?.routinePreference,
              monthlyBudget: profile?.monthlyBudget,
              currency: profile?.currency
            },
            analysisSummary: activeAnalysis ? {
              overallScore: activeAnalysis.overallScore,
              date: activeAnalysis.analyzedAt,
              parameters: activeAnalysis.parameters
            } : undefined
          }
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to generate beauty response');
      }

      const assistantMsg: ChatMessage = {
        id: data.message?.id || `asst-${Date.now()}`,
        conversationId: data.conversationId,
        sender: 'assistant',
        text: data.answer || data.message?.text || 'No response generated.',
        provider: data.provider || 'GLOWVERSE Intelligence',
        model: data.model || 'gemini-3.1-flash-lite',
        disclaimer: data.disclaimer || 'Educational cosmetic guidance only. Does not replace professional dermatological consultation.',
        suggestedQuestions: data.suggestedQuestions || [],
        createdAt: data.message?.createdAt || new Date().toISOString()
      };

      setMessages(prev => [...prev, assistantMsg]);

      // If this was a new conversation or updated, sync sidebar
      if (data.conversationId) {
        setActiveConversationId(data.conversationId);
        setConversations(prev => {
          const index = prev.findIndex(c => c.id === data.conversationId);
          if (index >= 0) {
            const updated = [...prev];
            updated[index] = {
              ...updated[index],
              title: updated[index].title === 'New Skincare Exploration'
                ? query.substring(0, 32) + (query.length > 32 ? '...' : '')
                : updated[index].title,
              updatedAt: new Date().toISOString(),
              messages: [...updated[index].messages, userMsg, assistantMsg]
            };
            return updated;
          } else {
            return [
              {
                id: data.conversationId,
                title: query.substring(0, 32) + (query.length > 32 ? '...' : ''),
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                messages: [userMsg, assistantMsg]
              },
              ...prev
            ];
          }
        });
      }
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        conversationId: activeConversationId || undefined,
        sender: 'assistant',
        text: `We encountered an issue processing your formulation inquiry: "${err.message || 'Unknown network error'}". Please try again.`,
        isError: true,
        createdAt: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    showToast('Copied guidance to clipboard', 'info');
    setTimeout(() => setCopiedId(null), 2500);
  };

  const retryLastQuery = () => {
    const lastUserMessage = [...messages].reverse().find(m => m.sender === 'user');
    if (lastUserMessage) {
      handleSendMessage(lastUserMessage.text);
    }
  };

  const activeConversation = conversations.find(c => c.id === activeConversationId);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Editorial Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between pb-6 border-b border-[#E8DCCB] gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#96734C]">
            <span>Cosmetic Formulation Intelligence</span>
            <span aria-hidden="true">·</span>
            <span>Non-Medical Skin Science</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif text-[#302B27] mt-1">
            AI Beauty Assistant
          </h1>
          <p className="text-sm text-[#302B27]/70 font-sans mt-1 max-w-2xl">
            Inquire about cosmetic active ingredients, routine sequencing, barrier restoration, and formulation compatibility powered by high-speed skincare intelligence.
          </p>
        </div>

        {/* Status Indicator & Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 text-xs text-[#302B27] bg-[#FFFFFF] border border-[#E8DCCB] px-3.5 py-2 rounded-xl shadow-xs">
            <Sparkles className="w-4 h-4 text-[#C6A77D]" />
            <span className="font-medium">
              {systemStatus?.geminiConfigured
                ? 'Gemini 3.1 Flash-Lite Engine Active'
                : 'Educational Skincare Engine'}
            </span>
          </div>

          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden flex items-center gap-2 px-3 py-2 bg-[#FFFFFF] border border-[#E8DCCB] text-[#302B27] rounded-xl text-xs font-semibold cursor-pointer"
          >
            <MessageSquare className="w-4 h-4 text-[#96734C]" />
            <span>Consultations ({conversations.length})</span>
          </button>
        </div>
      </div>

      {/* Main Container with Sidebar + Chat Thread */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 min-h-[640px]">
        
        {/* Sidebar: Conversation History (Desktop + Mobile Slideover) */}
        <div
          className={`${
            sidebarOpen ? 'fixed inset-0 z-50 bg-black/40 p-4 md:p-0 flex md:block' : 'hidden md:block'
          } md:col-span-4 lg:col-span-3`}
        >
          <div className="bg-[#FFFFFF] border border-[#E8DCCB] rounded-2xl shadow-xs h-[640px] flex flex-col overflow-hidden w-full max-w-md mx-auto md:max-w-none">
            
            {/* Sidebar Top Header */}
            <div className="p-4 border-b border-[#E8DCCB] flex items-center justify-between bg-[#F8F4ED]">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-[#96734C]" />
                <span className="font-serif font-bold text-sm text-[#302B27]">Consultations</span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={handleNewConversation}
                  title="New Consultation"
                  className="p-1.5 hover:bg-[#E8DCCB] rounded-lg text-[#302B27] transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                </button>
                {sidebarOpen && (
                  <button
                    onClick={() => setSidebarOpen(false)}
                    className="md:hidden p-1.5 hover:bg-[#E8DCCB] rounded-lg text-[#302B27]"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Conversation List */}
            <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
              {conversations.length === 0 ? (
                <div className="p-4 text-center text-xs text-[#302B27]/50 font-sans">
                  No previous consultations yet.
                </div>
              ) : (
                conversations.map(conv => {
                  const isActive = conv.id === activeConversationId;
                  const messageCount = conv.messages ? conv.messages.length : 0;
                  return (
                    <div
                      key={conv.id}
                      onClick={() => handleSelectConversation(conv)}
                      className={`group p-3 rounded-xl border text-left cursor-pointer transition-all flex items-start justify-between gap-2 ${
                        isActive
                          ? 'bg-[#F8F4ED] border-[#C6A77D] shadow-xs'
                          : 'bg-white hover:bg-[#F8F4ED]/60 border-transparent hover:border-[#E8DCCB]'
                      }`}
                    >
                      <div className="flex-1 min-w-0">
                        <p className={`text-xs font-semibold truncate ${isActive ? 'text-[#302B27]' : 'text-[#302B27]/80'}`}>
                          {conv.title || 'Skincare Inquiry'}
                        </p>
                        <div className="flex items-center gap-2 mt-1 text-[11px] text-[#302B27]/50">
                          <span>{messageCount} msgs</span>
                          <span>•</span>
                          <span>{new Date(conv.updatedAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}</span>
                        </div>
                      </div>

                      <button
                        onClick={(e) => handleDeleteConversation(conv.id, e)}
                        title="Delete consultation"
                        className="opacity-0 group-hover:opacity-100 p-1 hover:text-rose-600 rounded transition-opacity cursor-pointer text-[#302B27]/40"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })
              )}
            </div>

            {/* Clear All Option */}
            {conversations.length > 1 && (
              <div className="p-3 border-t border-[#E8DCCB] bg-[#F8F4ED]/60">
                <button
                  onClick={handleClearAllConversations}
                  className="w-full text-center text-[11px] font-semibold text-[#96734C] hover:text-rose-600 transition-colors py-1 cursor-pointer"
                >
                  Clear all consultation history
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Chat Thread Panel */}
        <div className="md:col-span-8 lg:col-span-9 bg-[#FFFFFF] border border-[#E8DCCB] rounded-2xl shadow-xs overflow-hidden flex flex-col h-[640px]">
          
          {/* Thread Header */}
          <div className="px-6 py-3.5 bg-[#F8F4ED] border-b border-[#E8DCCB] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#302B27] text-white flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-[#C6A77D]" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-sm text-[#302B27] truncate max-w-xs sm:max-w-md">
                  {activeConversation?.title || 'Skincare Intelligence Consultation'}
                </h3>
                <span className="text-[11px] text-[#96734C] font-sans">
                  Active Consultation Session
                </span>
              </div>
            </div>

            <button
              onClick={handleNewConversation}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#FFFFFF] hover:bg-[#E8DCCB] text-[#302B27] border border-[#E8DCCB] rounded-lg text-xs font-semibold transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-[#96734C]" />
              <span className="hidden sm:inline">New Consultation</span>
            </button>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
            
            {/* Context Badge if skin analysis present */}
            {activeAnalysis && (
              <div className="bg-[#F8F4ED] border border-[#E8DCCB] rounded-xl p-3 flex items-center justify-between text-xs text-[#302B27]">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-[#96734C]" />
                  <span>
                    Analysis Context Attached: Overall Skin Health <strong>{activeAnalysis.overallScore}/100</strong>
                  </span>
                </div>
                <span className="text-[11px] text-[#96734C] font-semibold">Live Profile Linked</span>
              </div>
            )}

            {messages.map(msg => {
              const isAssistant = msg.sender === 'assistant';
              return (
                <div
                  key={msg.id}
                  className={`flex gap-3 sm:gap-4 ${isAssistant ? 'justify-start' : 'justify-end'}`}
                >
                  {isAssistant && (
                    <div className="w-8 h-8 rounded-full bg-[#F8F4ED] border border-[#E8DCCB] flex items-center justify-center text-[#96734C] shrink-0 mt-1">
                      <Sparkles className="w-4 h-4" />
                    </div>
                  )}

                  <div
                    className={`max-w-2xl rounded-2xl p-4 sm:p-5 text-xs sm:text-sm leading-relaxed space-y-3 shadow-xs ${
                      isAssistant
                        ? msg.isError
                          ? 'bg-rose-50 border border-rose-200 text-rose-900 rounded-tl-xs'
                          : 'bg-[#F8F4ED] text-[#302B27] border border-[#E8DCCB] rounded-tl-xs'
                        : 'bg-[#302B27] text-white rounded-tr-xs'
                    }`}
                  >
                    {/* Message Body */}
                    <div className="whitespace-pre-line font-sans prose prose-sm max-w-none">
                      {msg.text}
                    </div>

                    {/* Metadata & Actions */}
                    {isAssistant && !msg.isError && (
                      <div className="flex flex-wrap items-center justify-between text-[11px] opacity-75 pt-2.5 border-t border-[#E8DCCB]/60 gap-2">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-[#96734C]">
                            {msg.model ? `Model: ${msg.model}` : msg.provider || 'Beauty Intelligence'}
                          </span>
                          {msg.createdAt && (
                            <>
                              <span>•</span>
                              <span>{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            </>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => copyToClipboard(msg.text, msg.id)}
                            className="flex items-center gap-1 hover:text-[#302B27] transition-colors cursor-pointer px-2 py-0.5 rounded hover:bg-white"
                            title="Copy answer"
                          >
                            {copiedId === msg.id ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                                <span className="text-emerald-700 font-semibold">Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5 text-[#96734C]" />
                                <span>Copy</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Error retry option */}
                    {msg.isError && (
                      <div className="pt-2 flex items-center justify-between">
                        <span className="text-xs text-rose-700">Unable to generate response.</span>
                        <button
                          onClick={retryLastQuery}
                          className="flex items-center gap-1.5 px-3 py-1 bg-white border border-rose-300 text-rose-700 rounded-lg text-xs font-semibold hover:bg-rose-100 transition-colors cursor-pointer"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Retry Query</span>
                        </button>
                      </div>
                    )}

                    {/* Disclaimer if present */}
                    {msg.disclaimer && (
                      <div className="text-[10px] text-[#302B27]/60 italic pt-1 flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3 text-[#96734C] shrink-0" />
                        <span>{msg.disclaimer}</span>
                      </div>
                    )}

                    {/* Suggested follow-up inquiries */}
                    {msg.suggestedQuestions && msg.suggestedQuestions.length > 0 && (
                      <div className="pt-2.5 space-y-1.5">
                        <div className="text-[11px] font-semibold text-[#96734C]">
                          Explore formulation questions:
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {msg.suggestedQuestions.map((q, idx) => (
                            <button
                              key={idx}
                              onClick={() => handleSendMessage(q)}
                              className="px-2.5 py-1 bg-white hover:bg-[#E8DCCB] text-[#302B27] rounded-lg border border-[#E8DCCB] text-xs font-sans transition-colors cursor-pointer text-left shadow-2xs flex items-center gap-1"
                            >
                              <span>{q}</span>
                              <ChevronRight className="w-3 h-3 text-[#96734C]" />
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {!isAssistant && (
                    <div className="w-8 h-8 rounded-full bg-[#302B27] text-white flex items-center justify-center shrink-0 mt-1 text-xs font-bold">
                      {user?.displayName ? user.displayName.charAt(0) : 'U'}
                    </div>
                  )}
                </div>
              );
            })}

            {loading && (
              <div className="flex gap-4 items-center text-xs text-[#96734C] font-semibold pl-12 py-2">
                <Sparkles className="w-4 h-4 animate-spin text-[#96734C]" />
                <span className="font-sans">Analyzing active ingredients and formulation science...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompt Carousel */}
          <div className="px-4 py-2 bg-[#F8F4ED]/80 border-t border-[#E8DCCB] overflow-x-auto scrollbar-none flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#96734C] shrink-0">
              Quick Inquiries:
            </span>
            <div className="flex gap-2 shrink-0">
              {CURATED_PROMPTS.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(prompt)}
                  className="px-3 py-1 bg-white hover:bg-[#E8DCCB] text-[#302B27] rounded-full text-xs border border-[#E8DCCB] transition-colors cursor-pointer whitespace-nowrap shadow-2xs"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>

          {/* Input Box */}
          <div className="p-4 bg-[#FFFFFF] border-t border-[#E8DCCB]">
            <form
              onSubmit={e => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2 sm:gap-3"
            >
              <input
                ref={inputRef}
                type="text"
                placeholder="Ask about active ingredients, routine layering, SPF, or formulation conflicts..."
                value={inputQuery}
                onChange={e => setInputQuery(e.target.value)}
                className="flex-1 px-4 py-3 bg-[#F8F4ED] border border-[#E8DCCB] rounded-xl text-xs sm:text-sm text-[#302B27] placeholder:text-[#302B27]/40 focus:outline-[#96734C]"
              />
              <button
                type="submit"
                disabled={!inputQuery.trim() || loading}
                className="px-5 py-3 bg-[#302B27] hover:bg-[#433C37] disabled:opacity-50 text-white rounded-xl transition-all cursor-pointer flex items-center gap-2 shadow-xs shrink-0"
                title="Send inquiry"
              >
                <Send className="w-4 h-4 text-[#C6A77D]" />
                <span className="hidden sm:inline text-xs font-semibold uppercase tracking-wider">
                  Consult
                </span>
              </button>
            </form>

            <div className="flex flex-wrap items-center justify-between text-[11px] text-[#302B27]/60 pt-2 px-1 gap-2">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#96734C]" />
                <span>Cosmetic education & formulation science only. Not medical diagnosis.</span>
              </div>
              <div className="flex items-center gap-2">
                <span>Press Enter to send</span>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
