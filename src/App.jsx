import { useState } from "react";
import "./index.css";

const blocchiIniziali = [
  {
    id: 1,
    tipo: "titolo",
    testo: "MODULO DI EVACUAZIONE",
    pagina: 1,
  },
  {
    id: 2,
    tipo: "caselle",
    opzioni: ["INFANZIA", "PRIMARIA", "SECONDARIA DI 1° GRADO"],
    pagina: 1,
  },
  {
    id: 3,
    tipo: "riga",
    etichetta: "SCUOLA / PLESSO",
    pagina: 1,
  },
  {
    id: 4,
    tipo: "riga",
    etichetta: "INSEGNANTE",
    pagina: 1,
  },
  {
    id: 5,
    tipo: "tabella",
    pagina: 1,
    righe: [
      ["CLASSE E SEZIONE", "PIANO", "N. AULA"],
      ["", "", ""],
    ],
  },
  {
    id: 6,
    tipo: "data",
    etichetta: "Data",
    pagina: 1,
  },
  {
    id: 7,
    tipo: "firma",
    etichetta: "Firma",
    pagina: 1,
  },
];

function App() {
  const [blocchi, setBlocchi] = useState(blocchiIniziali);
  const [titoloDocumento, setTitoloDocumento] = useState(
    "ISTITUTO COMPRENSIVO MICHELANGELO BUONARROTI"
  );
  const [numeroPagine, setNumeroPagine] = useState(1);

  function aggiungiBlocco(tipo) {
    const nuovo = {
      id: Date.now(),
      tipo,
      pagina: numeroPagine,
    };

    if (tipo === "titolo") nuovo.testo = "NUOVO TITOLO";
    if (tipo === "testo") nuovo.testo = "Scrivi qui il testo fisso del modulo";
    if (tipo === "riga") nuovo.etichetta = "NUOVO CAMPO";
    if (tipo === "caselle") nuovo.opzioni = ["OPZIONE 1", "OPZIONE 2"];
    if (tipo === "tabella") {
      nuovo.righe = [
        ["COLONNA 1", "COLONNA 2"],
        ["", ""],
      ];
    }
    if (tipo === "note") nuovo.etichetta = "COMUNICAZIONI";
    if (tipo === "data") nuovo.etichetta = "Data";
    if (tipo === "firma") nuovo.etichetta = "Firma";

    setBlocchi((prev) => [...prev, nuovo]);
  }

  function aggiornaBlocco(id, chiave, valore) {
    setBlocchi((prev) =>
      prev.map((blocco) =>
        blocco.id === id ? { ...blocco, [chiave]: valore } : blocco
      )
    );
  }

  function eliminaBlocco(id) {
    setBlocchi((prev) => prev.filter((blocco) => blocco.id !== id));
  }

  function spostaSu(index) {
    if (index === 0) return;
    const copia = [...blocchi];
    [copia[index - 1], copia[index]] = [copia[index], copia[index - 1]];
    setBlocchi(copia);
  }

  function spostaGiu(index) {
    if (index === blocchi.length - 1) return;
    const copia = [...blocchi];
    [copia[index], copia[index + 1]] = [copia[index + 1], copia[index]];
    setBlocchi(copia);
  }

  function aggiornaCellaTabella(bloccoId, rigaIndex, cellaIndex, valore) {
    setBlocchi((prev) =>
      prev.map((blocco) => {
        if (blocco.id !== bloccoId) return blocco;

        const nuoveRighe = blocco.righe.map((riga, i) =>
          i === rigaIndex
            ? riga.map((cella, j) => (j === cellaIndex ? valore : cella))
            : riga
        );

        return { ...blocco, righe: nuoveRighe };
      })
    );
  }

  function aggiungiRigaTabella(bloccoId) {
    setBlocchi((prev) =>
      prev.map((blocco) => {
        if (blocco.id !== bloccoId) return blocco;

        const numeroColonne = blocco.righe[0]?.length || 2;
        const nuovaRiga = Array(numeroColonne).fill("");

        return {
          ...blocco,
          righe: [...blocco.righe, nuovaRiga],
        };
      })
    );
  }

  function aggiungiColonnaTabella(bloccoId) {
    setBlocchi((prev) =>
      prev.map((blocco) => {
        if (blocco.id !== bloccoId) return blocco;

        const nuoveRighe = blocco.righe.map((riga) => [...riga, ""]);

        return {
          ...blocco,
          righe: nuoveRighe,
        };
      })
    );
  }

  function eliminaRigaTabella(bloccoId, rigaIndex) {
    setBlocchi((prev) =>
      prev.map((blocco) => {
        if (blocco.id !== bloccoId) return blocco;
        if (blocco.righe.length <= 1) return blocco;

        return {
          ...blocco,
          righe: blocco.righe.filter((_, i) => i !== rigaIndex),
        };
      })
    );
  }

  function applicaNumerazionePrimaColonna(bloccoId, formato) {
    setBlocchi((prev) =>
      prev.map((blocco) => {
        if (blocco.id !== bloccoId) return blocco;

        const nuoveRighe = blocco.righe.map((riga, index) => {
          if (index === 0) return riga;

          const nuovaRiga = [...riga];

          if (formato === "numero") {
            nuovaRiga[0] = "{n}";
          }

          if (formato === "numero_punto") {
            nuovaRiga[0] = "{n.}";
          }

          if (formato === "numero_grado") {
            nuovaRiga[0] = "{n°}";
          }

          return nuovaRiga;
        });

        return { ...blocco, righe: nuoveRighe };
      })
    );
  }

  function impostaIntestazionePrimaColonna(bloccoId, testo) {
    setBlocchi((prev) =>
      prev.map((blocco) => {
        if (blocco.id !== bloccoId) return blocco;
        if (!blocco.righe.length) return blocco;

        const nuoveRighe = [...blocco.righe];
        const primaRiga = [...nuoveRighe[0]];
        primaRiga[0] = testo;
        nuoveRighe[0] = primaRiga;

        return { ...blocco, righe: nuoveRighe };
      })
    );
  }

  function aggiungiPagina() {
    setNumeroPagine((prev) => prev + 1);
  }

  function spostaBloccoPagina(bloccoId, nuovaPagina) {
    setBlocchi((prev) =>
      prev.map((blocco) =>
        blocco.id === bloccoId
          ? {
              ...blocco,
              pagina: Number(nuovaPagina),
            }
          : blocco
      )
    );
  }

  function stampa() {
    window.print();
  }

  function renderCellaTabella(cella, rigaIndex) {
    if (typeof cella !== "string") return cella;

    return cella
      .replaceAll("{n}", String(rigaIndex))
      .replaceAll("{n.}", `${rigaIndex}.`)
      .replaceAll("{n°}", `${rigaIndex}°`);
  }

  const pagine = Array.from({ length: numeroPagine }, (_, i) => i + 1);

  return (
    <div className="app">
      <aside className="barra-laterale no-print">
        <h1>Creatore moduli</h1>
        <p className="sottotitolo">
          Crea un modulo vuoto da stampare e compilare a mano.
        </p>

        <div className="sezione">
          <label className="label-sezione">Nome scuola / intestazione</label>
          <input
            value={titoloDocumento}
            onChange={(e) => setTitoloDocumento(e.target.value)}
            placeholder="Nome scuola"
          />
        </div>

        <div className="sezione">
          <div className="label-sezione">Aggiungi elemento</div>
          <div className="griglia-bottoni">
            <button type="button" onClick={() => aggiungiBlocco("titolo")}>
              + Titolo
            </button>
            <button type="button" onClick={() => aggiungiBlocco("testo")}>
              + Testo
            </button>
            <button type="button" onClick={() => aggiungiBlocco("riga")}>
              + Riga da compilare
            </button>
            <button type="button" onClick={() => aggiungiBlocco("caselle")}>
              + Caselle
            </button>
            <button type="button" onClick={() => aggiungiBlocco("tabella")}>
              + Tabella
            </button>
            <button type="button" onClick={() => aggiungiBlocco("note")}>
              + Area note
            </button>
            <button type="button" onClick={() => aggiungiBlocco("data")}>
              + Data
            </button>
            <button type="button" onClick={() => aggiungiBlocco("firma")}>
              + Firma
            </button>
          </div>
        </div>

        <div className="sezione">
          <div className="label-sezione">Pagine</div>
          <button type="button" onClick={aggiungiPagina}>
            + Aggiungi pagina
          </button>
          <div style={{ marginTop: "10px", fontSize: "14px", color: "#555" }}>
            Totale pagine: {numeroPagine}
          </div>
        </div>

        <div className="sezione">
          <div className="label-sezione">Elementi del modulo</div>

          {blocchi.map((blocco, index) => (
            <div key={blocco.id} className="card-editor">
              <div className="card-top">
                <strong>{nomeTipo(blocco.tipo)}</strong>
                <div className="azioni-piccole">
                  <button type="button" onClick={() => spostaSu(index)}>
                    ↑
                  </button>
                  <button type="button" onClick={() => spostaGiu(index)}>
                    ↓
                  </button>
                  <button type="button" onClick={() => eliminaBlocco(blocco.id)}>
                    ✕
                  </button>
                </div>
              </div>

              <label>Pagina</label>
              <select
                value={blocco.pagina}
                onChange={(e) => spostaBloccoPagina(blocco.id, e.target.value)}
                style={{
                  width: "100%",
                  border: "1px solid #cfcfcf",
                  borderRadius: "10px",
                  padding: "10px 12px",
                  background: "white",
                  marginBottom: "12px",
                }}
              >
                {pagine.map((pagina) => (
                  <option key={pagina} value={pagina}>
                    Pagina {pagina}
                  </option>
                ))}
              </select>

              {blocco.tipo === "titolo" && (
                <>
                  <label>Testo titolo</label>
                  <input
                    value={blocco.testo}
                    onChange={(e) =>
                      aggiornaBlocco(blocco.id, "testo", e.target.value)
                    }
                  />
                </>
              )}

              {blocco.tipo === "testo" && (
                <>
                  <label>Testo fisso</label>
                  <textarea
                    value={blocco.testo}
                    onChange={(e) =>
                      aggiornaBlocco(blocco.id, "testo", e.target.value)
                    }
                  />
                </>
              )}

              {blocco.tipo === "riga" && (
                <>
                  <label>Nome campo</label>
                  <input
                    value={blocco.etichetta}
                    onChange={(e) =>
                      aggiornaBlocco(blocco.id, "etichetta", e.target.value)
                    }
                  />
                </>
              )}

              {blocco.tipo === "caselle" && (
                <>
                  <label>Una opzione per riga</label>
                  <textarea
                    value={blocco.opzioni.join("\n")}
                    onChange={(e) =>
                      aggiornaBlocco(
                        blocco.id,
                        "opzioni",
                        e.target.value.split("\n").filter(Boolean)
                      )
                    }
                  />
                </>
              )}

              {blocco.tipo === "tabella" && (
                <>
                  <label>Tabella</label>

                  <div
                    style={{
                      marginBottom: "12px",
                      padding: "10px",
                      border: "1px solid #ddd",
                      borderRadius: "10px",
                      background: "#f8f8f8",
                    }}
                  >
                    <div
                      style={{
                        fontWeight: "600",
                        marginBottom: "8px",
                        fontSize: "14px",
                      }}
                    >
                      Aiuto numerazione semplice
                    </div>

                    <div
                      style={{
                        display: "flex",
                        gap: "8px",
                        flexWrap: "wrap",
                        marginBottom: "8px",
                      }}
                    >
                      <button
                        type="button"
                        onClick={() =>
                          impostaIntestazionePrimaColonna(blocco.id, "n°")
                        }
                      >
                        Intestazione prima colonna = n°
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          applicaNumerazionePrimaColonna(blocco.id, "numero")
                        }
                      >
                        Prima colonna = 1, 2, 3
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          applicaNumerazionePrimaColonna(
                            blocco.id,
                            "numero_punto"
                          )
                        }
                      >
                        Prima colonna = 1., 2., 3.
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          applicaNumerazionePrimaColonna(
                            blocco.id,
                            "numero_grado"
                          )
                        }
                      >
                        Prima colonna = 1°, 2°, 3°
                      </button>
                    </div>

                    <div style={{ fontSize: "13px", color: "#666" }}>
                      Usa questi pulsanti senza dover scrivere codici manuali.
                    </div>
                  </div>

                  {blocco.righe.map((riga, rigaIndex) => (
                    <div
                      key={`${blocco.id}-riga-${rigaIndex}`}
                      style={{
                        display: "flex",
                        gap: "6px",
                        marginBottom: "8px",
                        alignItems: "center",
                      }}
                    >
                      {riga.map((cella, cellaIndex) => (
                        <input
                          key={`${blocco.id}-cella-${rigaIndex}-${cellaIndex}`}
                          value={cella}
                          onChange={(e) =>
                            aggiornaCellaTabella(
                              blocco.id,
                              rigaIndex,
                              cellaIndex,
                              e.target.value
                            )
                          }
                        />
                      ))}

                      <button
                        type="button"
                        onClick={() =>
                          eliminaRigaTabella(blocco.id, rigaIndex)
                        }
                      >
                        ❌
                      </button>
                    </div>
                  ))}

                  <div
                    style={{
                      display: "flex",
                      gap: "8px",
                      flexWrap: "wrap",
                      marginTop: "8px",
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => aggiungiRigaTabella(blocco.id)}
                    >
                      ➕ Aggiungi riga
                    </button>

                    <button
                      type="button"
                      onClick={() => aggiungiColonnaTabella(blocco.id)}
                    >
                      ➕ Aggiungi colonna
                    </button>
                  </div>
                </>
              )}

              {blocco.tipo === "note" && (
                <>
                  <label>Titolo area</label>
                  <input
                    value={blocco.etichetta}
                    onChange={(e) =>
                      aggiornaBlocco(blocco.id, "etichetta", e.target.value)
                    }
                  />
                </>
              )}

              {blocco.tipo === "data" && (
                <>
                  <label>Scritta campo data</label>
                  <input
                    value={blocco.etichetta}
                    onChange={(e) =>
                      aggiornaBlocco(blocco.id, "etichetta", e.target.value)
                    }
                  />
                </>
              )}

              {blocco.tipo === "firma" && (
                <>
                  <label>Scritta campo firma</label>
                  <input
                    value={blocco.etichetta}
                    onChange={(e) =>
                      aggiornaBlocco(blocco.id, "etichetta", e.target.value)
                    }
                  />
                </>
              )}
            </div>
          ))}
        </div>

        <button type="button" className="bottone-stampa" onClick={stampa}>
          Stampa modulo
        </button>
      </aside>

      <main className="area-anteprima">
        {pagine.map((pagina) => (
          <div key={pagina} className="foglio">
            <div className="intestazione">
              <div className="nome-scuola">{titoloDocumento}</div>
              <div className="riga-piccola">Via Tembien 1 - 90135 Palermo</div>
              <div className="riga-piccola">Codice fiscale 80026500829</div>
              <div className="riga-piccola">
                Tel. 091221001 - PAIC87100X@ISTRUZIONE.IT
              </div>
            </div>

            {blocchi
              .filter((blocco) => blocco.pagina === pagina)
              .map((blocco) => {
                if (blocco.tipo === "titolo") {
                  return (
                    <div key={blocco.id} className="blocco-titolo">
                      {blocco.testo}
                    </div>
                  );
                }

                if (blocco.tipo === "testo") {
                  return (
                    <div key={blocco.id} className="blocco-testo">
                      {blocco.testo}
                    </div>
                  );
                }

                if (blocco.tipo === "riga") {
                  return (
                    <div key={blocco.id} className="campo-riga">
                      <span className="campo-etichetta">{blocco.etichetta}</span>
                      <span className="campo-linea" />
                    </div>
                  );
                }

                if (blocco.tipo === "caselle") {
                  return (
                    <div key={blocco.id} className="gruppo-caselle">
                      {blocco.opzioni.map((opzione, i) => (
                        <div key={`${blocco.id}-opzione-${i}`} className="item-casella">
                          <span className="casella" />
                          <span>{opzione}</span>
                        </div>
                      ))}
                    </div>
                  );
                }

                if (blocco.tipo === "tabella") {
                  return (
                    <table key={blocco.id} className="tabella-documento">
                      <tbody>
                        {blocco.righe.map((riga, rigaIndex) => (
                          <tr key={`${blocco.id}-tr-${rigaIndex}`}>
                            {riga.map((cella, cellaIndex) => (
                              <td key={`${blocco.id}-td-${rigaIndex}-${cellaIndex}`}>
                                {rigaIndex === 0
                                  ? cella
                                  : renderCellaTabella(cella, rigaIndex)}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  );
                }

                if (blocco.tipo === "note") {
                  return (
                    <div key={blocco.id} className="area-note">
                      <div className="titolo-note">{blocco.etichetta}</div>
                      <div className="linea-nota" />
                      <div className="linea-nota" />
                      <div className="linea-nota" />
                    </div>
                  );
                }

                if (blocco.tipo === "data") {
                  return (
                    <div key={blocco.id} className="campo-data">
                      <span className="campo-etichetta-data">
                        {blocco.etichetta}
                      </span>
                      <span className="campo-linea-data" />
                    </div>
                  );
                }

                if (blocco.tipo === "firma") {
                  return (
                    <div key={blocco.id} className="campo-firma-wrap">
                      <div className="campo-firma">
                        <span className="campo-etichetta-firma">
                          {blocco.etichetta}
                        </span>
                        <span className="campo-linea-firma" />
                      </div>
                    </div>
                  );
                }

                return null;
              })}

            <div className="numero-pagina">Pagina {pagina}</div>
          </div>
        ))}
      </main>
    </div>
  );
}

function nomeTipo(tipo) {
  if (tipo === "titolo") return "Titolo";
  if (tipo === "testo") return "Testo";
  if (tipo === "riga") return "Riga da compilare";
  if (tipo === "caselle") return "Caselle";
  if (tipo === "tabella") return "Tabella";
  if (tipo === "note") return "Area note";
  if (tipo === "data") return "Data";
  if (tipo === "firma") return "Firma";
  return tipo;
}

export default App;