"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { aplicarTema } from "../lib/tema";

// Menú de la izquierda
const opciones = [
  { nombre: "Inicio", icono: "/img/inicio.png", ruta: "/inicio" },
  { nombre: "Explorar", icono: "/img/explorar.png", ruta: "/explorar" },
  { nombre: "Match", icono: "/img/match.png", ruta: "/match" },
  { nombre: "Chat", icono: "/img/chat.png", ruta: "/chat" },
  { nombre: "Más", icono: "/img/mas.png", ruta: "/mas" },
];

export default function Sidebar() {
  const rutaActual = usePathname();
  const [nombre, setNombre] = useState("Camilo T.");
  const [miId, setMiId] = useState("");

  // Nombre del usuario que inició sesión y el tema que eligió
  useEffect(() => {
    const guardado = localStorage.getItem("nombre");
    if (guardado) setNombre(guardado);
    setMiId(localStorage.getItem("usuarioId") || "");
    aplicarTema(localStorage.getItem("tema") || "oscuro");
  }, []);

  return (
    <aside className="sidebar">
      <div className="sidebar-marca">
        <img src="/img/logo.png" alt="" />
        MatchPlay
      </div>

      <nav className="sidebar-menu">
        {opciones.map((op) => {
          // Inicio también queda activo cuando se ve el detalle de un jugador
          const activo =
            rutaActual.startsWith(op.ruta) || (op.ruta === "/inicio" && rutaActual.startsWith("/jugador"));

          return (
            <Link key={op.nombre} href={op.ruta} className={activo ? "menu-item activo" : "menu-item"}>
              <img src={op.icono} alt="" />
              {op.nombre}
            </Link>
          );
        })}
      </nav>

      <Link href={miId ? "/jugador/" + miId : "/mas"} className="sidebar-usuario">
        <div className="avatar"></div>
        <div>
          <strong>{nombre}</strong>
          <span>Ver perfil</span>
        </div>
      </Link>
    </aside>
  );
}
