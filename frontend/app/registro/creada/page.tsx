"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PanelMarca from "../../components/PanelMarca";
import Chulo from "../../components/Chulo";

export default function CuentaCreadaPage() {
  const router = useRouter();
  const [nombre, setNombre] = useState("Camilo");

  // Leemos el nombre que se guardó en el registro
  useEffect(() => {
    const guardado = localStorage.getItem("nombre");
    if (guardado) setNombre(guardado);
  }, []);

  return (
    <main className="auth">
      <PanelMarca />

      <section className="auth-lado">
        <div className="auth-form creada">
          <div className="creada-circulo">
            <Chulo color="#e2582c" tamano={64} />
          </div>
          <h1>¡Cuenta creada!</h1>
          <h2>Bienvenido a MatchPlay, {nombre}</h2>
          <p>Ya puedes empezar a buscar partidos cerca de ti</p>
          <button className="btn-naranja-auth" style={{ height: 52 }} onClick={() => router.push("/inicio")}>
            Comenzar
          </button>
        </div>
      </section>
    </main>
  );
}
