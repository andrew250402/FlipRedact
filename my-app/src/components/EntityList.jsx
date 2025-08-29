import EntityItem from "./EntityItem.jsx";

export default function EntityList({ entities, togglePII, redactedKeys, entityRefs }) {
  return (
    <ul className="space-y-4 max-h-[500px] overflow-y-auto">
      {entities.map((e) => (
        <EntityItem
          key={e.key}
          entity={e}
          isRedacted={redactedKeys.has(e.key)}
          onToggle={() => togglePII(e.key)}
          entityRef={(el) => (entityRefs.current[e.key] = el)}
        />
      ))}
    </ul>
  );
}