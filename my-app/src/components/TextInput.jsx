export default function TextInput({ originalText, setOriginalText, onRunCheck, onRunOCRCheck, isDarkMode }) {
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

  const fileInputClasses = isDarkMode
    ? "bg-gray-700 border-gray-600 text-white file:bg-gray-600 file:text-white file:border-gray-500"
    : "bg-white border-gray-300 text-gray-900 file:bg-gray-100 file:text-gray-900 file:border-gray-300";

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      onRunOCRCheck(e.target.files[0]);
    }
  };

  return (
    <div className={`p-6 rounded-lg shadow-sm border text-center ${containerClasses}`}>
      <h2 className="text-xl font-bold mb-4">PII Detection & Redaction</h2>
      
      <textarea
        value={originalText}
        onChange={(e) => setOriginalText(e.target.value)}
        placeholder="Enter text to analyze for PII..."
        rows={8}
        className={`w-full p-3 rounded-lg border resize-none focus:outline-none focus:ring-2 transition-colors ${textareaClasses}`}
      />
      
      <div className="mt-4 space-y-3">
        <button
          onClick={onRunCheck}
          disabled={!originalText.trim()}
          className={`w-full px-4 py-2 text-lg font-semibold text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${buttonClasses}`}
        >
          Run PII Detection
        </button>
        
        <div className="border-t pt-3">
          <label className="block text-sm font-medium mb-2">
            Or upload an image for PII Detection:
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className={`w-full px-3 py-2 rounded-lg border transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold hover:file:bg-opacity-80 ${fileInputClasses}`}
          />
        </div>
      </div>
    </div>
  );
}