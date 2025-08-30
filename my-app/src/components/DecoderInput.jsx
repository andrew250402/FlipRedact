import React, { useState } from 'react';

export default function DecoderInput({ piiMapping, decodePII, isDarkMode }) {
  const [encodedText, setEncodedText] = useState('');
  const [decodedText, setDecodedText] = useState('');
  const [copied, setCopied] = useState(false);

  const handleDecode = () => {
    const decoded = decodePII(encodedText);
    setDecodedText(decoded);
    setCopied(false);
  };

  const handleCopy = async () => {
    if (!decodedText) return;
    try {
      await navigator.clipboard.writeText(decodedText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  // Theme-aware classes
  const containerClasses = isDarkMode
    ? "bg-gray-800 border-gray-600"
    : "bg-white border-gray-200";
    
  const textareaClasses = isDarkMode
    ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-blue-400 focus:border-blue-400"
    : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-blue-500 focus:border-blue-500";
    
  const mainButtonClasses = isDarkMode
    ? "bg-blue-600 hover:bg-blue-700"
    : "bg-blue-600 hover:bg-blue-700";
    
  const resultClasses = isDarkMode
    ? "bg-gray-700 border-gray-600 text-gray-300"
    : "bg-gray-100 border-gray-300 text-gray-800";

  return (
    <div className={`mt-6 p-6 rounded-lg border ${containerClasses}`}>
      <h3 className="text-lg font-semibold mb-4">PII Decoder</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left: Encoded text input */}
        <div className="flex flex-col">
          <label className="text-sm font-medium mb-2">
            Redacted Text 
          </label>
          <textarea
            value={encodedText}
            onChange={(e) => setEncodedText(e.target.value)}
            placeholder="Paste redacted text here..."
            rows={6}
            className={`w-full p-3 rounded-lg border resize-none focus:outline-none focus:ring-2 transition-colors ${textareaClasses}`}
          />
        </div>
        
        {/* Right: Decoded text output */}
        <div className="flex flex-col">
          <label className="text-sm font-medium mb-2">
            Unredacted Text (original PII restored)
          </label>
          <div className={`w-full p-3 rounded-lg border min-h-[152px] max-h-[152px] overflow-y-auto break-words whitespace-pre-wrap ${resultClasses}`}>
            {decodedText || <span className="text-gray-500 italic">Decoded text will appear here...</span>}
          </div>
        </div>
      </div>
      
      {/* Buttons row */}
      <div className="mt-4 flex justify-between">
        <button
          onClick={handleDecode}
          disabled={!encodedText.trim() || piiMapping.size === 0}
          className={`px-6 py-2 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${mainButtonClasses}`}
        >
          Decode PII
        </button>
        <button
          onClick={handleCopy}
          disabled={!decodedText}
          className={`px-6 py-2 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${mainButtonClasses}`}
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
      
      {piiMapping.size === 0 && (
        <p className="mt-2 text-sm text-gray-500 italic">
          Note: Run PII detection and apply redactions first to enable decoding.
        </p>
      )}
    </div>
  );
}