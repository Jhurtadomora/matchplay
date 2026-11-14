"use client";

import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import Encabezado from "../../components/Encabezado";
import { apiFetch, MODO_DEMO, RUTAS } from "../../lib/api";
import { miPerfil } from "../../lib/datos";
import { aplicarTema } from "../../lib/tema";

// codigo = lo que guarda el backend; color = círculo de muestra del Figma
const temas = [
  { codigo: "oscuro", nombre: "Oscuro", detalle: "Ideal para la noche", color: "#0d0d0f" },
  { codigo: "claro", nombre: "Claro", detalle: "Mejor visibilidad de día", color: "#f5f5f5" },
  { codigo: "automatico", nombre: "Automático", detalle: "Sigue la configuración del sistema", color: "#8a8a90" },
];

export default function TemaPage() {
  const [tema, setTema] = useState("oscuro");
  const [error, setError] = useState("");

  useEffect(() => {
    if (MODO_DEMO) {
      setTema(localStorage.getItem("tema") || miPerfil.tema);
      return;
    }
    apiFetch(RUTAS.yo + "/datos").then((p) => setTema(p.tema || "oscuro")).catch((err) => setError(err.message));
  }, []);

  async function elegir(codigo: string) {
    setTema(codigo);
    setError("");
    // Se aplica de una vez y se recuerda en el navegador
    localStorage.setItem("tema", codigo);
    aplicarTema(codigo);
    if (MODO_DEMO) return;
    try {
      await apiFetch(RUTAS.yo + "/tema", "PUT", { tema: codigo });
    } catch (err: any) {
      setError(err.message);
    }
  }

  return (
    <div className="app">
      <Sidebar />

      <main className="contenido pagina-v2 tema">
        <Encabezado titulo="Cambiar tema" subtitulo="Elige cómo quieres ver MatchPlay" />

        <div className="lista-opciones">
          {temas.map((t) => (
            <button key={t.codigo} className="opcion" onClick={() => elegir(t.codigo)}>
              <span className="muestra" style={{ backgroundColor: t.color }}></span>
              <div>
                <strong>{t.nombre}</strong>
                <span>{t.detalle}</span>
              </div>
              <span className={tema === t.codigo ? "radio activo" : "radio"}></span>
            </button>
          ))}
        </div>

        {error && <p className="aviso-error" style={{ width: 560 }}>{error}</p>}
      </main>
    </div>
  );
}
