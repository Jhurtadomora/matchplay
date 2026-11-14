"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { X, Heart, Menu } from "lucide-react";
import Sidebar from "../components/Sidebar";
import { apiFetch, MODO_DEMO, RUTAS } from "../lib/api";
import { jugadores as jugadoresEjemplo } from "../lib/datos";
import { perfilAUi } from "../lib/adaptadores";
import { mismoDeporte } from "../lib/utilidades";

// Nombre de cada filtro y su ancho en el Figma
const filtros = [
  { nombre: "Todos", ancho: 58 },
  { nombre: "Fútbol", ancho: 67 },
  { nombre: "Básquet", ancho: 76 },
  { nombre: "Tenis", ancho: 59 },
];

export default function InicioPage() {
  const [jugadores, setJugadores] = useState<any[]>([]);
  const [indice, setIndice] = useState(0);
  const [filtro, setFiltro] = useState("Todos");
  const [aviso, setAviso] = useState("");
  const [extra, setExtra] = useState(""); // deporte que llega desde Explorar

  // Al abrir la página traemos los jugadores
  useEffect(() => {
    // Si venimos de Explorar, la dirección trae el deporte: /inicio?deporte=Tenis
    const deporte = new URLSearchParams(window.location.search).get("deporte");
    if (deporte) {
      const chip = filtros.find((f) => f.nombre !== "Todos" && mismoDeporte(f.nombre, deporte));
      if (chip) {
        setFiltro(chip.nombre);
      } else {
        setExtra(deporte);
        setFiltro(deporte);
      }
    } else {
      setExtra("");
      setFiltro("Todos");
    }
    setIndice(0);

    if (MODO_DEMO) {
      setJugadores(jugadoresEjemplo);
      return;
    }
    apiFetch(RUTAS.jugadores)
      .then((datos) => setJugadores(datos.map((p: any) => perfilAUi(p))))
      .catch((err) => setAviso(err.message));
  }, []);

  // Solo mostramos los del deporte elegido
  const lista = jugadores.filter((j) => filtro === "Todos" || mismoDeporte(j.deporte, filtro));
  const actual = lista[indice];

  function cambiarFiltro(f: string) {
    setFiltro(f);
    setIndice(0);
  }

  async function darLike() {
    try {
      if (!MODO_DEMO) {
        const res = await apiFetch(RUTAS.like + actual.id + "/like", "POST");
        setAviso(res.match ? "¡Hiciste match con " + actual.nombre + "!" : "");
      }
      setIndice(indice + 1);
    } catch (err: any) {
      setAviso(err.message);
    }
  }

  async function pasar() {
    try {
      if (!MODO_DEMO) await apiFetch(RUTAS.pass + actual.id + "/pass", "POST");
      setAviso("");
      setIndice(indice + 1);
    } catch (err: any) {
      setAviso(err.message);
    }
  }

  return (
    <div className="app">
      <Sidebar />

      <main className="contenido inicio">
        <h1 className="titulo">Descubre jugadores cerca de ti</h1>
        <p className="subtitulo">Desliza para armar tu próximo partido</p>

        <div className="filtros">
          {(extra ? [...filtros, { nombre: extra, ancho: 0 }] : filtros).map((f) => (
            <button key={f.nombre} style={{ width: f.ancho || "auto", padding: f.ancho ? 0 : "0 15px" }}
              className={filtro === f.nombre ? "filtro activo" : "filtro"} onClick={() => cambiarFiltro(f.nombre)}>
              {f.nombre}
            </button>
          ))}
          <div className="filtros-separador"></div>
          <button className="icono"><Menu size={24} strokeWidth={1.5} /></button>
        </div>

        {aviso && <p className="vacio">{aviso}</p>}

        {!actual && <p className="vacio">Ya viste a todos los jugadores. Vuelve más tarde.</p>}

        {actual && (
          <>
            <Link href={"/jugador/" + actual.id} className="tarjeta-inicio">
              <div className="tarjeta-inicio-foto" style={{ backgroundColor: actual.colorInicio }}>
                <span className="disponible"><i></i>Disponible ahora</span>
              </div>
              <div className="tarjeta-inicio-info" style={{ backgroundColor: actual.colorInfo }}>
                <h2>{actual.nombre}, {actual.edad}</h2>
                <span className="tag">{actual.deporte}</span>
                <p>Nivel {actual.nivel}</p>
              </div>
            </Link>

            <div className="botones-inicio">
              <button className="btn-pasar" onClick={pasar} aria-label="Pasar">
                <X size={26} strokeWidth={1.5} />
              </button>
              <button className="btn-like" onClick={darLike} aria-label="Me gusta">
                <Heart size={20} fill="#1c1c1e" />
              </button>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
