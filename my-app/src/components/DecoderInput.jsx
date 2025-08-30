import React, { useState } from "react";

export default function DecoderInput({ piiMapping, decodePII }) {
  const [inputText, setInputText] = useState("");
  const [decodedText, setDecodedText] = useState("");

  const handleDecode = () => {
    const decoded = decodePII(inputText);
    setDecodedText(decoded);
  };

  const copyDecodedText = async () => {
    try {
      await navigator.clipboard.writeText(decodedText);
      alert('Decoded text copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy text: ', err);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = decodedText;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert('Decoded text copied to clipboard!');
    }
  };

  const clearInputs = () => {
    setInputText("");
    setDecodedText("");
  };

  return (
    <div className="w-full p-6 bg-white rounded-xl shadow-lg border border-gray-200">
      <h3 className="text-2xl font-bold mb-4 text-gray-800">Decode Redacted Text</h3>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Paste redacted text containing PIIs (Person_1, Email_1, etc.)
        </label>
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Great, you met up with Person_1 at his flat..."
          className="w-full h-32 p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      
      <div className="flex gap-2 mb-4">
        <button
          onClick={handleDecode}
          disabled={!inputText.trim() || piiMapping.size === 0}
          className="flex-1 px-4 py-2 text-sm font-medium text-white bg-green-500 rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:bg-gray-400 transition-colors"
        >
          Decode PIIs ({piiMapping.size} mappings available)
        </button>
        <button
          onClick={clearInputs}
          className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
        >
          Clear
        </button>
      </div>
      
      {decodedText && (
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Decoded Text:
          </label>
          <div className="p-3 bg-gray-100 rounded-lg border border-gray-300 min-h-[100px] leading-relaxed mb-3">
            {decodedText}
          </div>
          <button
            onClick={copyDecodedText}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/>
              <path d="M4 16c-1.1 0-2-.9-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
            </svg>
            Copy Unredacted Text
          </button>
        </div>
      )}
      
      {piiMapping.size > 0 && (
        <div className="mt-6 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <h4 className="text-sm font-semibold text-blue-800 mb-2">Available Mappings:</h4>
          <div className="text-xs text-blue-700 space-y-1">
            {Array.from(piiMapping.entries()).map(([key, value]) => (
              <div key={key} className="flex justify-between">
                <span className="font-mono bg-blue-100 px-1 rounded">{key}</span>
                <span>→</span>
                <span className="truncate ml-2">{value}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};