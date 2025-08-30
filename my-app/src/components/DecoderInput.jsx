import React, { useState } from "react";

export default function DecoderInput({ piiMapping, decodePII, isDarkMode }) {
  const [inputText, setInputText] = useState("");
  const [decodedText, setDecodedText] = useState("");

  // Theme-aware classes
  const containerClasses = isDarkMode
    ? "bg-gray-800 border-gray-600 text-white"
    : "bg-white border-gray-200 text-gray-800";
    
  const textareaClasses = isDarkMode
    ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
    : "bg-white border-gray-300 text-gray-900 placeholder-gray-500";
    
  const buttonClasses = isDarkMode
    ? "bg-purple-600 hover:bg-purple-700"
    : "bg-purple-500 hover:bg-purple-600";
    
  const resultClasses = isDarkMode
    ? "bg-gray-700 border-gray-600 text-gray-200"
    : "bg-gray-50 border-gray-300 text-gray-800";

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
  
  return (
    <div className={`mt-6 p-6 rounded-xl shadow-lg border ${containerClasses}`}>
      <h3 className="text-xl font-bold mb-4">PII Decoder</h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Redacted Text</label>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Paste redacted text here..."
            className={`w-full h-32 p-3 border rounded-lg ${textareaClasses}`}
          />
        </div>
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium">Decoded Text</label>
            {decodedText && (
              <button
                onClick={copyDecodedText}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/>
                  <path d="M4 16c-1.1 0-2-.9-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
                </svg>
                Copy 
              </button>
            )}
          </div>
          <div className={`w-full h-32 p-3 border rounded-lg overflow-auto ${resultClasses}`}>
            {decodedText || "Decoded text will appear here..."}
          </div>
        </div>
      </div>
      <button
        onClick={handleDecode}
        disabled={!inputText || piiMapping.size === 0}
        className={`mt-4 px-6 py-2 text-white font-medium rounded-lg disabled:opacity-50 transition-colors ${buttonClasses}`}
      >
        Decode PIIs
      </button>
    </div>
  );
}