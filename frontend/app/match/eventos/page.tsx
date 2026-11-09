"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Plus, PanelTop } from "lucide-react";
import Sidebar from "../../components/Sidebar";
import Pestanas from "../../components/Pestanas";
import { apiFetch, MODO_DEMO, RUTAS } from "../../lib/api";
import { eventos as eventosEjemplo } from "../../lib/datos";
import { eventoAUi } from "../../lib/adaptadores";
import { claseCupos } from "../../lib/utilidades";

export default function EventosPage() {
  const router = useRouter();
  const [eventos, setEventos] = useState<any[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [error, setError] = useState("");
  const [elegido, setElegido] = useState<any>(null); // evento del que se abre la ventana

  useEffect(() => {
    // Cada vez que se entra se cierra la ventana
    setElegido(null);
    setError("");
    if (MODO_DEMO) {
      setEventos(eventosEjemplo);
      return;
    }
    apiFetch(RUTAS.eventosComunidad).then((datos) => setEventos(datos.map(eventoAUi)));
  }, []);

  const texto = busqueda.toLowerCase();
  const lista = eventos.filter(
    (ev) => ev.deporte.toLowerCase().includes(texto) || ev.lugar.toLowerCase().includes(texto) || ev.titulo.toLowerCase().includes(texto)
  );

  async function confirmar() {
    setError("");
    try {
      if (!MODO_DEMO) {
        await apiFetch(RUTAS.evento + elegido.id + "/join", "POST");
      }
      router.push("/match/eventos/" + elegido.id + "/listo");
    } catch (err: any) {
      setError(err.message); // por ejemplo: cupo lleno o ya estás inscrito
    }
  }

  return (
    <div className="app">
      <Sidebar />

      <main className="contenido">
        <h1 className="titulo">Eventos organizados cerca de ti</h1>
        <p className="subtitulo">Únete a un partido ya armado o crea el tuyo</p>

        <Pestanas activa="eventos" />

        <div className="buscador buscador-relleno">
          <Search size={22} strokeWidth={1.5} />
          <input placeholder="Buscar eventos por deporte o lugar" value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)} />
        </div>

        <div className="grilla-eventos">
          {lista.map((ev) => (
            <div key={ev.id} className="evento">
              <h3>{ev.titulo}</h3>
              <p>{ev.fecha} · {ev.hora} · {ev.lugar}</p>
              <span className={claseCupos(ev.inscritos, ev.cupo)}>{ev.inscritos}/{ev.cupo}</span>
              <button className="btn-naranja" onClick={() => setElegido(ev)}>Unirme</button>
            </div>
          ))}
        </div>

        <div className="banner">
          <div className="banner-circulo"><Plus size={52} strokeWidth={1.5} /></div>
          <div>
            <h3>¿No encuentras un partido para ti?</h3>
            <p>Organiza el tuyo y deja que la comunidad se una.</p>
          </div>
          <button className="btn-naranja" onClick={() => router.push("/match/crear")}>+ Crear evento</button>
        </div>
      </main>

      {/* Ventana para confirmar el cupo */}
      {elegido && (
        <div className="fondo-oscuro" onClick={() => setElegido(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-icono"><PanelTop size={26} strokeWidth={1.5} /></div>
            <h2>¿Confirmar tu cupo?</h2>
            <h3>{elegido.titulo}</h3>
            <p>{elegido.fecha} · {elegido.hora}</p>
            <p>{elegido.lugar}</p>
            <div className="modal-nota">
              Quedan {elegido.cupo - elegido.inscritos} cupos · tu lugar se reserva al confirmar
            </div>
            {error && <p className="auth-error">{error}</p>}
            <div className="modal-botones">
              <button className="btn-borde" onClick={() => setElegido(null)}>Cancelar</button>
              <button className="btn-naranja" onClick={confirmar}>Confirmar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
