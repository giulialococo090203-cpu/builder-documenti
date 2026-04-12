const evacuationModule = {
  id: "evacuation",
  title: "Modulo di evacuazione",

  blocks: [
    {
      type: "header",
      fields: [
        { type: "text", name: "istituto", label: "Istituto" },
        { type: "text", name: "indirizzo", label: "Indirizzo" },
        { type: "text", name: "contatti", label: "Contatti" }
      ]
    },

    {
      type: "title",
      value: "MODULO DI EVACUAZIONE"
    },

    {
      type: "checkbox",
      name: "ordineScuola",
      label: "Ordine scuola",
      options: ["Infanzia", "Primaria", "Secondaria"]
    },

    {
      type: "text",
      name: "scuolaPlesso",
      label: "Scuola / Plesso"
    },

    {
      type: "text",
      name: "insegnante",
      label: "Insegnante"
    },

    {
      type: "row",
      fields: [
        { type: "text", name: "classeSezione", label: "Classe" },
        { type: "text", name: "piano", label: "Piano" },
        { type: "text", name: "aula", label: "Aula" }
      ]
    }
  ]
};

export default evacuationModule;