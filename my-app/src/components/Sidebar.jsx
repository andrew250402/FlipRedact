import React from "react";
import EntityList from "./EntityList";

export default function Sidebar({
  entities,
  allEntities,
  filter,
  setFilter,
  toggleLabel,
  togglePII,
  redactedKeys,
  entityRefs,
  exportRedactedText,
  isDarkMode
}) {
  // Define theme-aware classes
  const containerClasses = isDarkMode
    ? "bg-gray-800 border-gray-600 text-white"
    : "bg-white border-gray-200 text-gray-800";
    
  const selectClasses = isDarkMode
    ? "bg-gray-700 text-white border-gray-500"
    : "bg-gray-200 text-gray-700 border-gray-300";
    
  const buttonClasses = isDarkMode
    ? "bg-green-600 hover:bg-green-700"
    : "bg-green-500 hover:bg-green-600";
    
  const exportButtonClasses = isDarkMode
    ? "bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600"
    : "bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400";

  return (
    <div className={`sidebar w-full p-6 rounded-xl shadow-lg border ${containerClasses}`}>
      <h3 className="text-2xl font-bold mb-4">Detected PIIs</h3>
      <div className="flex items-center gap-2 mb-4">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className={`flex-grow p-2 rounded-lg border ${selectClasses}`}
        >
          <option>ALL</option>
          {[...new Set(allEntities.map((e) => e.label))].map(label => (
            <option key={label}>{label}</option>
          ))}
        </select>
        <button
          onClick={() => toggleLabel(filter)}
          // disabled={filter === "ALL"}
          className={`px-4 py-2 text-sm font-medium text-white rounded-lg disabled:opacity-50 transition-colors ${buttonClasses}`}
        >
          Redact {filter}
        </button>
      </div>
      
      {/* Export button */}
      <div className="mb-4">
        <button
          onClick={exportRedactedText}
          // disabled={redactedKeys.size === 0}
          className={`w-full px-4 py-2 text-sm font-medium text-white rounded-lg disabled:opacity-50 transition-colors ${exportButtonClasses}`}
        >
          Apply Redactions ({redactedKeys.size} selected)
        </button>
      </div>

      <EntityList
        entities={entities}
        togglePII={togglePII}
        redactedKeys={redactedKeys}
        entityRefs={entityRefs}
        isDarkMode={isDarkMode}
      />
    </div>
  );
}