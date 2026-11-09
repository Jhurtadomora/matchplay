"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "../../components/Sidebar";
import Chulo from "../../components/Chulo";

export default function EventoPublicadoPage() {
  const router = useRouter();
  const [evento, setEvento] = useState<any>(null);

  // Leemos el evento que se acaba de crear
  useEffect(() => {
    const guardado = localStorage.getItem("eventoPublicado");
    if (guardado) setEvento(JSON.parse(guardado));
  }, []);

  return (
    <div className="app">
      <Sidebar />

      <main className="contenido">
        {evento && (
          <div className="exito sin-volver">
            <div className="exito-circulo"><Chulo color="#97c459" tamano={70} /></div>
            <h1>¡Tu evento fue publicado!</h1>
            <p>Ya está visible para otros jugadores cerca de ti</p>

            <div className="caja-evento">
              <div className="caja-evento-arriba">
                <span className="tag">{evento.deporte}</span>
                <span className="cupos">{evento.inscritos}/{evento.cupo}</span>
              </div>
              <h3>{evento.titulo}</h3>
              <p>{evento.fecha} · {evento.hora}</p>
              <p>{evento.lugar}</p>
            </div>

            <p className="aviso">Te avisaremos cuando alguien se una</p>

            <button className="btn-naranja" onClick={() => router.push("/match/eventos")}>Ver mi evento</button>
            <button className="btn-borde" onClick={() => router.push("/match/eventos")}>Volver</button>
          </div>
        )}
      </main>
    </div>
  );
}
