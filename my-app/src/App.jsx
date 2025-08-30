import React, { useState, useRef } from "react";
import TextInput from "./components/TextInput";
import TextDisplay from "./components/TextDisplay";
import Sidebar from "./components/Sidebar";
import DecoderInput from "./components/DecoderInput.jsx";

export default function App() {
  const [originalText, setOriginalText] = useState("");
  const [displayText, setDisplayText] = useState("");
  const [entities, setEntities] = useState([]);
  const [filter, setFilter] = useState("ALL");
  const [redactedKeys, setRedactedKeys] = useState(new Set());
  const [piiMapping, setPiiMapping] = useState(new Map());
  const [isDarkMode, setIsDarkMode] = useState(false);
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

      // Create label-specific counters
      const labelCounters = {};

      // Map backend format to frontend format
      const entities = data.pii.map((item, idx) => {
        const labelCap = item.label.charAt(0) + item.label.slice(1).toLowerCase();

        // Initialize or increment counter for this label
        if (!labelCounters[labelCap]) {
          labelCounters[labelCap] = 0;
        }
        labelCounters[labelCap]++; // Increment counter for this label if initialized

        return {
          key: `${labelCap}_${labelCounters[labelCap]}`, // e.g. Email_1, Email_2, Person_1
          label: item.label,          
          score: item.score,
          original: item.word,
          positions: item.position, // Store all positions
        };
      });

      setEntities(entities);
      setDisplayText(originalText);
      setRedactedKeys(new Set());

      // Build mapping of redacted keys to original values
      const mapping = new Map();
      entities.forEach(entity => {
        mapping.set(entity.key, entity.original);
      });
      setPiiMapping(mapping);
    } catch (err) {
      console.error("Failed to fetch PII data:", err);
    }
  };
const runOCRCheck = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const res = await fetch("http://127.0.0.1:3000/ocr", {
      method: "POST",
      body: formData,
    });
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

    const data = await res.json();

    // Backend returns { extracted_text: "..." }
    if (data.extracted_text) {
      setOriginalText(data.extracted_text); // update textarea
      await runCheck(); // uses updated originalText
    }
  } catch (err) {
    console.error("Failed to fetch OCR text:", err);
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

  const decodePII = (textToDecode) => {
    let decodedText = textToDecode;
    
    // Replace each redacted key with its original value
    piiMapping.forEach((originalValue, redactedKey) => {
      const regex = new RegExp(redactedKey.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'); // Escape special regex characters
      decodedText = decodedText.replace(regex, originalValue);
    });
    
    return decodedText;
  };

  const filteredEntities = filter === "ALL" ? entities : entities.filter(e => e.label === filter);

  // Dark Mode Toggle
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const themeClasses = isDarkMode
    ? "bg-gray-900 text-white"
    : "bg-gray-50 text-gray-900";

  const containerClasses = isDarkMode
    ? "bg-gray-800 border-gray-700"
    : "bg-white border-gray-200";

  const borderClasses = isDarkMode
    ? "border-gray-600"
    : "border-gray-300";

return (
  <div className={`min-h-screen ${themeClasses}`}>
    <div
      className={`max-w-7xl mx-auto p-10 ${containerClasses} min-h-screen rounded-xl shadow-lg flex flex-col gap-6 border`}
    >
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        {/* Logo + Title */}
        <div className="flex items-center gap-3">
          {/* Icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-8 h-8 text-blue-600 dark:text-blue-400"
          >
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            <circle cx="12" cy="12" r="3" />
          </svg>

          {/* Title */}
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            FlipRedact
          </h1>
        </div>

        {/* Theme Toggle Button */}


        <button
          onClick={toggleTheme}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            isDarkMode
              ? "bg-gray-700 hover:bg-gray-600 text-yellow-400 border border-gray-600"
              : "bg-gray-100 hover:bg-gray-200 text-gray-600 border border-gray-300"
          }`}
        >
          {isDarkMode ? (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="5" />
                <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
              </svg>
              Light Mode
            </>
          ) : (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
              Dark Mode
            </>
          )}
        </button>
      </div>

      <div className="flex flex-row">
        <div className="flex flex-col flex-grow pr-4 border-r border-gray-300">
          <TextInput
            originalText={originalText}
            setOriginalText={setOriginalText}
            onRunCheck={runCheck}
            onRunOCRCheck={runOCRCheck}
            isDarkMode={isDarkMode}
          />
          <div className="mt-4 flex-grow overflow-auto">
            <TextDisplay
              displayText={displayText}
              originalText={originalText}
              entities={entities}
              redactedKeys={redactedKeys}
              handleHighlightClick={handleHighlightClick}
              isDarkMode={isDarkMode}
            />
          </div>
        </div>

        <div className="w-[320px] flex-shrink-0 pl-6">
          <Sidebar
            entities={filteredEntities}
            allEntities={entities}
            filter={filter}
            setFilter={setFilter}
            toggleLabel={toggleLabel}
            togglePII={togglePII}
            redactedKeys={redactedKeys}
            entityRefs={entityRefs}
            exportRedactedText={applyRedactions}
            isDarkMode={isDarkMode}
          />
        </div>
      </div>

      <DecoderInput
        piiMapping={piiMapping}
        decodePII={decodePII}
        isDarkMode={isDarkMode}
      />
    </div>
  </div>
);
}