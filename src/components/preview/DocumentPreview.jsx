export default function DocumentPreview({ module, data }) {
  return (
    <div style={{ padding: "20px", border: "1px solid black" }}>
      {module.blocks.map((block, i) => {
        if (block.type === "title") {
          return <h2 key={i}>{block.value}</h2>;
        }

        if (block.type === "text") {
          return (
            <p key={i}>
              <strong>{block.label}:</strong> {data[block.name]}
            </p>
          );
        }

        if (block.type === "header") {
          return (
            <div key={i}>
              {block.fields.map((f) => (
                <div key={f.name}>{data[f.name]}</div>
              ))}
            </div>
          );
        }

        return null;
      })}
    </div>
  );
}