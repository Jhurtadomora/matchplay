"use client";

import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import Encabezado from "../../components/Encabezado";
import { apiFetch, MODO_DEMO, RUTAS } from "../../lib/api";
import { miPerfil } from "../../lib/datos";

// codigo = lo que guarda el backend ("es", "en", "pt")
const idiomas = [
  { codigo: "es", nombre: "Español", detalle: "Predeterminado" },
  { codigo: "en", nombre: "English", detalle: "United States" },
  { codigo: "pt", nombre: "Português", detalle: "Brasil" },
];

export default function IdiomaPage() {
  const [idioma, setIdioma] = useState("es");
  const [error, setError] = useState("");

  // El idioma guardado viene con los datos de la cuenta (GET /me/datos)
  useEffect(() => {
    if (MODO_DEMO) {
      setIdioma(miPerfil.idioma);
      return;
    }
    apiFetch(RUTAS.yo + "/datos").then((p) => setIdioma(p.idioma || "es")).catch((err) => setError(err.message));
  }, []);

  async function elegir(codigo: string) {
    const anterior = idioma;
    setIdioma(codigo);
    setError("");
    if (MODO_DEMO) return;
    try {
      await apiFetch(RUTAS.yo + "/idioma", "PUT", { idioma: codigo });
    } catch (err: any) {
      setError(err.message);
      setIdioma(anterior);
    }
  }

  return (
    <div className="app">
      <Sidebar />

      <main className="contenido pagina-v2">
        <Encabezado titulo="Idioma" subtitulo="Selecciona el idioma de la aplicación" />

        <div className="lista-opciones">
          {idiomas.map((i) => (
            <button key={i.codigo} className="opcion" onClick={() => elegir(i.codigo)}>
              <div>
                <strong>{i.nombre}</strong>
                <span>{i.detalle}</span>
              </div>
              <span className={idioma === i.codigo ? "radio activo" : "radio"}></span>
            </button>
          ))}
        </div>

        {error && <p className="aviso-error" style={{ width: 560 }}>{error}</p>}
      </main>
    </div>
  );
}
