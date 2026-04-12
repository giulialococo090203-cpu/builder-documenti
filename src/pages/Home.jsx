import { useState } from "react";
import evacuationModule from "../modules/evacuationModule";
import { buildInitialData } from "../utils/buildInitialData";
import FieldRenderer from "../components/editor/FieldRenderer";
import DocumentPreview from "../components/preview/DocumentPreview";

export default function Home() {
  const [data, setData] = useState(buildInitialData(evacuationModule));

  function updateField(name, value) {
    setData((prev) => ({
      ...prev,
      [name]: value
    }));
  }

  return (
    <div style={{ display: "flex", gap: "20px" }}>
      
      {/* EDITOR */}
      <div style={{ width: "40%" }}>
        <h2>Editor</h2>

        {evacuationModule.blocks.map((block, i) => {
          if (block.fields) {
            return block.fields.map((f) => (
              <FieldRenderer
                key={f.name}
                field={f}
                value={data[f.name]}
                onChange={updateField}
              />
            ));
          }

          if (block.type === "text" || block.type === "checkbox") {
            return (
              <FieldRenderer
                key={block.name}
                field={block}
                value={data[block.name]}
                onChange={updateField}
              />
            );
          }

          return null;
        })}
      </div>

      {/* PREVIEW */}
      <div style={{ width: "60%" }}>
        <h2>Anteprima</h2>
        <DocumentPreview module={evacuationModule} data={data} />
      </div>

    </div>
  );
}