import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext.tsx';
import {
  ShieldCheck,
  Lock,
  Download,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Mail,
  FileText,
  UserCheck
} from 'lucide-react';

export const SettingsAndPrivacyScreen: React.FC = () => {
  const { user, profile, journalEntries, routines, wishlist, showToast, logoutUser } = useApp();

  const [allowImageProcessing, setAllowImageProcessing] = useState(true);
  const [storeHistory, setStoreHistory] = useState(true);
  const [personalizedRecs, setPersonalizedRecs] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [purging, setPurging] = useState(false);
  const [privacyPolicyOpen, setPrivacyPolicyOpen] = useState(false);
  const [termsOpen, setTermsOpen] = useState(false);

  // Load preferences from API
  useEffect(() => {
    async function loadPrefs() {
      try {
        const res = await fetch('/api/privacy/preferences');
        if (res.ok) {
          const data = await res.json();
          setAllowImageProcessing(data.allowTemporaryImageProcessing ?? true);
          setStoreHistory(data.storeAnalysisHistory ?? true);
          setPersonalizedRecs(data.allowPersonalizedRecommendations ?? true);
          setMarketingEmails(data.marketingEmails ?? false);
        }
      } catch (e) {
        console.error(e);
      }
    }
    loadPrefs();
  }, []);

  const handleSavePreferences = async () => {
    try {
      const res = await fetch('/api/privacy/preferences', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          allowTemporaryImageProcessing: allowImageProcessing,
          storeAnalysisHistory: storeHistory,
          allowPersonalizedRecommendations: personalizedRecs,
          marketingEmails
        })
      });
      if (res.ok) {
        showToast('Privacy preferences updated successfully', 'success');
      }
    } catch (e) {
      showToast('Error saving preferences', 'alert');
    }
  };

  const handleExportData = () => {
    const exportBundle = {
      user,
      profile,
      routines,
      journalEntries,
      wishlist,
      exportedAt: new Date().toISOString(),
      platform: 'GLOWVERSE AI'
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(exportBundle, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `glowverse_user_data_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    showToast('Your complete data bundle was exported successfully', 'success');
  };

  const handlePurgeAllData = async () => {
    setPurging(true);
    try {
      const res = await fetch('/api/privacy/delete-request', {
        method: 'POST'
      });
      if (res.ok) {
        setPurging(false);
        setDeleteModalOpen(false);
        showToast('All your personal records have been completely purged from servers', 'info');
        logoutUser();
      }
    } catch (e) {
      setPurging(false);
      showToast('Error processing data deletion', 'alert');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Header */}
      <div className="pb-6 border-b border-[#E8DCCB] space-y-1">
        <div className="text-xs font-semibold uppercase tracking-widest text-[#96734C]">
          Governance & Data Rights
        </div>
        <h1 className="text-3xl font-serif text-[#302B27]">
          Privacy Settings & Data Autonomy
        </h1>
        <p className="text-xs sm:text-sm text-[#302B27]/70 font-sans mt-1">
          Full control over your facial data, analysis history, personal notes, and account deletion.
        </p>
      </div>

      {/* Privacy Preferences Toggles */}
      <div className="bg-[#FFFFFF] border border-[#E8DCCB] rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex items-center gap-2 border-b border-[#E8DCCB] pb-3">
          <Lock className="w-5 h-5 text-[#96734C]" />
          <h2 className="font-serif text-xl text-[#302B27]">Facial Processing & Data Permissions</h2>
        </div>

        <div className="space-y-5 text-xs">
          
          <label className="flex items-start justify-between gap-4 cursor-pointer">
            <div>
              <div className="font-semibold text-sm text-[#302B27]">Allow Ephemeral Image Processing</div>
              <div className="text-[#302B27]/70 mt-0.5">
                Required for AI skin analysis scans. Photographs are processed temporarily in volatile memory and deleted immediately after optical feature extraction.
              </div>
            </div>
            <input
              type="checkbox"
              checked={allowImageProcessing}
              onChange={e => setAllowImageProcessing(e.target.checked)}
              className="mt-1 h-5 w-5 text-[#96734C] rounded border-[#E8DCCB] focus:ring-[#96734C]"
            />
          </label>

          <div className="border-t border-[#E8DCCB]/60 pt-4" />

          <label className="flex items-start justify-between gap-4 cursor-pointer">
            <div>
              <div className="font-semibold text-sm text-[#302B27]">Retain Numerical Analysis History</div>
              <div className="text-[#302B27]/70 mt-0.5">
                Allows saving non-image score metrics (texture, hydration, radiance) to monitor cosmetic progress over time in your Beauty Journal.
              </div>
            </div>
            <input
              type="checkbox"
              checked={storeHistory}
              onChange={e => setStoreHistory(e.target.checked)}
              className="mt-1 h-5 w-5 text-[#96734C] rounded border-[#E8DCCB] focus:ring-[#96734C]"
            />
          </label>

          <div className="border-t border-[#E8DCCB]/60 pt-4" />

          <label className="flex items-start justify-between gap-4 cursor-pointer">
            <div>
              <div className="font-semibold text-sm text-[#302B27]">Personalized Formulation Matching</div>
              <div className="text-[#302B27]/70 mt-0.5">
                Enables Skin-to-Shelf intelligence to match active ingredients directly to your current skin parameters.
              </div>
            </div>
            <input
              type="checkbox"
              checked={personalizedRecs}
              onChange={e => setPersonalizedRecs(e.target.checked)}
              className="mt-1 h-5 w-5 text-[#96734C] rounded border-[#E8DCCB] focus:ring-[#96734C]"
            />
          </label>

          <div className="border-t border-[#E8DCCB]/60 pt-4" />

          <label className="flex items-start justify-between gap-4 cursor-pointer">
            <div>
              <div className="font-semibold text-sm text-[#302B27]">Product Launches & Editorial Briefings</div>
              <div className="text-[#302B27]/70 mt-0.5">
                Occasional luxury dispatches on formulation breakthroughs and seasonal skin barrier defense.
              </div>
            </div>
            <input
              type="checkbox"
              checked={marketingEmails}
              onChange={e => setMarketingEmails(e.target.checked)}
              className="mt-1 h-5 w-5 text-[#96734C] rounded border-[#E8DCCB] focus:ring-[#96734C]"
            />
          </label>

        </div>

        <div className="pt-2">
          <button
            onClick={handleSavePreferences}
            className="px-6 py-2.5 bg-[#302B27] hover:bg-[#433C37] text-white text-xs font-semibold uppercase tracking-wider rounded transition-colors"
          >
            Save Privacy Preferences
          </button>
        </div>
      </div>

      {/* Data Export & Deletion */}
      <div className="bg-[#FFFFFF] border border-[#E8DCCB] rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
        <h2 className="font-serif text-xl text-[#302B27] border-b border-[#E8DCCB] pb-3">
          Data Portability & Erasure Rights
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          
          {/* Export */}
          <div className="p-5 bg-[#F8F4ED] rounded-xl border border-[#E8DCCB] flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 font-semibold text-sm text-[#302B27]">
                <Download className="w-4 h-4 text-[#96734C]" />
                <span>Download Personal Data Archive</span>
              </div>
              <p className="text-[#302B27]/70 leading-relaxed">
                Receive an immediate machine-readable JSON bundle containing your saved routines, skin analysis scores, journal notes, and wishlist.
              </p>
            </div>
            <button
              onClick={handleExportData}
              className="px-4 py-2.5 bg-white hover:bg-[#E8DCCB] border border-[#E8DCCB] text-[#302B27] font-semibold rounded text-xs transition-colors self-start cursor-pointer"
            >
              Export JSON Archive
            </button>
          </div>

          {/* Delete All Data */}
          <div className="p-5 bg-red-50/50 rounded-xl border border-red-200/80 flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 font-semibold text-sm text-red-900">
                <Trash2 className="w-4 h-4 text-red-700" />
                <span>Permanent Data Purge & Account Erasure</span>
              </div>
              <p className="text-red-800/80 leading-relaxed">
                Irreversibly delete all personal analyses, custom routine sequences, journal entries, and profile settings from GLOWVERSE AI servers.
              </p>
            </div>
            <button
              onClick={() => setDeleteModalOpen(true)}
              className="px-4 py-2.5 bg-red-700 hover:bg-red-800 text-white font-semibold rounded text-xs transition-colors self-start cursor-pointer"
            >
              Request Data Deletion
            </button>
          </div>

        </div>
      </div>

      {/* Legal & Policies */}
      <div className="bg-[#FFFFFF] border border-[#E8DCCB] rounded-2xl p-6 sm:p-8 shadow-xs space-y-4">
        <h2 className="font-serif text-xl text-[#302B27] border-b border-[#E8DCCB] pb-3">
          Legal Charters & Disclaimers
        </h2>

        <div className="flex flex-wrap gap-3 text-xs">
          <button
            onClick={() => setPrivacyPolicyOpen(!privacyPolicyOpen)}
            className="px-4 py-2 bg-[#F8F4ED] hover:bg-[#E8DCCB] border border-[#E8DCCB] rounded font-semibold text-[#302B27] transition-colors"
          >
            {privacyPolicyOpen ? 'Hide Privacy Policy' : 'View Full Privacy Policy'}
          </button>
          <button
            onClick={() => setTermsOpen(!termsOpen)}
            className="px-4 py-2 bg-[#F8F4ED] hover:bg-[#E8DCCB] border border-[#E8DCCB] rounded font-semibold text-[#302B27] transition-colors"
          >
            {termsOpen ? 'Hide Terms of Use' : 'View Terms of Use'}
          </button>
        </div>

        {privacyPolicyOpen && (
          <div className="p-4 bg-[#F8F4ED] rounded-xl text-xs text-[#302B27]/80 space-y-2 leading-relaxed">
            <h4 className="font-semibold text-[#302B27]">GLOWVERSE AI Privacy Charter</h4>
            <p>
              1. <strong>Zero Permanent Biometric Storage:</strong> Facial images uploaded for skin assessment are decoded into optical reflectance vectors and immediately released from memory. No facial recognition templates or persistent biometric databases are constructed.
            </p>
            <p>
              2. <strong>Non-Medical Scope:</strong> Our algorithms provide cosmetic surface metrics solely for cosmetic education. Data is never shared with health insurers, third-party brokers, or clinical diagnostic repositories.
            </p>
            <p>
              3. <strong>Right to Erasure:</strong> Users may purge their history at any time using the one-click deletion control above.
            </p>
          </div>
        )}

        {termsOpen && (
          <div className="p-4 bg-[#F8F4ED] rounded-xl text-xs text-[#302B27]/80 space-y-2 leading-relaxed">
            <h4 className="font-semibold text-[#302B27]">Terms of Use & Cosmetic Disclaimer</h4>
            <p>
              By utilizing GLOWVERSE AI, you acknowledge that all skin parameters, routine recommendations, and assistant dialogues are purely informational and cosmetic in nature. They do not constitute medical or dermatological diagnosis. For medical skin conditions, consult a licensed healthcare professional.
            </p>
          </div>
        )}

        <div className="pt-4 border-t border-[#E8DCCB] text-xs text-[#302B27]/70 flex items-center justify-between">
          <div>Customer Care & Ethics Office: <span className="font-semibold text-[#302B27]">ethics@glowverse.ai</span></div>
          <div className="text-[#302B27]/50">ISO 27001 & GDPR Compliant Architecture</div>
        </div>
      </div>

      {/* Confirmation Modal for Permanent Purge */}
      {deleteModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#E8DCCB] rounded-xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-700 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-xl text-center text-[#302B27]">Confirm Irreversible Data Purge</h3>
            <p className="text-xs text-[#302B27]/70 text-center leading-relaxed">
              Are you certain you wish to permanently purge all your recorded skin analysis parameters, routine rituals, journal notes, and profile settings? This action cannot be undone.
            </p>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setDeleteModalOpen(false)}
                className="flex-1 py-2.5 bg-[#F8F4ED] text-[#302B27] rounded text-xs font-semibold hover:bg-[#E8DCCB]"
              >
                Cancel
              </button>
              <button
                onClick={handlePurgeAllData}
                disabled={purging}
                className="flex-1 py-2.5 bg-red-700 hover:bg-red-800 text-white rounded text-xs font-semibold uppercase tracking-wider"
              >
                {purging ? 'Purging...' : 'Permanently Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
