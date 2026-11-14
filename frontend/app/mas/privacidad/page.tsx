"use client";

import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import Encabezado from "../../components/Encabezado";
import { apiFetch, MODO_DEMO, RUTAS } from "../../lib/api";
import { miPrivacidad } from "../../lib/datos";

// No tiene pantalla propia en el Figma: usa el mismo diseño de Notificaciones
const opciones = [
  { clave: "perfilVisibleEnBusqueda", nombre: "Perfil visible en la búsqueda", detalle: "Otros jugadores pueden encontrarte en Inicio" },
  { clave: "mostrarEdad", nombre: "Mostrar mi edad", detalle: "Aparece junto a tu nombre" },
  { clave: "mostrarUbicacionExacta", nombre: "Mostrar ubicación exacta", detalle: "Si está apagado, solo se ve tu ciudad" },
];

export default function PrivacidadPage() {
  const [valores, setValores] = useState<any>({});
  const [error, setError] = useState("");

  useEffect(() => {
    if (MODO_DEMO) {
      setValores(miPrivacidad);
      return;
    }
    apiFetch(RUTAS.yo + "/privacidad").then(setValores).catch((err) => setError(err.message));
  }, []);

  async function cambiar(clave: string) {
    const nuevo = !valores[clave];
    setValores({ ...valores, [clave]: nuevo });
    setError("");
    if (MODO_DEMO) return;
    try {
      const guardado = await apiFetch(RUTAS.yo + "/privacidad", "PATCH", { [clave]: nuevo });
      setValores(guardado);
    } catch (err: any) {
      setError(err.message);
      setValores({ ...valores, [clave]: !nuevo });
    }
  }

  return (
    <div className="app">
      <Sidebar />

      <main className="contenido">
        <Encabezado titulo="Privacidad" estilo="b" />

        <div className="tarjeta-centrada">
          <p className="seccion-notif">Tu perfil</p>
          {opciones.map((op) => (
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

        <p className="pie-notif">{error || "Los cambios se guardan automáticamente"}</p>
      </main>
    </div>
  );
}
