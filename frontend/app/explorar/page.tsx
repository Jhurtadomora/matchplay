"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Sidebar from "../components/Sidebar";
import { apiFetch, MODO_DEMO, RUTAS } from "../lib/api";
import { deportes as deportesEjemplo } from "../lib/datos";
import { iconoDeporte } from "../lib/adaptadores";

export default function ExplorarPage() {
  const [deportes, setDeportes] = useState<any[]>([]);
  const [aviso, setAviso] = useState("");

  // Al abrir la página traemos el catálogo de deportes (GET /deportes)
  useEffect(() => {
    if (MODO_DEMO) {
      setDeportes(deportesEjemplo);
      return;
    }
    apiFetch(RUTAS.deportes)
      // Los más populares primero, como en el Figma
      .then((datos) => setDeportes(datos.sort((a: any, b: any) => b.disponibles - a.disponibles)))
      .catch((err) => setAviso(err.message));
  }, []);

  return (
    <div className="app">
      <Sidebar />

      <main className="contenido explorar">
        <h1 className="titulo">Explora por deporte</h1>
        <p className="subtitulo">Encuentra jugadores según lo que quieras practicar</p>

        {aviso && <p className="vacio">{aviso}</p>}

        <div className="grilla-deportes">
          {deportes.map((d) => (
            // Al tocar un deporte vamos a Inicio con ese deporte ya filtrado
            <Link key={d.id} href={"/inicio?deporte=" + encodeURIComponent(d.nombre)} className="tarjeta-deporte">
              <img src={iconoDeporte(d.nombre)} alt="" />
              <h3>{d.nombre}</h3>
              <p>{d.disponibles} disponibles</p>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
