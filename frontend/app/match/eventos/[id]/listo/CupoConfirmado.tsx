"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import Sidebar from "../../../../components/Sidebar";
import Chulo from "../../../../components/Chulo";
import { apiFetch, MODO_DEMO, RUTAS } from "../../../../lib/api";
import { eventos } from "../../../../lib/datos";
import { eventoAUi } from "../../../../lib/adaptadores";

export default function CupoConfirmado() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const [evento, setEvento] = useState<any>(null);

  useEffect(() => {
    if (MODO_DEMO) {
      const ev = eventos.find((e) => e.id === id);
      // En modo demo sumamos el cupo que se acaba de tomar
      if (ev) setEvento({ ...ev, inscritos: ev.inscritos + 1 });
      return;
    }
    apiFetch(RUTAS.evento + id).then((datos) => setEvento(eventoAUi(datos)));
  }, [id]);

  return (
    <div className="app">
      <Sidebar />

      <main className="contenido">
        <div className="volver-fila">
          <button className="btn-volver" onClick={() => router.push("/match/eventos")} aria-label="Volver">
            <ChevronLeft size={24} />
          </button>
          <span className="migas">Eventos › Confirmación</span>
        </div>

        {evento && (
          <div className="exito">
            <div className="exito-circulo"><Chulo color="#97c459" tamano={70} /></div>
            <h1>¡Listo, ya estás dentro!</h1>
            <p>Tu cupo quedó reservado para este partido</p>

            <div className="caja-evento">
              <div className="caja-evento-arriba">
                <span className="tag">{evento.deporte}</span>
                <span className="cupos">{evento.inscritos}/{evento.cupo}</span>
              </div>
              <h3>{evento.titulo}</h3>
              <p>{evento.fecha} · {evento.hora}</p>
              <p>{evento.lugar}</p>
            </div>

            <button className="btn-borde solo" onClick={() => router.push("/match/eventos")}>Volver</button>
          </div>
        )}
      </main>
    </div>
  );
}
