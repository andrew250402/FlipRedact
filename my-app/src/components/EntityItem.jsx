export default function EntityItem({ entity, isRedacted, onToggle, entityRef }) {
  return (
    <li
      ref={entityRef}
      className="p-4 bg-gray-100 rounded-lg border border-gray-300 shadow-sm"
    >
      <div className="flex justify-between items-start">
        <span className="text-lg font-bold text-blue-600">{entity.key}</span>
        <span className="bg-blue-200 text-blue-800 text-xs font-semibold px-2 py-1 rounded-full">
          {entity.label}
        </span>
      </div>
      <div className="text-sm mt-2 text-gray-600">
        <p><strong>Score:</strong> {(entity.score * 100).toFixed(2)}%</p>
        <p><strong>Original:</strong> {entity.original}</p>

      </div>
      <button
        onClick={onToggle}
        className={`mt-3 px-4 py-2 w-full text-sm font-semibold text-white rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
          isRedacted
            ? "bg-red-500 hover:bg-red-600 focus:ring-red-500"
            : "bg-green-500 hover:bg-green-600 focus:ring-green-500"
        }`}
      >
        {isRedacted ? "Unredact" : "Redact"}
      </button>
    </li>
  );
}