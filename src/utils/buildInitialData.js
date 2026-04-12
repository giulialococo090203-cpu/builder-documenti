export function buildInitialData(module) {
  const data = {};

  module.blocks.forEach((block) => {
    if (block.fields) {
      block.fields.forEach((field) => {
        data[field.name] = "";
      });
    }

    if (block.type === "text") {
      data[block.name] = "";
    }

    if (block.type === "checkbox") {
      data[block.name] = "";
    }
  });

  return data;
}