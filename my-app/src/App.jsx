import React, { useState, useRef } from "react";
import TextInput from "./components/TextInput";
import TextDisplay from "./components/TextDisplay";
import Sidebar from "./components/Sidebar";

export default function App() {
  const [originalText, setOriginalText] = useState("");
  const [displayText, setDisplayText] = useState("");
  const [entities, setEntities] = useState([]);
  const [filter, setFilter] = useState("ALL");
  const [redactedKeys, setRedactedKeys] = useState(new Set());
  const entityRefs = useRef({});

  const runCheck = async () => {
    try {
      const res = await fetch("http://127.0.0.1:3000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: originalText }),
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

      const data = await res.json();

      // Map backend format to frontend format
      const entities = data.pii.map((item, idx) => {
        const labelCap = item.label.charAt(0) + item.label.slice(1).toLowerCase();
        return {
          key: `${labelCap}_${idx + 1}`, // e.g. Email_1, National_id_2
          label: item.label,
          score: item.score,
          original: item.word,
          positions: item.position, // Store all positions
        };
      });

      setEntities(entities);
      setDisplayText(originalText);
      setRedactedKeys(new Set());
    } catch (err) {
      console.error("Failed to fetch PII data:", err);
    }
  };

  const applyRedactions = () => {
    // Create the redacted text
    const allPositions = [];
    
    entities.forEach(entity => {
      if (redactedKeys.has(entity.key)) {
        entity.positions.forEach(([start, end]) => {
          allPositions.push({
            start,
            end,
            key: entity.key
          });
        });
      }
    });
    
    // Sort by start position in DESCENDING order (work backwards)
    const sorted = allPositions.sort((a, b) => b.start - a.start);
    
    let redactedText = originalText;
    sorted.forEach(pos => {
      redactedText = redactedText.substring(0, pos.start) + pos.key + redactedText.substring(pos.end);
    });
    
    // Update the display text to show redacted version
    setDisplayText(redactedText);
  };

  const togglePII = (key) => {
    const updated = new Set(redactedKeys);
    updated.has(key) ? updated.delete(key) : updated.add(key);
    setRedactedKeys(updated);
    // Remove applyRedactions call since we only want visual selection
  };

  const toggleLabel = (label) => {
    const updated = new Set(redactedKeys);
    entities.forEach(e => {
      if (e.label === label) {
        updated.has(e.key) ? updated.delete(e.key) : updated.add(e.key);
      }
    });
    setRedactedKeys(updated);
    // Remove applyRedactions call since we only want visual selection
  };

  const handleHighlightClick = (key) => {
    entityRefs.current[key]?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const filteredEntities = filter === "ALL" ? entities : entities.filter(e => e.label === filter);

  return (
    <div className="max-w-7xl mx-auto p-10 bg-surface min-h-screen rounded-xl shadow-lg flex flex-row">
      
      {/* LEFT PANEL */}
      <div className="flex flex-col flex-grow pr-4 border-r border-gray-300">
        <TextInput
          originalText={originalText}
          setOriginalText={setOriginalText}
          onRunCheck={runCheck}
        />
        <div className="mt-4 flex-grow overflow-auto">
          <TextDisplay
            displayText={displayText}
            originalText={originalText}
            entities={entities}
            redactedKeys={redactedKeys}
            handleHighlightClick={handleHighlightClick} 
          />
        </div>
      </div>

      {/* SIDEBAR */}
      <div className="w-[320px] flex-shrink-0 pl-6">
        <Sidebar
          entities={filteredEntities}
          allEntities={entities} // Fixed: use entities instead of allEntities
          filter={filter}
          setFilter={setFilter}
          toggleLabel={toggleLabel}
          togglePII={togglePII}
          redactedKeys={redactedKeys}
          entityRefs={entityRefs}
          exportRedactedText={applyRedactions} // Changed back to applyRedactions
        />
      </div>

    </div> 
  );
}