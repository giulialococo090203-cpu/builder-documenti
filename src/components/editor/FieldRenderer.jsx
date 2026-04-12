export default function FieldRenderer({ field, value, onChange }) {
  if (field.type === "text") {
    return (
      <div style={{ marginBottom: "10px" }}>
        <label>{field.label}</label><br />
        <input
          value={value || ""}
          onChange={(e) => onChange(field.name, e.target.value)}
        />
      </div>
    );
  }

  if (field.type === "checkbox") {
    return (
      <div>
        <label>{field.label}</label><br />
        {field.options.map((opt) => (
          <div key={opt}>
            <input
              type="radio"
              name={field.name}
              checked={value === opt}
              onChange={() => onChange(field.name, opt)}
            />
            {opt}
          </div>
        ))}
      </div>
    );
  }

  return null;
}