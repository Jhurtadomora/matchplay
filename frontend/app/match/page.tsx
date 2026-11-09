"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import Sidebar from "../components/Sidebar";
import Pestanas from "../components/Pestanas";
import { apiFetch, MODO_DEMO, RUTAS } from "../lib/api";
import { jugadores, solicitudes } from "../lib/datos";
import { perfilAUi } from "../lib/adaptadores";

export default function SolicitudesPage() {
  const [personas, setPersonas] = useState<any[]>([]);
  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
    if (MODO_DEMO) {
      setPersonas(solicitudes.map((id) => jugadores.find((j) => j.id === id)));
      return;
    }
    // Las "solicitudes" son los eventos personales que otros jugadores publicaron (tipo=personal)
    apiFetch(RUTAS.solicitudes).then((datos) => {
      const yo = localStorage.getItem("usuarioId");
      setPersonas(
        datos.filter((e: any) => e.creador && e.creador.id !== yo).map((e: any) => perfilAUi(e.creador, e))
      );
    });
  }, []);

  // Filtra por nombre o deporte mientras se escribe
  const texto = busqueda.toLowerCase();
  const lista = personas.filter(
    (p) => p.nombre.toLowerCase().includes(texto) || p.deporte.toLowerCase().includes(texto)
  );

  return (
    <div className="app">
      <Sidebar />

      <main className="contenido">
        <h1 className="titulo">Personas que quieren jugar contigo</h1>
        <p className="subtitulo">Revisa sus perfiles y responde a sus solicitudes</p>

        <Pestanas activa="solicitudes" />

        <p className="texto-gris">Quieren armar partido contigo</p>

        <div className="grilla-jugadores">
          {lista.map((p) => (
            <Link key={p.id} href={"/jugador/" + p.id} className="tarjeta-jugador">
              <div className="tarjeta-jugador-foto" style={{ backgroundColor: p.colorTarjeta }}>
                <span className="tag">{p.deporte.replace(" (Dobles)", "")}</span>
              </div>
              <div className="tarjeta-jugador-info">
                <h3>{p.nombre}, {p.edad}</h3>
                <p>Nivel {p.nivel}</p>
              </div>
            </Link>
          ))}
        </div>

        <div className="buscador buscador-borde">
          <Search size={22} strokeWidth={1.5} />
          <input placeholder="Buscar por nombre o deporte" value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)} />
        </div>
      </main>
    </div>
  );
}
