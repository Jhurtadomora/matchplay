"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import PanelMarca from "../components/PanelMarca";
import { apiFetch, guardarSesion, MODO_DEMO, RUTAS } from "../lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [error, setError] = useState("");

  async function iniciarSesion(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (MODO_DEMO) {
      router.push("/inicio");
      return;
    }

    try {
      const datos = await apiFetch(RUTAS.login, "POST", { correo, password: contrasena });
      guardarSesion(datos);
      setContrasena("");
      router.push("/inicio");
    } catch (err: any) {
      setError(err.message);
    }
  }

  return (
    <main className="auth">
      <PanelMarca />

      <section className="auth-lado">
        <form className="auth-form abajo" onSubmit={iniciarSesion}>
          <h1 className="auth-titulo">Bienvenido de nuevo</h1>
          <p className="auth-sub">Inicia sesión para seguir armando partidos</p>

          <label className="auth-label" style={{ marginTop: 32 }}>Correo</label>
          <input className="auth-input" type="email" placeholder="tucorreo@ejemplo.com"
            value={correo} onChange={(e) => setCorreo(e.target.value)} required />

          <label className="auth-label">Contraseña</label>
          <input className="auth-input" type="password" placeholder="••••••••"
            value={contrasena} onChange={(e) => setContrasena(e.target.value)} required />

          <Link className="auth-olvido" href="/recuperar">¿Olvidaste tu contraseña?</Link>

          {error && <p className="auth-error">{error}</p>}

          <button className="btn-negro" type="submit">Iniciar sesión</button>

          <p className="auth-pie">
            ¿No tienes cuenta aún?<br />
            <Link href="/registro">Regístrate aquí</Link>
          </p>
        </form>
      </section>
    </main>
  );
}
