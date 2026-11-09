"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Check } from "lucide-react";
import PanelMarca from "../components/PanelMarca";
import { apiFetch, guardarSesion, MODO_DEMO, RUTAS } from "../lib/api";

const deportes = ["Fútbol 5", "Básquet 3×3", "Tenis", "Pádel", "Vóleibol", "Natación", "Atletismo", "Hockey", "Running"];

export default function RegistroPage() {
  const router = useRouter();
  const [paso, setPaso] = useState(1);

  // Paso 1
  const [usuario, setUsuario] = useState("");
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [acepto, setAcepto] = useState(true);

  // Paso 2
  const [edad, setEdad] = useState("");
  const [favoritos, setFavoritos] = useState<string[]>(["Fútbol 5", "Vóleibol", "Running"]);

  const [error, setError] = useState("");

  function continuar(e: React.FormEvent) {
    e.preventDefault();
    if (!acepto) {
      setError("Debes aceptar los términos y condiciones");
      return;
    }
    setError("");
    setPaso(2);
  }

  // Agrega o quita un deporte de la lista de favoritos
  function cambiarDeporte(deporte: string) {
    if (favoritos.includes(deporte)) {
      setFavoritos(favoritos.filter((d) => d !== deporte));
    } else {
      setFavoritos([...favoritos, deporte]);
    }
  }

  async function crearCuenta(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    // Guardamos el nombre para saludarlo en la siguiente pantalla
    localStorage.setItem("nombre", usuario);

    if (MODO_DEMO) {
      router.push("/registro/creada");
      return;
    }

    try {
      const datos = await apiFetch(RUTAS.registro, "POST", {
        nombreUsuario: usuario,
        correo,
        password: contrasena,
        edad: Number(edad),
        deportesFavoritos: favoritos,
        aceptaTerminos: true,
      });
      guardarSesion(datos); // el backend ya deja la sesión iniciada
      router.push("/registro/creada");
    } catch (err: any) {
      setError(err.message);
    }
  }

  return (
    <main className="auth">
      <PanelMarca />

      <section className="auth-lado">
        {paso === 1 && (
          <form className="auth-form" onSubmit={continuar}>
            <h1 className="auth-titulo">Crea tu cuenta</h1>

            <div className="pasos">
              <div className="paso-punto activo"></div>
              <div className="paso-linea"></div>
              <div className="paso-punto"></div>
              <span>Paso 1 de 2 · Datos de acceso</span>
            </div>

            <label className="auth-label">Nombre de usuario</label>
            <input className="auth-input" placeholder="Ej: carlos_torres"
              value={usuario} onChange={(e) => setUsuario(e.target.value)} required />

            <label className="auth-label">Correo</label>
            <input className="auth-input" type="email" placeholder="miemail@ejemplo.com"
              value={correo} onChange={(e) => setCorreo(e.target.value)} required />

            <label className="auth-label">Contraseña</label>
            <input className="auth-input" type="password" placeholder="Mínimo 8 caracteres" minLength={8}
              value={contrasena} onChange={(e) => setContrasena(e.target.value)} required />

            <div className="check-fila" onClick={() => setAcepto(!acepto)}>
              <div className={acepto ? "check-caja marcado" : "check-caja"}>
                {acepto && <Check size={16} strokeWidth={3} />}
              </div>
              Acepto los términos y condiciones
            </div>

            {error && <p className="auth-error">{error}</p>}

            <button className="btn-negro" type="submit">Continuar</button>

            <p className="auth-pie">
              ¿Ya tienes cuenta?<br />
              <Link href="/login">Inicia sesión aquí</Link>
            </p>
          </form>
        )}

        {paso === 2 && (
          <form className="auth-form" onSubmit={crearCuenta}>
            <h1 className="auth-titulo">Cuéntanos de ti</h1>

            <div className="pasos">
              <div className="paso-punto activo"></div>
              <div className="paso-linea activo"></div>
              <div className="paso-punto activo"></div>
              <span>Paso 2 de 2 · Cuéntanos de ti</span>
            </div>

            <label className="auth-label">Edad</label>
            <input className="auth-input" style={{ width: 180 }} type="number" placeholder="Ej: 23"
              min={14} max={99} value={edad} onChange={(e) => setEdad(e.target.value)} required />

            <p className="auth-subtitulo">Selecciona tus deportes favoritos</p>
            <div className="chips-claros">
              {deportes.map((d) => (
                <button key={d} type="button" onClick={() => cambiarDeporte(d)}
                  className={favoritos.includes(d) ? "chip-claro activo" : "chip-claro"}>
                  {d}
                </button>
              ))}
            </div>

            {error && <p className="auth-error">{error}</p>}

            <button className="btn-naranja-auth" style={{ marginTop: 34 }} type="submit">Crear cuenta</button>
          </form>
        )}
      </section>
    </main>
  );
}
