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
  exportRedactedText
}) {
  return (
    <div className="sidebar w-full p-6 bg-white rounded-xl shadow-lg border border-gray-200">
      <h3 className="text-2xl font-bold mb-4 text-gray-800">Detected PIIs</h3>
      <div className="flex items-center gap-2 mb-4">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="flex-grow p-2 text-gray-700 bg-gray-200 rounded-lg"
        >
          <option>ALL</option>
          {[...new Set(allEntities.map((e) => e.label))].map(label => (
            <option key={label}>{label}</option>
          ))}
        </select>
        <button
          onClick={() => toggleLabel(filter)}
          disabled={filter === "ALL"}
          className="px-4 py-2 text-sm font-medium text-white bg-green-500 rounded-lg disabled:opacity-50"
        >
          Toggle Redact All {filter}
        </button>
      </div>
      
      {/* Export button */}
      <div className="mb-4">
        <button
          onClick={exportRedactedText}
          disabled={redactedKeys.size === 0}
          className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg disabled:opacity-50 disabled:bg-gray-400"
        >
          Apply Redactions ({redactedKeys.size} selected)
        </button>
      </div>

      <EntityList
        entities={entities}
        togglePII={togglePII}
        redactedKeys={redactedKeys}
        entityRefs={entityRefs}
      />
    </div>
  );
}