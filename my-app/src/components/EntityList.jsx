export default function EntityList({ entities, togglePII, redactedKeys, entityRefs, isDarkMode }) {
  // Theme-aware classes
  const itemClasses = isDarkMode
    ? "bg-gray-700 hover:bg-gray-600 border-gray-600"
    : "bg-gray-50 hover:bg-gray-100 border-gray-200";
    
  const textClasses = isDarkMode
    ? "text-gray-300"
    : "text-gray-600";

  return (
    <div className="entity-list max-h-[400px] overflow-y-auto space-y-2">
      {entities.map((entity) => (
        <div
          key={entity.key}
          ref={(el) => entityRefs.current[entity.key] = el}
          onClick={() => togglePII(entity.key)}
          className={`p-3 rounded-lg border cursor-pointer transition-all ${itemClasses} ${
            redactedKeys.has(entity.key) ? 'ring-2 ring-green-400' : ''
          }`}
        >
          <div className="flex justify-between items-start">
            <div className="flex-grow">
              <p className="font-semibold">{entity.key}</p>
              <p className={`text-sm ${textClasses}`}>Original: {entity.original}</p>
              <p className={`text-xs ${textClasses}`}>Score: {(entity.score * 100).toFixed(1)}%</p>
            </div>
            <input
              type="checkbox"
              
              checked={redactedKeys.has(entity.key)}
              onChange={() => togglePII(entity.key)}
              onClick={(e) => e.stopPropagation()}
              className="mt-1"
            />
          </div>
        </div>
      ))}
    </div>
  );
}