"use client";

import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import Encabezado from "../../components/Encabezado";
import { apiFetch, MODO_DEMO, RUTAS } from "../../lib/api";
import { deportes as deportesEjemplo, miPerfil } from "../../lib/datos";

// No tiene pantalla propia en el Figma: usa el mismo diseño de Editar perfil
const niveles = ["Principiante", "Intermedio", "Avanzado"];

export default function MisDeportesPage() {
  const [catalogo, setCatalogo] = useState<string[]>([]);
  const [favoritos, setFavoritos] = useState<string[]>([]);
  const [nivel, setNivel] = useState("Intermedio");
  const [radio, setRadio] = useState("10");
  const [aviso, setAviso] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setAviso("");
    if (MODO_DEMO) {
      setCatalogo(deportesEjemplo.map((d) => d.nombre));
      setFavoritos(miPerfil.deportesFavoritos);
      setNivel(miPerfil.nivel);
      return;
    }
    // Los deportes que se pueden elegir (GET /deportes) y los que ya tengo (GET /me/preferencias-deportivas)
    apiFetch(RUTAS.deportes).then((datos) => setCatalogo(datos.map((d: any) => d.nombre))).catch(() => {});
    apiFetch(RUTAS.yo + "/preferencias-deportivas")
      .then((p) => {
        setFavoritos(p.deportesFavoritos || []);
        setNivel(p.nivel || "Intermedio");
        setRadio(String(p.radioBusquedaKm || 10));
      })
      .catch((err) => setError(err.message));
  }, []);

  function cambiarDeporte(deporte: string) {
    if (favoritos.includes(deporte)) {
      setFavoritos(favoritos.filter((d) => d !== deporte));
    } else {
      setFavoritos([...favoritos, deporte]);
    }
  }

  async function guardar(e: React.FormEvent) {
    e.preventDefault();
    setAviso("");
    setError("");
    if (favoritos.length === 0) {
      setError("Elige al menos un deporte");
      return;
    }
    try {
      if (!MODO_DEMO) {
        await apiFetch(RUTAS.yo + "/preferencias-deportivas", "PUT", {
          deportesFavoritos: favoritos,
          nivel,
          radioBusquedaKm: Number(radio),
        });
      }
      setAviso("Cambios guardados");
    } catch (err: any) {
      setError(err.message);
    }
  }

  // Muestra el catálogo y además los favoritos que no estén en él (por ejemplo, los del registro)
  const opciones = [...catalogo, ...favoritos.filter((f) => !catalogo.includes(f))];

  return (
    <div className="app">
      <Sidebar />

      <main className="contenido pagina-v2">
        <Encabezado titulo="Mis deportes e intereses" subtitulo="Elige qué juegas y a qué nivel" />

        <form className="tarjeta-form" onSubmit={guardar}>
          <label className="etiqueta-v2" style={{ marginTop: 0 }}>Deportes favoritos</label>
          <div className="chips-v2">
            {opciones.map((d) => (
              <button key={d} type="button" onClick={() => cambiarDeporte(d)}
                className={favoritos.includes(d) ? "chip-v2 activo" : "chip-v2"}>
                {d}
              </button>
            ))}
          </div>

          <label className="etiqueta-v2" style={{ marginTop: 24 }}>Nivel de juego</label>
          <div className="chips-v2">
            {niveles.map((n) => (
              <button key={n} type="button" onClick={() => setNivel(n)} className={nivel === n ? "chip-v2 activo" : "chip-v2"}>
                {n}
              </button>
            ))}
          </div>

          <label className="etiqueta-v2" style={{ marginTop: 24 }}>Buscar jugadores a menos de (km)</label>
          <input className="input-v2" type="number" min={1} max={100} style={{ width: 180 }}
            value={radio} onChange={(e) => setRadio(e.target.value)} required />

          <button className="btn-v2" type="submit" style={{ marginTop: 32 }}>Guardar cambios</button>

          {aviso && <p className="aviso-ok">{aviso}</p>}
          {error && <p className="aviso-error">{error}</p>}
        </form>
      </main>
    </div>
  );
}
