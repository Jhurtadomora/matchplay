"use client";

import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import Encabezado from "../../components/Encabezado";
import { apiFetch, MODO_DEMO, RUTAS } from "../../lib/api";
import { misNotificaciones } from "../../lib/datos";

// Cada opción con el nombre que usa el backend (clave)
const secciones = [
  {
    titulo: "Actividad de partidos",
    opciones: [
      { clave: "nuevasSolicitudes", nombre: "Nuevas solicitudes de partido", detalle: "Cuando alguien quiere jugar contigo" },
      { clave: "mensajesNuevos", nombre: "Mensajes nuevos", detalle: "Cuando recibes un mensaje en el chat" },
      { clave: "recordatorioPartido", nombre: "Recordatorio antes de un partido", detalle: "30 minutos antes de la hora acordada" },
    ],
  },
  {
    titulo: "Eventos",
    opciones: [
      { clave: "nuevosEventosCerca", nombre: "Nuevos eventos cerca de ti", detalle: "Según tus deportes y preferencias" },
      { clave: "cuposCasiLlenos", nombre: "Cupos casi llenos", detalle: "Cuando un evento tuyo está por llenarse" },
      { clave: "cambiosEnEventos", nombre: "Cambios en tus eventos", detalle: "Cancelaciones o cambios de horario" },
    ],
  },
  {
    titulo: "General",
    opciones: [
      { clave: "novedadesYPromociones", nombre: "Novedades y promociones", detalle: "Noticias y anuncios de MatchPlay" },
    ],
  },
];

export default function NotificacionesPage() {
  const [valores, setValores] = useState<any>({});
  const [error, setError] = useState("");

  useEffect(() => {
    if (MODO_DEMO) {
      setValores(misNotificaciones);
      return;
    }
    apiFetch(RUTAS.yo + "/notificaciones").then(setValores).catch((err) => setError(err.message));
  }, []);

  // Se guarda apenas se toca el interruptor (solo se envía la opción que cambió)
  async function cambiar(clave: string) {
    const nuevo = !valores[clave];
    setValores({ ...valores, [clave]: nuevo });
    setError("");
    if (MODO_DEMO) return;
    try {
      const guardado = await apiFetch(RUTAS.yo + "/notificaciones", "PATCH", { [clave]: nuevo });
      setValores(guardado);
    } catch (err: any) {
      setError(err.message);
      setValores({ ...valores, [clave]: !nuevo }); // si falla, vuelve como estaba
    }
  }

  return (
    <div className="app">
      <Sidebar />

      <main className="contenido">
        <Encabezado titulo="Notificaciones" estilo="b" />

        <div className="tarjeta-centrada">
          {secciones.map((s, i) => (
            <div key={s.titulo}>
              <p className={i === 0 ? "seccion-notif" : "seccion-notif siguiente"}>{s.titulo}</p>
              {s.opciones.map((op) => (
                <div key={op.clave} className="fila-notif">
                  <div>
                    <h3>{op.nombre}</h3>
                    <p>{op.detalle}</p>
                  </div>
                  <button className={valores[op.clave] ? "interruptor encendido" : "interruptor"}
                    onClick={() => cambiar(op.clave)} aria-label={op.nombre}>
                    <i></i>
                  </button>
                </div>
              ))}
            </div>
          ))}
        </div>

        <p className="pie-notif">{error || "Los cambios se guardan automáticamente"}</p>
      </main>
    </div>
  );
}
