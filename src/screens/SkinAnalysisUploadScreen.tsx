import React, { useState, useRef } from 'react';
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
  Glasses
} from 'lucide-react';
import { SkinAnalysisResult } from '../types.ts';

// Sample pre-vetted portraits for instant demo testing
const SAMPLE_PORTRAITS = [
  {
    id: 'sample-1',
    name: 'Natural Diffused Lighting (Baseline Glow)',
    description: 'Even daylight, no makeup, neutral frontal gaze',
    dataUri: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="400" viewBox="0 0 300 400"><rect width="300" height="400" fill="%23EAD9D2"/><circle cx="150" cy="180" r="85" fill="%23E8DCCB"/><circle cx="125" cy="165" r="8" fill="%23302B27"/><circle cx="175" cy="165" r="8" fill="%23302B27"/><path d="M 135 210 Q 150 220 165 210" stroke="%2396734C" stroke-width="3" fill="none"/><text x="150" y="320" font-family="serif" font-size="14" fill="%23302B27" text-anchor="middle">Sample Portrait: Radiant Balanced</text></svg>'
  },
  {
    id: 'sample-2',
    name: 'Morning Hydration Assessment (Minimal Barrier)',
    description: 'Slight surface dehydration markers, clear frontal frame',
    dataUri: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="400" viewBox="0 0 300 400"><rect width="300" height="400" fill="%23F8F4ED"/><circle cx="150" cy="180" r="85" fill="%23E8DCCB"/><circle cx="125" cy="165" r="8" fill="%23302B27"/><circle cx="175" cy="165" r="8" fill="%23302B27"/><path d="M 138 212 Q 150 216 162 212" stroke="%2396734C" stroke-width="2.5" fill="none"/><text x="150" y="320" font-family="serif" font-size="14" fill="%23302B27" text-anchor="middle">Sample Portrait: Dehydration Focus</text></svg>'
  }
];

export const SkinAnalysisUploadScreen: React.FC = () => {
  const { setActiveAnalysis, navigateTo, showToast } = useApp();

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [consentChecked, setConsentChecked] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [progressStep, setProgressStep] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) validateAndSetFile(file);
  };

  const validateAndSetFile = (file: File) => {
    setErrorMessage(null);

    // Validate type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setErrorMessage('Please upload a valid image file (JPEG, PNG, or WebP).');
      return;
    }

    // Validate size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setErrorMessage('File size exceeds the 10MB limit. Please select a smaller photo.');
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

  const handleStartAnalysis = async () => {
    if (!selectedImage) {
      setErrorMessage('Please choose or upload a facial photograph.');
      return;
    }
    if (!consentChecked) {
      setErrorMessage('Please acknowledge the non-clinical cosmetic consent below to proceed.');
      return;
    }

    setErrorMessage(null);
    setLoading(true);
    setProgressStep('Validating image resolution and lighting contrast...');

    try {
      // 1. Submit analysis request to server
      const submitRes = await fetch('/api/skin/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageDataUri: selectedImage,
          consent: true
        })
      });

      if (!submitRes.ok) {
        const err = await submitRes.json();
        throw new Error(err.error || 'Failed to submit photo for skin analysis.');
      }

      const taskData = await submitRes.json();
      const taskId = taskData.taskId;

      // 2. Poll task status
      setProgressStep('Running 8-parameter optical cosmetic assessment...');
      let attempts = 0;
      const maxAttempts = 12;

      const pollInterval = setInterval(async () => {
        attempts++;
        try {
          const pollRes = await fetch(`/api/skin/status/${taskId}`);
          const pollData = await pollRes.json();

          if (pollData.status === 'SUCCESS') {
            clearInterval(pollInterval);
            setProgressStep('Mapping Skin-to-Shelf formulation recommendations...');

            // 3. Retrieve final standardized result
            const resultRes = await fetch(`/api/skin/result/${taskId}`);
            const resultData: SkinAnalysisResult = await resultRes.json();
            resultData.previewImage = selectedImage;

            setActiveAnalysis(resultData);
            setLoading(false);
            showToast('Skin intelligence analysis completed successfully', 'success');
            navigateTo('skin-results');
          } else if (pollData.status === 'FAILED') {
            clearInterval(pollInterval);
            throw new Error('Analysis processing failed. Please try another image.');
          } else if (attempts >= maxAttempts) {
            clearInterval(pollInterval);
            throw new Error('Processing timed out. Please try again.');
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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="text-xs font-semibold uppercase tracking-widest text-[#96734C]">
          AI Skin Intelligence
        </div>
        <h1 className="text-3xl sm:text-4xl font-serif text-[#302B27]">
          Optical Cosmetic Skin Analysis
        </h1>
        <p className="text-xs sm:text-sm text-[#302B27]/70 font-sans leading-relaxed">
          Upload a high-resolution bare-skin photo to evaluate 8 cosmetic parameters: texture, surface radiance, hydration index, fine line visibility, pore clarity, redness balance, contour firmness, and periorbital tone.
        </p>
      </div>

      {/* Guidelines Strip */}
      <div className="bg-[#FFFFFF] border border-[#E8DCCB] rounded-xl p-5 shadow-xs">
        <div className="text-xs font-semibold text-[#302B27] uppercase tracking-wider mb-3">
          Guidelines for Optimal Accuracy
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
      <div className="bg-[#FFFFFF] border border-[#E8DCCB] rounded-2xl p-8 shadow-xs space-y-6">
        
        {errorMessage && (
          <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
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
                onClick={() => setSelectedImage(null)}
                className="absolute top-3 right-3 p-1.5 rounded-full bg-black/60 text-white hover:bg-black transition-colors"
                title="Remove photo"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="text-center text-xs text-[#302B27]/60">
              Photo loaded and ready for non-clinical cosmetic analysis.
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
        {!selectedImage && (
          <div className="pt-2 border-t border-[#E8DCCB]">
            <div className="text-xs font-semibold text-[#302B27] mb-2">Or choose a pre-configured sample portrait for instant demonstration:</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {SAMPLE_PORTRAITS.map(sample => (
                <button
                  key={sample.id}
                  type="button"
                  onClick={() => setSelectedImage(sample.dataUri)}
                  className="p-3 bg-[#F8F4ED] hover:bg-[#E8DCCB]/60 border border-[#E8DCCB] rounded-lg text-left transition-colors cursor-pointer flex items-center justify-between"
                >
                  <div>
                    <div className="text-xs font-semibold text-[#302B27]">{sample.name}</div>
                    <div className="text-[11px] text-[#302B27]/60 mt-0.5">{sample.description}</div>
                  </div>
                  <Sparkles className="w-4 h-4 text-[#96734C] shrink-0 ml-2" />
                </button>
              ))}
            </div>
          </div>
        )}

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
            <div className="p-4 bg-[#F8F4ED] border border-[#E8DCCB] rounded-xl text-center space-y-2">
              <div className="flex items-center justify-center gap-2 text-xs font-semibold text-[#96734C]">
                <Sparkles className="w-4 h-4 animate-spin text-[#96734C]" />
                <span>{progressStep}</span>
              </div>
              <p className="text-[11px] text-[#302B27]/60">
                Contacting skin intelligence engine · Calculating surface reflectance metrics
              </p>
            </div>
          ) : (
            <button
              onClick={handleStartAnalysis}
              disabled={!selectedImage || !consentChecked}
              className="w-full py-3.5 bg-[#302B27] hover:bg-[#433C37] disabled:bg-[#302B27]/40 text-white text-xs font-semibold uppercase tracking-widest rounded-lg transition-all cursor-pointer shadow-md disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-[#C6A77D]" />
              <span>Analyze Skin & Formulate Recommendations</span>
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
          className="text-[#96734C] font-semibold hover:underline"
        >
          Read Data Rights Charter →
        </button>
      </div>

    </div>
  );
};
