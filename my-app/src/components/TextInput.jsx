export default function TextInput({ originalText, setOriginalText, onRunCheck, isDarkMode }) {
  // Theme-aware classes
  const containerClasses = isDarkMode
    ? "bg-gray-800 border-gray-600 text-white"
    : "bg-white border-gray-200 text-gray-800";
    
  const textareaClasses = isDarkMode
    ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-blue-400 focus:border-blue-400"
    : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-blue-500 focus:border-blue-500";
    
  const buttonClasses = isDarkMode
    ? "bg-blue-600 hover:bg-blue-700"
    : "bg-blue-600 hover:bg-blue-700";

  return (
    <div className={`main w-full p-6 rounded-xl shadow-lg border ${containerClasses}`}>
      <h1 className="text-3xl font-bold mb-4 text-center">
        PII Detection & Redaction
      </h1>
      <textarea
        className={`w-full min-h-[200px] p-3 border rounded-lg resize-y focus:outline-none focus:ring-2 transition-all ${textareaClasses}`}
        placeholder="Paste or type text..."
        value={originalText}
        onChange={(e) => setOriginalText(e.target.value)}
      />
      <button
        onClick={onRunCheck}
        className={`w-full px-4 py-2 text-lg font-semibold text-white rounded-lg transition-colors ${buttonClasses}`}
      >
        Run PII Detection
      </button>
    </div>
  );
}