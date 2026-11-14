"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowUp, CalendarPlus, Check } from "lucide-react";
import Sidebar from "../../components/Sidebar";
import { apiFetch, MODO_DEMO, RUTAS } from "../../lib/api";
import { chats as chatsEjemplo, mensajes as mensajesEjemplo, eventosPropuestos } from "../../lib/datos";
import { chatAUi, colores } from "../../lib/adaptadores";
import { diaYHora } from "../../lib/utilidades";

export default function Conversacion() {
  const { id } = useParams<{ id: string }>();
  const [miId, setMiId] = useState("yo");
  const [chats, setChats] = useState<any[]>([]);
  const [mensajes, setMensajes] = useState<any[]>([]);
  const [eventos, setEventos] = useState<any>({}); // eventos de las propuestas, guardados por id
  const [texto, setTexto] = useState("");
  const [misEventos, setMisEventos] = useState<any[]>([]);
  const [mostrarMenu, setMostrarMenu] = useState(false);
  const [error, setError] = useState("");

  // Trae los mensajes del chat y, si hay propuestas, el evento de cada una
  async function cargarMensajes() {
    if (MODO_DEMO) {
      setMensajes(mensajesEjemplo[id] || []);
      setEventos(eventosPropuestos);
      return;
    }
    const datos = await apiFetch(RUTAS.chats + "/" + id + "/mensajes");
    setMensajes(datos);

    const nuevos: any = {};
    for (const m of datos) {
      if (m.tipo === "propuesta_evento" && m.eventoId) {
        const ev = await apiFetch(RUTAS.evento + m.eventoId);
        nuevos[m.eventoId] = { deporte: ev.deporte, lugar: ev.lugar, cuando: diaYHora(ev.fechaHora) };
      }
    }
    setEventos(nuevos);
  }

  useEffect(() => {
    setError("");
    setMostrarMenu(false);
    setMiId(MODO_DEMO ? "yo" : localStorage.getItem("usuarioId") || "");

    // Lista de chats de la columna del medio
    if (MODO_DEMO) {
      setChats(chatsEjemplo.map(chatAUi));
    } else {
      apiFetch(RUTAS.chats).then((datos) => setChats(datos.map(chatAUi))).catch((err) => setError(err.message));
    }

    cargarMensajes().catch((err) => setError(err.message));

    // Cada 5 segundos revisamos si llegaron mensajes nuevos
    const reloj = setInterval(() => cargarMensajes().catch(() => {}), 5000);
    return () => clearInterval(reloj);
  }, [id]);

  const actual = chats.find((c) => c.id === id);

  async function enviar(e: React.FormEvent) {
    e.preventDefault();
    if (texto.trim() === "") return;
    setError("");
    try {
      if (MODO_DEMO) {
        setMensajes([...mensajes, { id: "nuevo" + mensajes.length, autorId: "yo", tipo: "texto", texto }]);
      } else {
        await apiFetch(RUTAS.chats + "/" + id + "/mensajes", "POST", { tipo: "texto", texto });
        await cargarMensajes();
      }
      setTexto("");
    } catch (err: any) {
      setError(err.message);
    }
  }

  // "aceptar" o "rechazar" una propuesta. Si se acepta, el backend te inscribe en el evento.
  async function responder(mensajeId: string, respuesta: string) {
    setError("");
    try {
      if (MODO_DEMO) {
        const estado = respuesta === "aceptar" ? "aceptada" : "rechazada";
        setMensajes(mensajes.map((m) => (m.id === mensajeId ? { ...m, estadoPropuesta: estado } : m)));
      } else {
        await apiFetch(RUTAS.chats + "/" + id + "/mensajes/" + mensajeId + "/responder", "POST", { respuesta });
        await cargarMensajes();
      }
    } catch (err: any) {
      setError(err.message);
    }
  }

  // Abre la lista de eventos que yo creé, para proponer uno en el chat
  async function abrirMenu() {
    setError("");
    if (mostrarMenu) {
      setMostrarMenu(false);
      return;
    }
    try {
      if (!MODO_DEMO) {
        const datos = await apiFetch(RUTAS.misEventos + "?rol=organizador&estado=publicado");
        setMisEventos(datos);
      }
      setMostrarMenu(true);
    } catch (err: any) {
      setError(err.message);
    }
  }

  async function proponer(eventoId: string) {
    setError("");
    setMostrarMenu(false);
    try {
      await apiFetch(RUTAS.chats + "/" + id + "/mensajes", "POST", { tipo: "propuesta_evento", eventoId });
      await cargarMensajes();
    } catch (err: any) {
      setError(err.message);
    }
  }

  return (
    <div className="app">
      <Sidebar />

      <main className="conversacion-pagina">
        {/* Columna con la lista de chats */}
        <section className="columna-chats">
          <h2>Chats</h2>
          <Link href="/mas/perfil"><img className="icono-perfil" src="/img/perfil-gris.png" alt="Mi perfil" /></Link>

          {chats.map((c) => (
            <Link key={c.id} href={"/chat/" + c.id} className={c.id === id ? "item-chat activo" : "item-chat"}>
              <div className="avatar-chat" style={{ backgroundColor: c.colorAvatar }}></div>
              <div>
                <strong>{c.nombre}</strong>
                <span>{c.deporte}</span>
              </div>
            </Link>
          ))}
        </section>

        {/* Conversación */}
        <section className="conversacion">
          <div className="conversacion-cabecera">
            {actual && (
              <>
                <div className="avatar-chat" style={{ backgroundColor: actual.colorAvatar }}></div>
                <div>
                  <h2>{actual.nombre}{actual.edad ? ", " + actual.edad : ""}</h2>
                  <p>{actual.deporte} · nivel {actual.nivel}</p>
                </div>
              </>
            )}
          </div>

          <div className="mensajes">
            {mensajes.map((m) => {
              // Mensaje de texto normal
              if (m.tipo === "texto") {
                return (
                  <div key={m.id} className={m.autorId === miId ? "burbuja mia" : "burbuja"}>{m.texto}</div>
                );
              }

              // Propuesta de partido
              const ev = eventos[m.eventoId] || {};
              const soyAutor = m.autorId === miId;
              const pendiente = m.estadoPropuesta === "pendiente";

              return (
                <div key={m.id}>
                  <div className="propuesta">
                    <div className="propuesta-foto" style={{ backgroundColor: colores(ev.deporte).cancha }}>
                      <span className="tag">{ev.deporte}</span>
                      <span className="foto">Foto de la cancha</span>
                    </div>
                    <div className="propuesta-info">
                      <h3>{ev.lugar}</h3>
                      <p>{ev.cuando}</p>
                    </div>
                    <div className="propuesta-botones">
                      {/* Solo quien recibe la propuesta puede responderla, y una sola vez */}
                      <button className="no" disabled={soyAutor || !pendiente} onClick={() => responder(m.id, "rechazar")}>
                        No, gracias
                      </button>
                      <button className="si" disabled={soyAutor || !pendiente} onClick={() => responder(m.id, "aceptar")}>
                        ¡Sí quiero!
                      </button>
                    </div>
                  </div>

                  {pendiente && <p className="estado-propuesta">Esperando respuesta</p>}

                  {m.estadoPropuesta === "aceptada" && (
                    <>
                      <div className="respuesta-pill">¡Sí quiero!</div>
                      <p className="cita-confirmada"><i><Check size={12} strokeWidth={3} /></i>Cita confirmada</p>
                    </>
                  )}

                  {m.estadoPropuesta === "rechazada" && (
                    <>
                      <div className="respuesta-pill no">No, gracias</div>
                      <p className="cita-confirmada rechazada">Propuesta rechazada</p>
                    </>
                  )}
                </div>
              );
            })}
          </div>

          {error && <p className="error-chat">{error}</p>}

          <form className="barra-mensaje" onSubmit={enviar}>
            {/* Botón para proponer uno de mis eventos en el chat */}
            {!MODO_DEMO && (
              <button type="button" className="btn-proponer" onClick={abrirMenu} aria-label="Proponer partido">
                <CalendarPlus size={20} strokeWidth={1.75} />
              </button>
            )}

            {mostrarMenu && (
              <div className="menu-proponer">
                <p>Proponer uno de tus eventos</p>
                {misEventos.length === 0 && <p>No tienes eventos publicados. Créalo en Match → Crear evento.</p>}
                {misEventos.map((ev) => (
                  <button key={ev.id} type="button" onClick={() => proponer(ev.id)}>
                    {ev.titulo} · {diaYHora(ev.fechaHora)}
                  </button>
                ))}
              </div>
            )}

            <input placeholder="Escribe un mensaje" value={texto} onChange={(e) => setTexto(e.target.value)} />
            <button className="btn-enviar" type="submit" aria-label="Enviar">
              <ArrowUp size={24} strokeWidth={2} />
            </button>
          </form>
        </section>
      </main>
    </div>
  );
}
