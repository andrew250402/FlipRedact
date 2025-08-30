export default function TextDisplay({
  displayText,
  originalText,
  entities,
  redactedKeys,
  handleHighlightClick,
  isDarkMode,
}) {
  // Theme-aware classes
  const containerClasses = isDarkMode
    ? "bg-gray-800 border-gray-600 text-white"
    : "bg-gray-100 border-gray-300 text-gray-900";

  const buttonClasses = isDarkMode
    ? "bg-blue-600 hover:bg-blue-700"
    : "bg-blue-500 hover:bg-blue-600";

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(displayText);
      alert("Text copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy text: ", err);
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = displayText;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      alert("Text copied to clipboard!");
    }
  };

  if (!entities.length) {
    return (
      <div>
        <div
          className={`text-display mt-8 p-4 rounded-lg border min-h-[100px] leading-relaxed whitespace-pre-wrap ${containerClasses}`}
        >
          {displayText}
        </div>
        <button
          onClick={copyToClipboard}
          className={`mt-3 flex items-center gap-2 px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors ${buttonClasses}`}
        >
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
            <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
            <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
          </svg>
          Copy Text
        </button>
      </div>
    );
  }

  // If displayText has been modified (redactions applied), just show it as plain text
  if (displayText !== originalText) {
    return (
      <div>
        <div
          className={`text-display mt-8 p-4 rounded-lg border min-h-[100px] leading-relaxed whitespace-pre-wrap ${containerClasses}`}
        >
          {displayText}
        </div>
        <button
          onClick={copyToClipboard}
          className={`mt-3 flex items-center gap-2 px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors ${buttonClasses}`}
        >
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
            <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
            <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
          </svg>
          Copy Text
        </button>
      </div>
    );
  }

  // Original highlighting logic for when no redactions have been applied yet
  const allPositions = [];
  entities.forEach((entity) => {
    entity.positions.forEach(([start, end]) => {
      allPositions.push({
        start,
        end,
        key: entity.key,
        original: entity.original,
      });
    });
  });

  const sortedPositions = allPositions.sort((a, b) => a.start - b.start);
  let textChunks = [];
  let currentIndex = 0;

  sortedPositions.forEach((pos) => {
    if (currentIndex < pos.start) {
      textChunks.push({
        text: originalText.substring(currentIndex, pos.start),
        isEntity: false,
        key: null,
      });
    }

    textChunks.push({
      text: pos.original,
      isEntity: true,
      key: pos.key,
    });

    currentIndex = pos.end;
  });

  if (currentIndex < originalText.length) {
    textChunks.push({
      text: originalText.substring(currentIndex),
      isEntity: false,
      key: null,
    });
  }

  return (
    <div>
      <div
        className={`text-display mt-8 p-4 rounded-lg border min-h-[100px] leading-relaxed whitespace-pre-wrap ${containerClasses}`}
      >
        {textChunks.map((chunk, i) =>
          chunk.isEntity ? (
            <mark
              key={`${chunk.key}-${i}`}
              onClick={() => handleHighlightClick(chunk.key)}
              className={
                redactedKeys.has(chunk.key)
                  ? "bg-green-300 rounded px-1 cursor-pointer" // Selected for redaction
                  : "bg-red-200 rounded px-1 cursor-pointer" // Detected but not selected
              }
            >
              {chunk.text}
            </mark>
          ) : (
            <span key={i} className="whitespace-pre-wrap">
              {chunk.text}
            </span>
          )
        )}
      </div>
      <button
        onClick={copyToClipboard}
        className={`mt-3 flex items-center gap-2 px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors ${buttonClasses}`}
      >
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
          <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
          <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
        </svg>
        Copy Text
      </button>
    </div>
  );
}
