"use client";

import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import Sidebar from "../../components/Sidebar";
import Encabezado from "../../components/Encabezado";
import { apiFetch, MODO_DEMO, RUTAS } from "../../lib/api";
import { miHorario } from "../../lib/datos";

// El backend guarda el nombre completo del día; en pantalla se muestra la inicial
const dias = [
  { letra: "L", nombre: "Lunes" },
  { letra: "M", nombre: "Martes" },
  { letra: "M", nombre: "Miércoles" },
  { letra: "J", nombre: "Jueves" },
  { letra: "V", nombre: "Viernes" },
  { letra: "S", nombre: "Sábado" },
  { letra: "D", nombre: "Domingo" },
];
const franjas = ["Mañana", "Tarde", "Noche"];

export default function HorarioPage() {
  const [elegidos, setElegidos] = useState<string[]>([]);
  const [franja, setFranja] = useState("");
  const [notas, setNotas] = useState("");
  const [guardado, setGuardado] = useState(false); // true = se muestra la vista "Cambios guardados" del Figma
  const [error, setError] = useState("");

  function llenar(h: any) {
    setElegidos(h.dias || []);
    setFranja(h.franjaHoraria || "");
    setNotas(h.notas || "");
  }

  useEffect(() => {
    setGuardado(false);
    if (MODO_DEMO) {
      llenar(miHorario);
      return;
    }
    apiFetch(RUTAS.yo + "/horario-disponible").then(llenar).catch((err) => setError(err.message));
  }, []);

  // Agrega o quita un día de la lista
  function cambiarDia(dia: string) {
    if (elegidos.includes(dia)) {
      setElegidos(elegidos.filter((d) => d !== dia));
    } else {
      setElegidos([...elegidos, dia]);
    }
  }

  async function guardar() {
    setError("");
    try {
      if (!MODO_DEMO) {
        const respuesta = await apiFetch(RUTAS.yo + "/horario-disponible", "PUT", {
          dias: elegidos,
          ...(franja ? { franjaHoraria: franja } : {}),
          notas,
        });
        llenar(respuesta);
      }
      setGuardado(true);
    } catch (err: any) {
      setError(err.message);
    }
  }

  // Primera vista del Figma ("Horario disponible web")
  if (!guardado) {
    return (
      <div className="app">
        <Sidebar />

        <main className="contenido pagina-v2">
          <Encabezado titulo="Horario disponible" subtitulo="Indica cuándo sueles estar disponible para jugar" />

          <div className="tarjeta-form horario">
            <p className="etiqueta-v2">Días de la semana</p>
            <div className="dias">
              {dias.map((d) => (
                <button key={d.nombre} className={elegidos.includes(d.nombre) ? "dia activo" : "dia"}
                  onClick={() => cambiarDia(d.nombre)} aria-label={d.nombre}>
                  {d.letra}
                </button>
              ))}
            </div>

            <p className="etiqueta-v2">Franja horaria preferida</p>
            <div className="franjas">
              {franjas.map((f) => (
                <button key={f} className={franja === f ? "franja activo" : "franja"} onClick={() => setFranja(f)}>{f}</button>
              ))}
            </div>

            <p className="etiqueta-v2">Notas adicionales</p>
            <textarea className="input-v2" value={notas} onChange={(e) => setNotas(e.target.value)}
              placeholder={"Ej: solo disponible después de las 6pm entre semana,\nfines de semana todo el día."} />
          </div>

          <div className="horario-guardar">
            <button className="btn-v2" onClick={guardar}>Guardar cambios</button>
            {error && <p className="aviso-error">{error}</p>}
          </div>
        </main>
      </div>
    );
  }

  // Segunda vista del Figma ("Confirmación horario"): mismo formulario con el aviso de guardado
  return (
    <div className="app">
      <Sidebar />

      <main className="contenido horario-b">
        <Encabezado titulo="Horario disponible" subtitulo="Indica cuándo sueles estar disponible para jugar" estilo="b" />

        <div className="tarjeta-centrada">
          <h3>Días de la semana</h3>
          <div className="dias">
            {dias.map((d) => (
              <button key={d.nombre} className={elegidos.includes(d.nombre) ? "dia activo" : "dia"}
                onClick={() => cambiarDia(d.nombre)} aria-label={d.nombre}>
                {d.letra}
              </button>
            ))}
          </div>

          <h3>Franja horaria preferida</h3>
          <div className="franjas">
            {franjas.map((f) => (
              <button key={f} className={franja === f ? "franja activo" : "franja"} onClick={() => setFranja(f)}>{f}</button>
            ))}
          </div>

          <h3>Notas adicionales</h3>
          <textarea value={notas} onChange={(e) => setNotas(e.target.value)}
            placeholder={"Ej: solo disponible después de las 6pm entre semana,\nfines de semana todo el día."} />

          <button className="btn-naranja" onClick={guardar}>Guardar cambios</button>
        </div>

        {error && <p className="aviso-error">{error}</p>}

        <div className="toast-ok">
          <i><Check size={20} strokeWidth={2.5} /></i>
          <div>
            <strong>Cambios guardados</strong>
            <span>Tu horario disponible se actualizó</span>
          </div>
        </div>
      </main>
    </div>
  );
}
