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
          <label className="block text-sm font-medium mb-2">Decoded Text</label>
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