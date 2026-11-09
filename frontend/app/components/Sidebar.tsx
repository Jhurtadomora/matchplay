"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

// Menú de la izquierda. Explorar, Chat y Más son de la siguiente entrega.
const opciones = [
  { nombre: "Inicio", icono: "/img/inicio.png", ruta: "/inicio" },
  { nombre: "Explorar", icono: "/img/explorar.png", ruta: "" },
  { nombre: "Match", icono: "/img/match.png", ruta: "/match" },
  { nombre: "Chat", icono: "/img/chat.png", ruta: "" },
  { nombre: "Más", icono: "/img/mas.png", ruta: "" },
];

export default function Sidebar() {
  const rutaActual = usePathname();
  const [nombre, setNombre] = useState("Camilo T.");

  // Nombre del usuario que inició sesión
  useEffect(() => {
    const guardado = localStorage.getItem("nombre");
    if (guardado) setNombre(guardado);
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
            op.ruta !== "" &&
            (rutaActual.startsWith(op.ruta) || (op.ruta === "/inicio" && rutaActual.startsWith("/jugador")));

          const contenido = (
            <>
              <img src={op.icono} alt="" />
              {op.nombre}
            </>
          );

          if (op.ruta === "") {
            return <div key={op.nombre} className="menu-item">{contenido}</div>;
          }

          return (
            <Link key={op.nombre} href={op.ruta} className={activo ? "menu-item activo" : "menu-item"}>
              {contenido}
            </Link>
          );
        })}
      </nav>

      <div className="sidebar-usuario">
        <div className="avatar"></div>
        <div>
          <strong>{nombre}</strong>
          <span>Ver perfil</span>
        </div>
      </div>
    </aside>
  );
}
