import Link from "next/link";

// Las dos pestañas de la sección Match
export default function Pestanas({ activa }: { activa: string }) {
  return (
    <div className="pestanas">
      <Link href="/match" className={activa === "solicitudes" ? "pestana ancha activo" : "pestana ancha"}>
        Solicitudes
      </Link>
      <Link href="/match/eventos" className={activa === "eventos" ? "pestana angosta activo" : "pestana angosta"}>
        Eventos
      </Link>
    </div>
  );
}
