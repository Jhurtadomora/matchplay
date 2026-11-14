"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import Sidebar from "../components/Sidebar";
import { apiFetch, MODO_DEMO, RUTAS } from "../lib/api";
import { chats as chatsEjemplo } from "../lib/datos";
import { chatAUi } from "../lib/adaptadores";
import { mismoDeporte } from "../lib/utilidades";

// Nombre de cada filtro y su ancho en el Figma
const filtros = [
  { nombre: "Todos", ancho: 70 },
  { nombre: "Fútbol", ancho: 72 },
  { nombre: "Básquet", ancho: 85 },
  { nombre: "Tenis", ancho: 69 },
];

export default function ChatsPage() {
  const [chats, setChats] = useState<any[]>([]);
  const [filtro, setFiltro] = useState("Todos");
  const [aviso, setAviso] = useState("");

  // Cada vez que cambia el filtro pedimos los chats otra vez (GET /chats?deporte=...)
  useEffect(() => {
    setAviso("");
    if (MODO_DEMO) {
      setChats(chatsEjemplo.map(chatAUi).filter((c) => filtro === "Todos" || mismoDeporte(c.deporte, filtro)));
      return;
    }
    const ruta = filtro === "Todos" ? RUTAS.chats : RUTAS.chats + "?deporte=" + encodeURIComponent(filtro);
    apiFetch(ruta)
      .then((datos) => setChats(datos.map(chatAUi)))
      .catch((err) => setAviso(err.message));
  }, [filtro]);

  return (
    <div className="app">
      <Sidebar />

      <main className="contenido chats pagina-v2">
        <h1 className="titulo">Chats</h1>
        <p className="subtitulo">Continúa la conversación con tus rivales</p>

        <div className="filtros">
          {filtros.map((f) => (
            <button key={f.nombre} style={{ width: f.ancho }}
              className={filtro === f.nombre ? "filtro activo" : "filtro"} onClick={() => setFiltro(f.nombre)}>
              {f.nombre}
            </button>
          ))}
          <div className="filtros-separador"></div>
          <button className="icono"><Menu size={24} strokeWidth={1.5} color="#9a9a9e" /></button>
        </div>

        {aviso && <p className="vacio">{aviso}</p>}
        {!aviso && chats.length === 0 && (
          <p className="vacio">Todavía no tienes chats. Cuando hagas match con alguien, aparecerá aquí.</p>
        )}

        <div className="lista-chats">
          {chats.map((c) => (
            <Link key={c.id} href={"/chat/" + c.id} className="fila-chat">
              <div className="avatar-chat" style={{ backgroundColor: c.colorAvatar }}></div>
              <div>
                <h3>{c.nombre}</h3>
                <p>{c.deporte} · {c.ultimoMensaje}</p>
              </div>
              <span className="etiqueta-chat">{c.deporte}</span>
              {/* El punto naranja indica mensajes sin leer */}
              <span className={c.noLeidos > 0 ? "punto-nuevo" : "punto-nuevo leido"}></span>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
