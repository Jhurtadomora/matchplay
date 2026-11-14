"use client";

import { useEffect, useState } from "react";
import { Camera } from "lucide-react";
import Sidebar from "../../components/Sidebar";
import Encabezado from "../../components/Encabezado";
import { apiFetch, MODO_DEMO, RUTAS } from "../../lib/api";
import { miPerfil } from "../../lib/datos";

export default function EditarPerfilPage() {
  const [nombreCompleto, setNombreCompleto] = useState("");
  const [usuario, setUsuario] = useState("");
  const [edad, setEdad] = useState("");
  const [ciudad, setCiudad] = useState("");
  const [sobreMi, setSobreMi] = useState("");
  const [foto, setFoto] = useState("");
  const [aviso, setAviso] = useState("");
  const [error, setError] = useState("");

  // Llena el formulario con los datos actuales (GET /me)
  function llenar(p: any) {
    setNombreCompleto(p.nombreCompleto || "");
    setUsuario(p.nombreUsuario || "");
    setEdad(p.edad ? String(p.edad) : "");
    setCiudad(p.ciudad || "");
    setSobreMi(p.sobreMi || "");
    setFoto(p.fotoUrl || "");
  }

  useEffect(() => {
    setAviso("");
    if (MODO_DEMO) {
      llenar(miPerfil);
      return;
    }
    apiFetch(RUTAS.yo).then(llenar).catch((err) => setError(err.message));
  }, []);

  // El backend guarda la foto como un enlace (URL)
  function cambiarFoto() {
    const url = prompt("Pega el enlace (URL) de tu foto de perfil", foto);
    if (url !== null) setFoto(url);
  }

  async function guardar(e: React.FormEvent) {
    e.preventDefault();
    setAviso("");
    setError("");
    try {
      if (!MODO_DEMO) {
        const actualizado = await apiFetch(RUTAS.yo, "PATCH", {
          nombreCompleto,
          nombreUsuario: usuario,
          edad: Number(edad),
          ciudad,
          sobreMi,
          ...(foto ? { fotoUrl: foto } : {}),
        });
        // El menú de la izquierda muestra el nombre de usuario
        localStorage.setItem("nombre", actualizado.nombreUsuario);
      }
      setAviso("Cambios guardados");
    } catch (err: any) {
      setError(err.message);
    }
  }

  return (
    <div className="app">
      <Sidebar />

      <main className="contenido pagina-v2">
        <Encabezado titulo="Editar perfil" />

        <form className="tarjeta-form alta" onSubmit={guardar}>
          <div className="foto-perfil">
            <div className="circulo">{foto && <img src={foto} alt="" />}</div>
            <button type="button" className="camara" onClick={cambiarFoto} aria-label="Cambiar foto">
              <Camera size={14} strokeWidth={2.25} />
            </button>
          </div>
          <button type="button" className="cambiar-foto" onClick={cambiarFoto}>Cambiar foto</button>

          <label className="etiqueta-v2" style={{ marginTop: 20 }}>Nombre completo</label>
          <input className="input-v2" value={nombreCompleto} onChange={(e) => setNombreCompleto(e.target.value)} />

          <label className="etiqueta-v2">Nombre de usuario</label>
          <input className="input-v2" value={usuario} onChange={(e) => setUsuario(e.target.value)} required />

          <div className="dos-columnas-v2">
            <div>
              <label className="etiqueta-v2">Edad</label>
              <input className="input-v2" type="number" min={13} max={99}
                value={edad} onChange={(e) => setEdad(e.target.value)} required />
            </div>
            <div>
              <label className="etiqueta-v2">Ciudad</label>
              <input className="input-v2" value={ciudad} onChange={(e) => setCiudad(e.target.value)} />
            </div>
          </div>

          <label className="etiqueta-v2">Sobre mí</label>
          <textarea className="input-v2" value={sobreMi} onChange={(e) => setSobreMi(e.target.value)} />

          <button className="btn-v2" type="submit" style={{ marginTop: 26 }}>Guardar cambios</button>

          {aviso && <p className="aviso-ok">{aviso}</p>}
          {error && <p className="aviso-error">{error}</p>}
        </form>
      </main>
    </div>
  );
}
