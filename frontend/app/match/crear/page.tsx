"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import Sidebar from "../../components/Sidebar";
import { apiFetch, MODO_DEMO, RUTAS } from "../../lib/api";
import { formatearFecha, formatearHora } from "../../lib/utilidades";

// Nombre de cada opción y su ancho en el Figma
const deportes = [
  { nombre: "Fútbol", ancho: 93 }, { nombre: "Básquet", ancho: 97 }, { nombre: "Tenis", ancho: 74 },
  { nombre: "Voleibol", ancho: 88 }, { nombre: "Pádel", ancho: 74 }, { nombre: "Ciclismo", ancho: 88 },
];
const niveles = [
  { nombre: "Cualquiera", ancho: 104 }, { nombre: "Principiante", ancho: 109 },
  { nombre: "Intermedio", ancho: 99 }, { nombre: "Avanzado", ancho: 99 },
];

export default function CrearEventoPage() {
  const router = useRouter();
  const [nombre, setNombre] = useState("");
  const [deporte, setDeporte] = useState("Fútbol");
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("");
  const [lugar, setLugar] = useState("");
  const [cupo, setCupo] = useState("");
  const [nivel, setNivel] = useState("Cualquiera");
  const [descripcion, setDescripcion] = useState("");
  const [error, setError] = useState("");

  async function publicar(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    // Lo que se muestra en la pantalla "evento publicado"
    const evento = {
      titulo: nombre,
      deporte: deporte,
      fecha: formatearFecha(fecha),
      hora: formatearHora(hora),
      lugar: lugar,
      inscritos: 0,
      cupo: Number(cupo),
      nivel: nivel,
      descripcion: descripcion,
    };

    try {
      if (!MODO_DEMO) {
        // El backend recibe la fecha y hora juntas en formato ISO; el evento nace en borrador y se publica
        const creado = await apiFetch(RUTAS.eventos, "POST", {
          tipo: "comunidad",
          titulo: nombre,
          deporte,
          fechaHora: new Date(fecha + "T" + hora).toISOString(),
          lugar,
          cupoMaximo: Number(cupo),
          nivelRequerido: nivel,
          ...(descripcion ? { descripcion } : {}),
        });
        await apiFetch(RUTAS.evento + creado.id + "/publicar", "POST");
      }
      // Guardamos el evento para mostrarlo en la siguiente pantalla
      localStorage.setItem("eventoPublicado", JSON.stringify(evento));

      // Limpiamos el formulario para la próxima vez
      setNombre(""); setFecha(""); setHora(""); setLugar(""); setCupo(""); setDescripcion("");
      router.push("/match/publicado");
    } catch (err: any) {
      setError(err.message);
    }
  }

  return (
    <div className="app">
      <Sidebar />

      <main className="contenido">
        <div className="volver-fila">
          <button className="btn-volver" onClick={() => router.push("/match/eventos")} aria-label="Volver">
            <ChevronLeft size={24} />
          </button>
          <h1 className="volver-titulo">Crear evento</h1>
        </div>

        <form onSubmit={publicar}>
          <div className="formulario-evento">
            <div className="campo">
              <label className="campo-label">Nombre del evento</label>
              <input className="campo-input" placeholder="Ej: Pichanga de fútbol 5"
                value={nombre} onChange={(e) => setNombre(e.target.value)} required />
            </div>

            <div className="campo" style={{ marginBottom: 36 }}>
              <label className="campo-label">Deporte</label>
              <div className="chips-oscuros">
                {deportes.map((d) => (
                  <button key={d.nombre} type="button" onClick={() => setDeporte(d.nombre)} style={{ width: d.ancho }}
                    className={deporte === d.nombre ? "chip-oscuro activo" : "chip-oscuro"}>
                    {d.nombre}
                  </button>
                ))}
              </div>
            </div>

            <div className="campo dos-columnas">
              <div>
                <label className="campo-label">Fecha</label>
                <input className="campo-input" type="date"
                  value={fecha} onChange={(e) => setFecha(e.target.value)} required />
              </div>
              <div>
                <label className="campo-label">Hora</label>
                <input className="campo-input" type="time"
                  value={hora} onChange={(e) => setHora(e.target.value)} required />
              </div>
            </div>

            <div className="campo">
              <label className="campo-label">Lugar</label>
              <input className="campo-input" placeholder="Ej: Coliseo Municipal"
                value={lugar} onChange={(e) => setLugar(e.target.value)} required />
            </div>

            <div className="campo dos-columnas">
              <div style={{ flex: "0 0 212px" }}>
                <label className="campo-label">Cupo máximo</label>
                <input className="campo-input" type="number" placeholder="Ej: 10" min={2} max={50}
                  value={cupo} onChange={(e) => setCupo(e.target.value)} required />
              </div>
              <div>
                <label className="campo-label">Nivel requerido</label>
                <div className="chips-nivel">
                  {niveles.map((n) => (
                    <button key={n.nombre} type="button" onClick={() => setNivel(n.nombre)}
                      style={{ width: n.ancho, height: 36, marginTop: 6 }}
                      className={nivel === n.nombre ? "chip-oscuro activo" : "chip-oscuro"}>
                      {n.nombre}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="campo">
              <label className="campo-label">Descripción</label>
              <textarea className="campo-input" placeholder="Cuéntale a otros jugadores de qué trata tu evento..."
                value={descripcion} onChange={(e) => setDescripcion(e.target.value)} />
            </div>

            {error && <p className="auth-error">{error}</p>}
          </div>

          <button className="btn-naranja btn-publicar" type="submit">Publicar evento</button>
        </form>
      </main>
    </div>
  );
}
