import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext.tsx';
import {
  Upload,
  Sparkles,
  Camera,
  CheckCircle2,
  AlertCircle,
  X,
  ShieldCheck,
  Lock,
  Sun,
  Smile,
  Glasses,
  Zap,
  Info,
  RefreshCw,
  Cpu
} from 'lucide-react';
import { SkinAnalysisResult } from '../types.ts';

// Sample pre-vetted portraits for instant demo testing
const SAMPLE_PORTRAITS = [
  {
    id: 'sample-1',
    name: 'Natural Diffused Lighting (Baseline Glow)',
    badge: 'Balanced Glow Profile',
    expectedScore: '88% Overall',
    description: 'Calibrated baseline skin in daylight: high radiance, balanced hydration, minimal erythema.',
    dataUri: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="400" viewBox="0 0 300 400"><rect width="300" height="400" fill="%23EAD9D2"/><circle cx="150" cy="180" r="85" fill="%23E8DCCB"/><circle cx="125" cy="165" r="8" fill="%23302B27"/><circle cx="175" cy="165" r="8" fill="%23302B27"/><path d="M 135 210 Q 150 220 165 210" stroke="%2396734C" stroke-width="3" fill="none"/><text x="150" y="320" font-family="serif" font-size="14" fill="%23302B27" text-anchor="middle">Sample Portrait: Radiant Balanced</text></svg>'
  },
  {
    id: 'sample-2',
    name: 'Morning Hydration Assessment (Dehydration Marker)',
    badge: 'Dehydration Focus Profile',
    expectedScore: '73% Overall',
    description: 'Calibrated superficial dehydration: subdued radiance, epidermal moisture deficit, slight micro-creases.',
    dataUri: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="400" viewBox="0 0 300 400"><rect width="300" height="400" fill="%23F8F4ED"/><circle cx="150" cy="180" r="85" fill="%23E8DCCB"/><circle cx="125" cy="165" r="8" fill="%23302B27"/><circle cx="175" cy="165" r="8" fill="%23302B27"/><path d="M 138 212 Q 150 216 162 212" stroke="%2396734C" stroke-width="2.5" fill="none"/><text x="150" y="320" font-family="serif" font-size="14" fill="%23302B27" text-anchor="middle">Sample Portrait: Dehydration Focus</text></svg>'
  }
];

export const SkinAnalysisUploadScreen: React.FC = () => {
  const { setActiveAnalysis, navigateTo, showToast } = useApp();

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedSampleId, setSelectedSampleId] = useState<string | null>(null);
  const [consentChecked, setConsentChecked] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const [progressStep, setProgressStep] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [scanMode, setScanMode] = useState<'demo' | 'live'>('demo');
  const [apiConfig, setApiConfig] = useState<{
    configured: boolean;
    provider: string;
    message: string;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Check backend YouCam API configuration on mount
  useEffect(() => {
    fetch('/api/skin/config')
      .then(res => res.json())
      .then(data => {
        setApiConfig(data);
        if (data.configured) {
          setScanMode('live');
        } else {
          setScanMode('demo');
        }
      })
      .catch(err => {
        console.warn('Could not check skin config:', err);
      });
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) validateAndSetFile(file);
  };

  const validateAndSetFile = (file: File) => {
    setErrorMessage(null);
    setSelectedSampleId(null);

    // Validate type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setErrorMessage('Please upload a valid facial image file (JPEG, PNG, or WebP).');
      return;
    }

    // Validate size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setErrorMessage(`File size (${(file.size / (1024 * 1024)).toFixed(1)}MB) exceeds the 10MB limit. Please select a smaller photo.`);
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setSelectedImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) validateAndSetFile(file);
  };

  const selectSample = (sample: typeof SAMPLE_PORTRAITS[0]) => {
    setErrorMessage(null);
    setSelectedImage(sample.dataUri);
    setSelectedSampleId(sample.id);
  };

  const handleStartAnalysis = async () => {
    if (!selectedImage) {
      setErrorMessage('Please choose a photo or select one of the calibrated sample portraits.');
      return;
    }
    if (!consentChecked) {
      setErrorMessage('Please acknowledge the non-clinical cosmetic consent below to proceed.');
      return;
    }

    setErrorMessage(null);
    setLoading(true);
    setProgressPercent(15);
    setProgressStep('Validating image resolution, aspect ratio, and lighting balance...');

    try {
      // 1. Submit analysis request to server
      const submitRes = await fetch('/api/skin/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageDataUri: selectedImage,
          consent: true,
          requestedMode: scanMode,
          sampleId: selectedSampleId || undefined
        })
      });

      if (!submitRes.ok) {
        const err = await submitRes.json();
        throw new Error(err.error || 'Failed to submit photo for skin analysis.');
      }

      const taskData = await submitRes.json();
      const taskId = taskData.taskId;

      // 2. Poll task status
      setProgressPercent(40);
      setProgressStep(
        scanMode === 'live'
          ? 'Contacting Perfect Corp YouCam Cloud API for 8-parameter analysis...'
          : 'Running deterministic cosmetic optical analysis across 8 parameters...'
      );

      let attempts = 0;
      const maxAttempts = 15;

      const pollInterval = setInterval(async () => {
        attempts++;
        try {
          const pollRes = await fetch(`/api/skin/status/${taskId}`);
          if (!pollRes.ok) {
            const pollErr = await pollRes.json();
            throw new Error(pollErr.error || 'Failed to check analysis progress.');
          }

          const pollData = await pollRes.json();

          if (pollData.progress) {
            setProgressPercent(Math.min(95, Math.max(progressPercent, pollData.progress)));
          }

          if (pollData.status === 'SUCCESS') {
            clearInterval(pollInterval);
            setProgressPercent(95);
            setProgressStep('Calibrating Skin-to-Shelf formulation recommendations...');

            // 3. Retrieve final standardized result
            const resultRes = await fetch(`/api/skin/result/${taskId}`);
            if (!resultRes.ok) {
              const resErr = await resultRes.json();
              throw new Error(resErr.error || 'Failed to retrieve completed analysis.');
            }

            const resultData: SkinAnalysisResult = await resultRes.json();
            resultData.previewImage = selectedImage;

            // Clear old cache, set new latest analysis
            setActiveAnalysis(resultData);
            setProgressPercent(100);
            setLoading(false);
            showToast('Skin analysis completed successfully', 'success');
            navigateTo('skin-results');
          } else if (pollData.status === 'FAILED') {
            clearInterval(pollInterval);
            throw new Error(pollData.error || 'Analysis processing failed. Please try another image.');
          } else if (attempts >= maxAttempts) {
            clearInterval(pollInterval);
            throw new Error('Analysis request timed out. Please try again or switch to Demo Mode.');
          }
        } catch (e: any) {
          clearInterval(pollInterval);
          setLoading(false);
          setErrorMessage(e.message || 'Error occurred during analysis polling.');
        }
      }, 1000);

    } catch (err: any) {
      setLoading(false);
      setErrorMessage(err.message || 'An unexpected error occurred during submission.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="text-xs font-semibold uppercase tracking-widest text-[#96734C]">
          AI Skin Intelligence
        </div>
        <h1 className="text-3xl sm:text-4xl font-serif text-[#302B27]">
          Optical Cosmetic Skin Analysis
        </h1>
        <p className="text-xs sm:text-sm text-[#302B27]/70 font-sans leading-relaxed">
          Upload a high-resolution bare-skin photograph to evaluate 8 cosmetic parameters: texture, surface radiance, hydration index, fine line visibility, pore clarity, redness balance, contour firmness, and periorbital tone.
        </p>
      </div>

      {/* Engine Selection & Live API Status */}
      <div className="bg-[#FFFFFF] border border-[#E8DCCB] rounded-2xl p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-[#302B27] flex items-center gap-2">
              <Cpu className="w-4 h-4 text-[#96734C]" />
              <span>Skin Analysis Engine Mode</span>
            </div>
            <p className="text-[11px] text-[#302B27]/60 mt-0.5">
              Select between the live Perfect Corp YouCam Cloud API and the offline Demo Simulation Mode.
            </p>
          </div>

          {/* Mode Switcher Segmented Control */}
          <div className="flex items-center p-1 bg-[#F8F4ED] rounded-xl border border-[#E8DCCB] self-start sm:self-auto">
            <button
              type="button"
              onClick={() => { setScanMode('demo'); setErrorMessage(null); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                scanMode === 'demo'
                  ? 'bg-[#302B27] text-white shadow-xs font-semibold'
                  : 'text-[#302B27]/70 hover:text-[#302B27]'
              }`}
            >
              Demo Simulation Mode
            </button>
            <button
              type="button"
              onClick={() => { setScanMode('live'); setErrorMessage(null); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                scanMode === 'live'
                  ? 'bg-[#302B27] text-white shadow-xs font-semibold'
                  : 'text-[#302B27]/70 hover:text-[#302B27]'
              }`}
            >
              <Zap className="w-3 h-3 text-[#C6A77D]" />
              <span>Live YouCam API</span>
            </button>
          </div>
        </div>

        {/* Status Callout Banner */}
        <div className={`p-3.5 rounded-xl border text-xs flex items-start justify-between gap-3 ${
          scanMode === 'live' && apiConfig?.configured
            ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
            : scanMode === 'live' && !apiConfig?.configured
            ? 'bg-amber-50/70 border-amber-200 text-amber-900'
            : 'bg-[#F8F4ED] border-[#E8DCCB] text-[#302B27]/80'
        }`}>
          <div className="flex items-start gap-2.5">
            <Info className={`w-4 h-4 shrink-0 mt-0.5 ${
              scanMode === 'live' && apiConfig?.configured ? 'text-emerald-700' : 'text-[#96734C]'
            }`} />
            <div>
              {scanMode === 'live' && apiConfig?.configured && (
                <div>
                  <strong className="block text-emerald-900 font-semibold">Perfect Corp YouCam Cloud API: Ready</strong>
                  <span className="text-[11px] text-emerald-800">
                    Live enterprise connection active. Uploaded bare-skin photos are transmitted directly to YouCam's cosmetic skin assessment endpoint.
                  </span>
                </div>
              )}

              {scanMode === 'live' && !apiConfig?.configured && (
                <div>
                  <strong className="block text-amber-900 font-semibold">Live YouCam API Key Pending</strong>
                  <span className="text-[11px] text-amber-800">
                    To activate live scanning, configure <code className="bg-amber-100 px-1 py-0.5 rounded text-[10px]">YOUCAM_API_KEY</code> in your environment variables. You can test immediately using Demo Mode.
                  </span>
                </div>
              )}

              {scanMode === 'demo' && (
                <div>
                  <strong className="block text-[#302B27] font-semibold">Deterministic Demo Mode Active</strong>
                  <span className="text-[11px] text-[#302B27]/70">
                    Calculates authentic 8-parameter scores dynamically based on uploaded photo pixel/color attributes and hash distributions (never static identical scores).
                  </span>
                </div>
              )}
            </div>
          </div>

          {scanMode === 'live' && !apiConfig?.configured && (
            <button
              type="button"
              onClick={() => { setScanMode('demo'); setErrorMessage(null); }}
              className="px-2.5 py-1 bg-amber-200 hover:bg-amber-300 text-amber-900 font-medium text-[11px] rounded-lg shrink-0 transition-colors cursor-pointer"
            >
              Switch to Demo
            </button>
          )}
        </div>
      </div>

      {/* Guidelines Strip */}
      <div className="bg-[#FFFFFF] border border-[#E8DCCB] rounded-xl p-5 shadow-xs">
        <div className="text-xs font-semibold text-[#302B27] uppercase tracking-wider mb-3">
          Guidelines for Optimal Optical Accuracy
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs text-[#302B27]/80">
          <div className="flex items-start gap-2">
            <Sun className="w-4 h-4 text-[#96734C] shrink-0 mt-0.5" />
            <span>Natural diffused daylight; avoid harsh flash glare.</span>
          </div>
          <div className="flex items-start gap-2">
            <Smile className="w-4 h-4 text-[#96734C] shrink-0 mt-0.5" />
            <span>Maintain a neutral, relaxed facial expression.</span>
          </div>
          <div className="flex items-start gap-2">
            <Glasses className="w-4 h-4 text-[#96734C] shrink-0 mt-0.5" />
            <span>Remove eyeglasses and pull back stray hair.</span>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#96734C] shrink-0 mt-0.5" />
            <span>Freshly cleansed skin without heavy foundation.</span>
          </div>
        </div>
      </div>

      {/* Upload Box / Dropzone */}
      <div className="bg-[#FFFFFF] border border-[#E8DCCB] rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
        
        {errorMessage && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-800 text-xs rounded-xl flex items-start justify-between gap-3">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block font-semibold">Analysis Notice</strong>
                <p className="mt-0.5 leading-relaxed">{errorMessage}</p>
              </div>
            </div>
            {errorMessage.includes('temporarily unavailable') && (
              <button
                type="button"
                onClick={() => {
                  setScanMode('demo');
                  setErrorMessage(null);
                  handleStartAnalysis();
                }}
                className="px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-900 rounded-lg text-xs font-semibold shrink-0 cursor-pointer"
              >
                Run with Demo Mode
              </button>
            )}
          </div>
        )}

        {selectedImage ? (
          /* Preview Mode */
          <div className="space-y-4">
            <div className="relative max-w-sm mx-auto rounded-xl overflow-hidden border border-[#E8DCCB] bg-[#F8F4ED]">
              <img
                src={selectedImage}
                alt="Selected portrait preview"
                className="w-full h-80 object-cover"
              />
              <button
                onClick={() => { setSelectedImage(null); setSelectedSampleId(null); }}
                className="absolute top-3 right-3 p-1.5 rounded-full bg-black/60 text-white hover:bg-black transition-colors cursor-pointer"
                title="Remove photo"
              >
                <X className="w-4 h-4" />
              </button>

              {selectedSampleId && (
                <div className="absolute bottom-3 left-3 right-3 bg-white/95 backdrop-blur-xs p-2.5 rounded-lg border border-[#E8DCCB] text-[11px] text-[#302B27]">
                  <span className="font-semibold text-[#96734C] block uppercase tracking-wider text-[10px]">
                    Calibrated Benchmark Sample
                  </span>
                  {selectedSampleId === 'sample-1'
                    ? 'Sample 1: Natural Diffused Lighting (Expected Score ~88%)'
                    : 'Sample 2: Morning Hydration Focus (Expected Score ~73%)'}
                </div>
              )}
            </div>
            <div className="text-center text-xs text-[#302B27]/60">
              Photo loaded and validated. Ready for non-clinical cosmetic analysis.
            </div>
          </div>
        ) : (
          /* Dropzone Mode */
          <div
            onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-colors space-y-4 ${
              isDragging
                ? 'border-[#96734C] bg-[#F8F4ED]'
                : 'border-[#E8DCCB] hover:border-[#96734C] bg-[#F8F4ED]/30'
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
            />
            <div className="w-14 h-14 rounded-full bg-[#FFFFFF] border border-[#E8DCCB] flex items-center justify-center text-[#96734C] mx-auto shadow-xs">
              <Upload className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-semibold text-[#302B27]">
                Click to browse photo or drag and drop image here
              </p>
              <p className="text-xs text-[#302B27]/60 mt-1">
                Supports high-resolution JPEG, PNG, or WebP up to 10MB
              </p>
            </div>
          </div>
        )}

        {/* Quick Sample Selector for Rapid Testing */}
        <div className="pt-2 border-t border-[#E8DCCB]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-[#302B27]">
              Or choose a calibrated sample portrait for instant comparison:
            </span>
            <span className="text-[11px] text-[#96734C]">
              Noticeably distinct results guaranteed
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {SAMPLE_PORTRAITS.map(sample => {
              const isSelected = selectedSampleId === sample.id;
              return (
                <button
                  key={sample.id}
                  type="button"
                  onClick={() => selectSample(sample)}
                  className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex items-start justify-between gap-3 ${
                    isSelected
                      ? 'border-[#96734C] bg-[#F8F4ED] shadow-xs'
                      : 'border-[#E8DCCB] bg-[#FFFFFF] hover:border-[#C6A77D]'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-[#302B27]">{sample.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#EAD9D2] text-[#302B27]">
                        {sample.badge}
                      </span>
                      <span className="text-[10px] text-[#96734C] font-semibold">
                        {sample.expectedScore}
                      </span>
                    </div>
                    <div className="text-[11px] text-[#302B27]/60 leading-snug">
                      {sample.description}
                    </div>
                  </div>
                  <Sparkles className={`w-4 h-4 shrink-0 mt-1 ${
                    isSelected ? 'text-[#96734C]' : 'text-[#302B27]/40'
                  }`} />
                </button>
              );
            })}
          </div>
        </div>

        {/* Consent Checkbox (Strict Anti-Insecurity & Non-Medical Requirement) */}
        <div className="p-4 bg-[#F8F4ED] rounded-xl border border-[#E8DCCB] space-y-2">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={consentChecked}
              onChange={e => setConsentChecked(e.target.checked)}
              className="mt-0.5 h-4 w-4 text-[#96734C] rounded border-[#E8DCCB] focus:ring-[#96734C]"
            />
            <span className="text-xs text-[#302B27] leading-relaxed">
              <strong>Explicit Cosmetic Consent:</strong> I acknowledge that GLOWVERSE AI provides an optical, non-clinical cosmetic skin assessment for personal beauty routine guidance. I understand this does NOT constitute a medical diagnosis, clinical evaluation, or treatment plan. My photograph is processed ephemerally and is not permanently stored or shared without explicit permission.
            </span>
          </label>
        </div>

        {/* Submission Action & Progress */}
        <div>
          {loading ? (
            <div className="p-5 bg-[#F8F4ED] border border-[#E8DCCB] rounded-xl text-center space-y-3">
              <div className="flex items-center justify-between text-xs text-[#302B27]">
                <span className="font-semibold text-[#96734C] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 animate-spin" />
                  <span>{progressStep}</span>
                </span>
                <span className="font-bold tabular-nums text-[#302B27]">{progressPercent}%</span>
              </div>

              {/* Real Progress Bar */}
              <div className="w-full h-2 bg-white rounded-full overflow-hidden border border-[#E8DCCB]">
                <div
                  className="h-full bg-[#96734C] rounded-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              <p className="text-[11px] text-[#302B27]/60">
                {scanMode === 'live'
                  ? 'Transmitting optical frames to Perfect Corp YouCam Cloud API...'
                  : 'Synthesizing surface reflectance metrics across 8 parameters...'}
              </p>
            </div>
          ) : (
            <button
              onClick={handleStartAnalysis}
              disabled={!selectedImage || !consentChecked}
              className="w-full py-3.5 bg-[#302B27] hover:bg-[#433C37] disabled:bg-[#302B27]/40 text-white text-xs font-semibold uppercase tracking-widest rounded-lg transition-all cursor-pointer shadow-md disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-[#C6A77D]" />
              <span>
                {scanMode === 'live'
                  ? 'Analyze with Live YouCam API & Recommend Formulations'
                  : 'Analyze Skin & Formulate Recommendations (Demo)'}
              </span>
            </button>
          )}
        </div>

      </div>

      {/* Privacy & Ethical Guarantee Notice */}
      <div className="p-4 rounded-xl border border-[#E8DCCB] bg-[#FFFFFF] flex items-center justify-between text-xs text-[#302B27]/70">
        <div className="flex items-center gap-2">
          <Lock className="w-4 h-4 text-[#96734C]" />
          <span>End-to-End Ephemeral Photo Security Guarantee</span>
        </div>
        <button
          onClick={() => navigateTo('privacy')}
          className="text-[#96734C] font-semibold hover:underline cursor-pointer"
        >
          Read Data Rights Charter →
        </button>
      </div>

    </div>
  );
};
