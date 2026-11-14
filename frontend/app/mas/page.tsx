"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import Sidebar from "../components/Sidebar";
import { cerrarSesion } from "../lib/api";

// Opciones de cada sección. ruta vacía = todavía no tiene pantalla en el Figma
const cuenta = [
  { nombre: "Editar perfil", ruta: "/mas/perfil" },
  { nombre: "Mis deportes e intereses", ruta: "/mas/deportes" },
  { nombre: "Notificaciones", ruta: "/mas/notificaciones" },
  { nombre: "Privacidad", ruta: "/mas/privacidad" },
];
const preferencias = [
  { nombre: "Idioma", ruta: "/mas/idioma" },
  { nombre: "Horario disponible", ruta: "/mas/horario" },
  { nombre: "Cambiar tema", ruta: "/mas/tema" },
];
const soporte = [
  { nombre: "Términos y condiciones", ruta: "/mas/terminos" },
  { nombre: "Ayuda y soporte", ruta: "" },
];

// Dibuja una tarjeta con sus filas
function Lista({ opciones }: { opciones: { nombre: string; ruta: string }[] }) {
  return (
    <div className="lista-ajustes">
      {opciones.map((op) =>
        op.ruta ? (
          <Link key={op.nombre} href={op.ruta} className="fila-ajuste">
            {op.nombre}
            <ChevronRight size={20} />
          </Link>
        ) : (
          <div key={op.nombre} className="fila-ajuste sin-enlace">
            {op.nombre}
            <ChevronRight size={20} />
          </div>
        )
      )}
    </div>
  );
}

export default function MasPage() {
  const router = useRouter();
  const [miId, setMiId] = useState("");

  useEffect(() => {
    setMiId(localStorage.getItem("usuarioId") || "");
  }, []);

  function salir() {
    cerrarSesion();
    router.push("/login");
  }

  return (
    <div className="app">
      <Sidebar />

      <main className="contenido mas pagina-v2">
        <h1 className="titulo">Más</h1>

        {/* "Tu perfil" muestra cómo te ven los demás jugadores */}
        <div className="lista-ajustes tu-perfil">
          <Link href={miId ? "/jugador/" + miId : "/mas/perfil"} className="fila-ajuste">
            <span><div className="avatar"></div>Tu perfil</span>
            <ChevronRight size={20} />
          </Link>
        </div>

        <p className="seccion-ajustes">Cuenta</p>
        <Lista opciones={cuenta} />

        <p className="seccion-ajustes">Preferencias</p>
        <Lista opciones={preferencias} />

        <p className="seccion-ajustes">Soporte</p>
        <Lista opciones={soporte} />

        <button className="btn-salir" onClick={salir}>Cerrar sesión</button>
      </main>
    </div>
  );
}
