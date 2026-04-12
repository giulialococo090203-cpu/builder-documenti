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
    quantitaElenco: 3,
    righe: [
      ["CLASSE E SEZIONE", "PIANO", "N. AULA"],
      ["", "", ""],
      ["", "", ""],
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
  const [numeroPagine, setNumeroPagine] = useState(1);
  const [cellaSelezionata, setCellaSelezionata] = useState(null);

  const [intestazione, setIntestazione] = useState({
    nomeScuola: "ISTITUTO COMPRENSIVO MICHELANGELO BUONARROTI",
    indirizzo: "Via Tembien 1",
    cittaCap: "90135 Palermo",
    codiceFiscale: "Codice fiscale 80026500829",
    telefono: "Tel. 091221001",
    email: "PAIC87100X@ISTRUZIONE.IT",
  });

  function aggiornaIntestazione(campo, valore) {
    setIntestazione((prev) => ({
      ...prev,
      [campo]: valore,
    }));
  }

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
      nuovo.quantitaElenco = 3;
      nuovo.righe = [
        ["COLONNA 1", "COLONNA 2"],
        ["", ""],
        ["", ""],
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

  function selezionaCella(bloccoId, rigaIndex, cellaIndex) {
    setCellaSelezionata({ bloccoId, rigaIndex, cellaIndex });
  }

  function applicaFormatoCella(bloccoId, formato) {
    if (!cellaSelezionata) return;
    if (cellaSelezionata.bloccoId !== bloccoId) return;

    const blocco = blocchi.find((b) => b.id === bloccoId);
    const quantita = Math.max(1, Number(blocco?.quantitaElenco || 3));
    const { rigaIndex, cellaIndex } = cellaSelezionata;

    let righe = [];

    for (let i = 1; i <= quantita; i += 1) {
      if (formato === "numero") righe.push(`${i} __________`);
      if (formato === "numero_punto") righe.push(`${i}. __________`);
      if (formato === "numero_grado") righe.push(`${i}° __________`);
      if (formato === "n_grado") righe.push(`n° __________`);
    }

    const testo = righe.join("\n");

    setBlocchi((prev) =>
      prev.map((bloccoItem) => {
        if (bloccoItem.id !== bloccoId) return bloccoItem;

        const nuoveRighe = bloccoItem.righe.map((riga, i) => {
          if (i !== rigaIndex) return riga;

          const nuovaRiga = [...riga];
          nuovaRiga[cellaIndex] = testo;
          return nuovaRiga;
        });

        return { ...bloccoItem, righe: nuoveRighe };
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

  function cellaAttiva(bloccoId, rigaIndex, cellaIndex) {
    return (
      cellaSelezionata &&
      cellaSelezionata.bloccoId === bloccoId &&
      cellaSelezionata.rigaIndex === rigaIndex &&
      cellaSelezionata.cellaIndex === cellaIndex
    );
  }

  function renderContenutoCella(cella) {
    if (typeof cella !== "string" || !cella.includes("\n")) {
      const lineaMatch = typeof cella === "string" ? cella.match(/^(.*?)(?:\s*_+)\s*$/) : null;

      if (lineaMatch) {
        const etichetta = lineaMatch[1].trim();
        return (
          <div style={{ display: "flex", alignItems: "center", gap: "6px", width: "100%" }}>
            <span style={{ whiteSpace: "nowrap" }}>{etichetta}</span>
            <span style={{ flex: 1, borderBottom: "1px solid #111", height: "12px" }} />
          </div>
        );
      }

      return cella;
    }

    const righe = cella.split("\n");

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
        {righe.map((riga, index) => {
          const match = riga.match(/^(.*?)(?:\s*_+)\s*$/);

          if (match) {
            const etichetta = match[1].trim();
            return (
              <div
                key={index}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  width: "100%",
                }}
              >
                <span style={{ whiteSpace: "nowrap" }}>{etichetta}</span>
                <span
                  style={{
                    flex: 1,
                    borderBottom: "1px solid #111",
                    height: "12px",
                  }}
                />
              </div>
            );
          }

          return (
            <div key={index} style={{ whiteSpace: "pre-line" }}>
              {riga}
            </div>
          );
        })}
      </div>
    );
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
          <div className="label-sezione">Intestazione documento</div>

          <label>Nome scuola</label>
          <input
            value={intestazione.nomeScuola}
            onChange={(e) => aggiornaIntestazione("nomeScuola", e.target.value)}
            placeholder="Nome scuola"
          />

          <label style={{ marginTop: "10px", display: "block" }}>Indirizzo</label>
          <input
            value={intestazione.indirizzo}
            onChange={(e) => aggiornaIntestazione("indirizzo", e.target.value)}
            placeholder="Via / Piazza"
          />

          <label style={{ marginTop: "10px", display: "block" }}>
            CAP e città
          </label>
          <input
            value={intestazione.cittaCap}
            onChange={(e) => aggiornaIntestazione("cittaCap", e.target.value)}
            placeholder="CAP e città"
          />

          <label style={{ marginTop: "10px", display: "block" }}>
            Codice fiscale
          </label>
          <input
            value={intestazione.codiceFiscale}
            onChange={(e) =>
              aggiornaIntestazione("codiceFiscale", e.target.value)
            }
            placeholder="Codice fiscale..."
          />

          <label style={{ marginTop: "10px", display: "block" }}>Telefono</label>
          <input
            value={intestazione.telefono}
            onChange={(e) => aggiornaIntestazione("telefono", e.target.value)}
            placeholder="Tel. ..."
          />

          <label style={{ marginTop: "10px", display: "block" }}>Email</label>
          <input
            value={intestazione.email}
            onChange={(e) => aggiornaIntestazione("email", e.target.value)}
            placeholder="Email..."
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
                      Formati facili
                    </div>

                    <label style={{ marginBottom: "6px", display: "block" }}>
                      Quante righe vuoi inserire
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={blocco.quantitaElenco || 3}
                      onChange={(e) =>
                        aggiornaBlocco(
                          blocco.id,
                          "quantitaElenco",
                          Number(e.target.value) || 1
                        )
                      }
                      style={{ marginBottom: "10px" }}
                    />

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
                        onClick={() => applicaFormatoCella(blocco.id, "n_grado")}
                      >
                        n°
                      </button>

                      <button
                        type="button"
                        onClick={() => applicaFormatoCella(blocco.id, "numero")}
                      >
                        1 2 3
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          applicaFormatoCella(blocco.id, "numero_punto")
                        }
                      >
                        1. 2. 3.
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          applicaFormatoCella(blocco.id, "numero_grado")
                        }
                      >
                        1° 2° 3°
                      </button>
                    </div>

                    <div style={{ fontSize: "13px", color: "#666" }}>
                      Clicca prima la cella che vuoi usare, poi scegli il formato.
                      Le righe si adattano alla larghezza della cella.
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
                        <textarea
                          key={`${blocco.id}-cella-${rigaIndex}-${cellaIndex}`}
                          value={cella}
                          onClick={() =>
                            selezionaCella(blocco.id, rigaIndex, cellaIndex)
                          }
                          onChange={(e) =>
                            aggiornaCellaTabella(
                              blocco.id,
                              rigaIndex,
                              cellaIndex,
                              e.target.value
                            )
                          }
                          style={{
                            minHeight: "54px",
                            resize: "vertical",
                            background: cellaAttiva(
                              blocco.id,
                              rigaIndex,
                              cellaIndex
                            )
                              ? "#e6f0ff"
                              : "white",
                            borderColor: cellaAttiva(
                              blocco.id,
                              rigaIndex,
                              cellaIndex
                            )
                              ? "#3b82f6"
                              : "#cfcfcf",
                          }}
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
              <div className="nome-scuola">{intestazione.nomeScuola}</div>
              <div className="riga-piccola">
                {intestazione.indirizzo} - {intestazione.cittaCap}
              </div>
              <div className="riga-piccola">{intestazione.codiceFiscale}</div>
              <div className="riga-piccola">
                {intestazione.telefono} - {intestazione.email}
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
                                {renderContenutoCella(cella)}
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