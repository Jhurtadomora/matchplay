"use client";

import Sidebar from "../../components/Sidebar";
import Encabezado from "../../components/Encabezado";

// Texto fijo: no viene del backend
const terminos = [
  { titulo: "Aceptación de los términos", texto: "Al usar MatchPlay aceptas estas condiciones y las políticas de uso de la plataforma." },
  { titulo: "Uso de la plataforma", texto: "MatchPlay conecta personas para organizar partidas deportivas. No garantizamos la asistencia de otros usuarios al evento." },
  { titulo: "Conducta del usuario", texto: "Debes tratar a los demás con respeto. Está prohibido el acoso o la discriminación en cualquier encuentro o interacción." },
  { titulo: "Seguridad en encuentros deportivos", texto: "Recomendamos reunirse en lugares públicos y verificar la identidad de otros jugadores antes de asistir a una partida." },
  { titulo: "Privacidad", texto: "El manejo de tus datos personales se rige por nuestra Política de Privacidad." },
  { titulo: "Modificaciones", texto: "Podemos actualizar estos términos. Te notificaremos ante cualquier cambio relevante." },
];

export default function TerminosPage() {
  return (
    <div className="app">
      <Sidebar />

      <main className="contenido pagina-v2">
        <Encabezado titulo="Términos y condiciones" subtitulo="Última actualización: 1 de agosto de 2026" />

        <div className="tarjeta-form terminos">
          {terminos.map((t, i) => (
            <div key={t.titulo} className="termino">
              {/* Íconos recortados del Figma: /img/terminos/1.png ... 6.png */}
              <img src={"/img/terminos/" + (i + 1) + ".png"} alt="" />
              <div>
                <h3>{t.titulo}</h3>
                <p>{t.texto}</p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
