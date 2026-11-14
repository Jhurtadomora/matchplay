"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";

// Botón de volver + título + subtítulo.
// El Figma usa dos estilos: "a" (Editar perfil, Idioma, Tema...) y "b" (Notificaciones, Horario guardado)
export default function Encabezado({ titulo, subtitulo, estilo = "a" }: { titulo: string; subtitulo?: string; estilo?: string }) {
  const router = useRouter();

  return (
    <div className={"encabezado-" + estilo}>
      <button className="btn-volver" onClick={() => router.push("/mas")} aria-label="Volver">
        <ChevronLeft size={estilo === "a" ? 22 : 24} />
      </button>
      <div>
        <h1>{titulo}</h1>
        {subtitulo && <p>{subtitulo}</p>}
      </div>
    </div>
  );
}
