import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { LuxuryProductCard } from '../components/LuxuryProductCard.tsx';
import { JournalEntry } from '../types.ts';
import {
  BookOpen,
  Plus,
  Trash2,
  Heart,
  Sparkles,
  Calendar,
  Tag,
  Search,
  CheckCircle2,
  X
} from 'lucide-react';

export const BeautyJournalScreen: React.FC = () => {
  const {
    journalEntries,
    addJournalEntry,
    deleteJournalEntry,
    wishlist,
    products,
    activeAnalysis,
    navigateTo,
    showToast
  } = useApp();

  const [activeTab, setActiveTab] = useState<'reflections' | 'wishlist' | 'analyses'>('reflections');
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewEntryModal, setShowNewEntryModal] = useState(false);

  // New entry form state
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newMood, setNewMood] = useState<'radiant' | 'balanced' | 'reactive' | 'dry' | 'breakout'>('radiant');
  const [newSkinFeel, setNewSkinFeel] = useState('');
  const [newTags, setNewTags] = useState('Hydration, Morning Ritual');

  const filteredEntries = journalEntries.filter(e =>
    e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const wishedProducts = products.filter(p => wishlist.includes(p.id));

  const handleCreateEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    await addJournalEntry({
      title: newTitle.trim(),
      content: newContent.trim(),
      mood: newMood,
      skinFeel: newSkinFeel.trim() || 'Supple & balanced',
      activeProductsUsed: ['Celestial Dew Essence', 'Velvet Cloud Cream'],
      tags: newTags.split(',').map(t => t.trim()).filter(Boolean)
    });

    setShowNewEntryModal(false);
    setNewTitle('');
    setNewContent('');
    setNewSkinFeel('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-6 border-b border-[#E8DCCB] gap-4">
        <div>
          <div className="text-xs font-semibold uppercase tracking-widest text-[#96734C]">
            Personal Records
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif text-[#302B27] mt-1">
            Beauty Journal & Wishlist
          </h1>
          <p className="text-xs sm:text-sm text-[#302B27]/70 font-sans mt-1">
            Your private sanctuary for recording routine progress, skin comfort notes, and curated formulation wishlists.
          </p>
        </div>

        <button
          onClick={() => setShowNewEntryModal(true)}
          className="px-5 py-2.5 bg-[#302B27] hover:bg-[#433C37] text-white text-xs font-semibold uppercase tracking-wider rounded transition-colors flex items-center gap-2 cursor-pointer shadow-xs self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 text-[#C6A77D]" />
          <span>Record Skin Reflection</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-3 border-b border-[#E8DCCB] text-xs font-semibold">
        <button
          onClick={() => setActiveTab('reflections')}
          className={`pb-3 px-4 border-b-2 transition-colors cursor-pointer flex items-center gap-2 ${
            activeTab === 'reflections'
              ? 'border-[#96734C] text-[#302B27]'
              : 'border-transparent text-[#302B27]/50 hover:text-[#302B27]'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Journal Notes ({journalEntries.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('wishlist')}
          className={`pb-3 px-4 border-b-2 transition-colors cursor-pointer flex items-center gap-2 ${
            activeTab === 'wishlist'
              ? 'border-[#96734C] text-[#302B27]'
              : 'border-transparent text-[#302B27]/50 hover:text-[#302B27]'
          }`}
        >
          <Heart className="w-4 h-4" />
          <span>Wishlist ({wishedProducts.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('analyses')}
          className={`pb-3 px-4 border-b-2 transition-colors cursor-pointer flex items-center gap-2 ${
            activeTab === 'analyses'
              ? 'border-[#96734C] text-[#302B27]'
              : 'border-transparent text-[#302B27]/50 hover:text-[#302B27]'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Analysis History</span>
        </button>
      </div>

      {/* Tab 1: Reflections */}
      {activeTab === 'reflections' && (
        <div className="space-y-6">
          {/* Search bar */}
          <div className="relative max-w-md">
            <input
              type="text"
              placeholder="Search entries by title, note, or tag..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-[#FFFFFF] border border-[#E8DCCB] rounded-lg text-xs text-[#302B27] placeholder:text-[#302B27]/40 focus:outline-[#96734C]"
            />
            <Search className="w-4 h-4 text-[#302B27]/40 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>

          {filteredEntries.length === 0 ? (
            <div className="p-12 bg-white border border-[#E8DCCB] rounded-xl text-center space-y-3">
              <BookOpen className="w-8 h-8 text-[#96734C] mx-auto" />
              <h3 className="font-serif text-lg text-[#302B27]">No Journal Entries Found</h3>
              <p className="text-xs text-[#302B27]/60 max-w-sm mx-auto">
                Record your daily skin condition, reaction to new actives, or routine check-ins.
              </p>
              <button
                onClick={() => setShowNewEntryModal(true)}
                className="px-4 py-2 bg-[#302B27] text-white text-xs font-semibold rounded uppercase tracking-wider"
              >
                Create First Entry
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredEntries.map(entry => (
                <div
                  key={entry.id}
                  className="bg-[#FFFFFF] border border-[#E8DCCB] rounded-xl p-6 shadow-xs flex flex-col justify-between space-y-4 hover:border-[#96734C] transition-all"
                >
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2 text-xs text-[#96734C] font-semibold">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{new Date(entry.date).toLocaleDateString()}</span>
                        <span aria-hidden="true">·</span>
                        <span className="capitalize">{entry.mood}</span>
                      </div>
                      <button
                        onClick={() => deleteJournalEntry(entry.id)}
                        className="text-[#302B27]/40 hover:text-red-700 transition-colors p-1"
                        title="Delete journal entry"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <h3 className="font-serif text-xl text-[#302B27]">{entry.title}</h3>

                    <p className="text-xs text-[#302B27]/80 leading-relaxed font-sans">
                      {entry.content}
                    </p>

                    <div className="p-3 bg-[#F8F4ED] rounded-lg text-xs space-y-1">
                      <div>
                        <span className="font-semibold text-[#302B27]">Skin Feel: </span>
                        <span className="text-[#302B27]/70">{entry.skinFeel}</span>
                      </div>
                      {entry.activeProductsUsed.length > 0 && (
                        <div>
                          <span className="font-semibold text-[#302B27]">Products: </span>
                          <span className="text-[#302B27]/70">{entry.activeProductsUsed.join(', ')}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-2 border-t border-[#E8DCCB]/60">
                    {entry.tags.map(tag => (
                      <span key={tag} className="text-[11px] bg-[#F8F4ED] border border-[#E8DCCB] text-[#96734C] px-2 py-0.5 rounded">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Wishlist */}
      {activeTab === 'wishlist' && (
        <div className="space-y-6">
          {wishedProducts.length === 0 ? (
            <div className="p-12 bg-white border border-[#E8DCCB] rounded-xl text-center space-y-3">
              <Heart className="w-8 h-8 text-[#96734C] mx-auto" />
              <h3 className="font-serif text-lg text-[#302B27]">Your Wishlist is Empty</h3>
              <p className="text-xs text-[#302B27]/60 max-w-sm mx-auto">
                Explore our curated formulations and click the heart icon to save products for future rituals.
              </p>
              <button
                onClick={() => navigateTo('products')}
                className="px-6 py-2.5 bg-[#302B27] text-white text-xs font-semibold rounded uppercase tracking-wider"
              >
                Discover Formulations
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {wishedProducts.map(p => (
                <LuxuryProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Analyses History */}
      {activeTab === 'analyses' && (
        <div className="space-y-6">
          {activeAnalysis ? (
            <div className="bg-[#FFFFFF] border border-[#E8DCCB] rounded-xl p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-semibold text-[#96734C] uppercase tracking-wider">
                  Baseline Analysis Record
                </span>
                <h3 className="font-serif text-xl text-[#302B27] mt-1">
                  8-Parameter Optical Assessment ({activeAnalysis.overallScore}/100)
                </h3>
                <p className="text-xs text-[#302B27]/70 mt-1">
                  Recorded on {new Date(activeAnalysis.analyzedAt).toLocaleDateString()} · Mode: {activeAnalysis.mode}
                </p>
              </div>

              <button
                onClick={() => navigateTo('skin-results')}
                className="px-5 py-2.5 bg-[#302B27] hover:bg-[#96734C] text-white text-xs font-semibold uppercase tracking-wider rounded transition-colors self-start sm:self-auto"
              >
                View Full Results →
              </button>
            </div>
          ) : (
            <div className="p-12 bg-white border border-[#E8DCCB] rounded-xl text-center space-y-3">
              <Sparkles className="w-8 h-8 text-[#96734C] mx-auto" />
              <h3 className="font-serif text-lg text-[#302B27]">No Analysis Records Yet</h3>
              <p className="text-xs text-[#302B27]/60 max-w-sm mx-auto">
                Take an optical skin scan to begin logging historical barrier and texture markers over time.
              </p>
              <button
                onClick={() => navigateTo('skin-upload')}
                className="px-6 py-2.5 bg-[#302B27] text-white text-xs font-semibold rounded uppercase tracking-wider"
              >
                Start First Skin Scan
              </button>
            </div>
          )}
        </div>
      )}

      {/* New Journal Entry Modal */}
      {showNewEntryModal && (
        <div className="fixed inset-0 z-50 bg-black/45 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#E8DCCB] rounded-xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-[#E8DCCB] pb-3">
              <h3 className="font-serif text-xl text-[#302B27]">New Beauty Reflection</h3>
              <button
                onClick={() => setShowNewEntryModal(false)}
                className="text-[#302B27]/50 hover:text-[#302B27]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateEntry} className="space-y-4 text-xs">
              <div>
                <label className="block font-medium text-[#302B27] mb-1">Entry Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Day 7 of Ceramide Barrier Restorative Cream"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-[#F8F4ED] border border-[#E8DCCB] rounded text-xs text-[#302B27]"
                />
              </div>

              <div>
                <label className="block font-medium text-[#302B27] mb-1">Skin Reflection & Observations</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Describe skin feel, comfort level, changes in texture or barrier balance..."
                  value={newContent}
                  onChange={e => setNewContent(e.target.value)}
                  className="w-full px-3 py-2 bg-[#F8F4ED] border border-[#E8DCCB] rounded text-xs text-[#302B27]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-[#302B27] mb-1">Skin Feel State</label>
                  <input
                    type="text"
                    placeholder="e.g. Plump, Calm, No Tightness"
                    value={newSkinFeel}
                    onChange={e => setNewSkinFeel(e.target.value)}
                    className="w-full px-3 py-2 bg-[#F8F4ED] border border-[#E8DCCB] rounded text-xs text-[#302B27]"
                  />
                </div>

                <div>
                  <label className="block font-medium text-[#302B27] mb-1">Overall Mood</label>
                  <select
                    value={newMood}
                    onChange={e => setNewMood(e.target.value as any)}
                    className="w-full px-3 py-2 bg-[#F8F4ED] border border-[#E8DCCB] rounded text-xs text-[#302B27]"
                  >
                    <option value="radiant">Radiant & Glowing</option>
                    <option value="balanced">Calm & Balanced</option>
                    <option value="reactive">Mild Sensitivity / Reactive</option>
                    <option value="dry">Dry / Needs Hydration</option>
                    <option value="breakout">Congestion / Breakout</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-medium text-[#302B27] mb-1">Tags (Comma separated)</label>
                <input
                  type="text"
                  placeholder="e.g. Hydration, Vitamin C, Evening Ritual"
                  value={newTags}
                  onChange={e => setNewTags(e.target.value)}
                  className="w-full px-3 py-2 bg-[#F8F4ED] border border-[#E8DCCB] rounded text-xs text-[#302B27]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowNewEntryModal(false)}
                  className="px-4 py-2 border border-[#E8DCCB] rounded hover:bg-[#F8F4ED]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#302B27] text-white font-semibold rounded hover:bg-[#96734C]"
                >
                  Save Reflection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
