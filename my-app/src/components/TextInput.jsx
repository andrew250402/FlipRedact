export default function TextInput({ originalText, setOriginalText, onRunCheck }) {
  return (
    <div className="main w-full p-6 bg-white rounded-xl shadow-lg border border-gray-200">
      <h1 className="text-3xl font-bold mb-4 text-center text-gray-800">
        PII Detection & Redaction
      </h1>
      <textarea
        // className="w-full h-48 p-4 mb-4 text-gray-700 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
        className="w-full min-h-[200px] p-3 border border-gray-300 rounded-lg resize-y"

        placeholder="Paste or type text..."
        value={originalText}
        onChange={(e) => setOriginalText(e.target.value)}
      />
      <button
        onClick={onRunCheck}
        className="w-full px-4 py-2 text-lg font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
      >
        Run PII Detection
      </button>
    </div>
  );
}