"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import PanelMarca from "../components/PanelMarca";
import { apiFetch, MODO_DEMO, RUTAS } from "../lib/api";

export default function RecuperarPage() {
  const router = useRouter();
  const [usuario, setUsuario] = useState("");
  const [correo, setCorreo] = useState("");
  const [enviado, setEnviado] = useState(false); // false = formulario, true = "¡Revisa tu correo!"
  const [error, setError] = useState("");

  async function enviar() {
    setError("");
    try {
      if (!MODO_DEMO) {
        // El backend pide el correo y el nombre de usuario de la cuenta
        await apiFetch(RUTAS.recuperar, "POST", { correo, nombreUsuario: usuario });
      }
      setEnviado(true);
    } catch (err: any) {
      setError(err.message);
    }
  }

  function enviarFormulario(e: React.FormEvent) {
    e.preventDefault();
    enviar();
  }

  return (
    <main className="auth">
      <PanelMarca />

      <section className="auth-lado">
        {!enviado && (
          <form className="auth-form recuperar" onSubmit={enviarFormulario}>
            <button type="button" className="btn-volver-claro" onClick={() => router.push("/login")} aria-label="Volver">
              <ChevronLeft size={24} strokeWidth={1.75} />
            </button>

            <h1 className="auth-titulo">Recupera tu contraseña</h1>
            <p className="auth-sub">Ingresa tus datos y te enviaremos instrucciones</p>

            <label className="auth-label">Nombre de usuario</label>
            <input className="auth-input" placeholder="Ej: camilo_torres"
              value={usuario} onChange={(e) => setUsuario(e.target.value)} required />

            <label className="auth-label">Correo</label>
            <input className="auth-input" type="email" placeholder="tucorreo@ejemplo.com"
              value={correo} onChange={(e) => setCorreo(e.target.value)} required />

            {error && <p className="auth-error">{error}</p>}

            <button className="btn-negro" type="submit">Enviar instrucciones</button>

            <p className="auth-pie">
              <Link href="/login">Volver a iniciar sesión</Link>
            </p>
          </form>
        )}

        {enviado && (
          <>
            <button className="btn-volver-claro enviado-volver" onClick={() => setEnviado(false)} aria-label="Volver">
              <ChevronLeft size={26} strokeWidth={1.75} />
            </button>

            <div className="auth-form enviado">
              <img src="/img/correo-enviado.png" alt="" />
              <h1>¡Revisa tu correo!</h1>
              <p>Enviamos las instrucciones para restablecer<br />tu contraseña a</p>
              <strong>{correo}</strong>
              <p className="spam">Si no lo encuentras, revisa la carpeta de spam</p>

              <button className="btn-negro" onClick={() => router.push("/login")}>Volver a iniciar sesión</button>

              <p className="auth-pie">
                ¿No recibiste el correo?
                <button onClick={enviar}>Reenviar</button>
              </p>
              {error && <p className="auth-error">{error}</p>}
            </div>
          </>
        )}
      </section>
    </main>
  );
}
