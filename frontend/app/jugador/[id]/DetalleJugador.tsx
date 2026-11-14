"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import Sidebar from "../../components/Sidebar";
import { apiFetch, MODO_DEMO, RUTAS } from "../../lib/api";
import { jugadores, chats as chatsEjemplo } from "../../lib/datos";
import { perfilAUi } from "../../lib/adaptadores";

export default function DetalleJugador() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const [jugador, setJugador] = useState<any>(null);
  const [aviso, setAviso] = useState("");

  useEffect(() => {
    setAviso("");
    if (MODO_DEMO) {
      setJugador(jugadores.find((j) => j.id === id));
      return;
    }
    // Perfil + (si tiene) el evento personal que publicó, de donde salen lugar, horario y descripción
    Promise.all([
      apiFetch(RUTAS.jugador + id),
      apiFetch(RUTAS.solicitudes).catch(() => []),
    ]).then(([perfil, eventos]) => {
      const evento = eventos.find((e: any) => e.creador?.id === id);
      setJugador(perfilAUi(perfil, evento));
    });
  }, [id]);

  // Abre el chat con este jugador. El chat existe solo si ya hicieron match.
  async function enviarMensaje() {
    setAviso("");
    if (MODO_DEMO) {
      const chat = chatsEjemplo.find((c) => c.perfil.id === id);
      if (chat) router.push("/chat/" + chat.id);
      else setAviso("Primero deben hacer match para poder chatear");
      return;
    }
    try {
      const misChats = await apiFetch(RUTAS.chats);
      const chat = misChats.find((c: any) => c.perfil?.id === id);
      if (chat) router.push("/chat/" + chat.id);
      else setAviso("Primero deben hacer match para poder chatear");
    } catch (err: any) {
      setAviso(err.message);
    }
  }

  return (
    <div className="app">
      <Sidebar />

      <main className="contenido detalle">
        <button className="btn-volver" onClick={() => router.back()} aria-label="Volver">
          <ChevronLeft size={24} />
        </button>

        {jugador && (
          <div className="detalle-tarjeta">
            <div className="detalle-foto" style={{ backgroundColor: jugador.colorFoto }}>
              <h1>{jugador.nombre}, {jugador.edad}</h1>
              <span className="tag">{jugador.deporte}</span>
            </div>

            <div className="detalle-filas">
              <div className="detalle-fila"><span>Lugar</span><strong>{jugador.lugar}</strong></div>
              <div className="detalle-fila"><span>Horario</span><strong>{jugador.horario}</strong></div>
              <div className="detalle-fila"><span>Nivel</span><strong>Nivel {jugador.nivel}</strong></div>
            </div>

            <div className="detalle-sobre">
              <h3>Sobre este partido</h3>
              <p>{jugador.descripcion}</p>
            </div>

            {aviso && <p className="aviso-detalle">{aviso}</p>}
            <button className="btn-naranja" onClick={enviarMensaje}>
              Enviar mensaje
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
