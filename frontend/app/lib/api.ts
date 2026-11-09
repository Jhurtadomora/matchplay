// ===== Conexión con el backend de Nest JS (MongoDB) =====

// Dirección del backend. El prefijo /api lo pone main.ts del backend.
// Se puede cambiar creando un archivo .env.local con NEXT_PUBLIC_API_URL=...
export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

// true = la página usa los datos de ejemplo de lib/datos.ts (sin backend).
// false = todo se pide al backend real. Para volver al demo: NEXT_PUBLIC_MODO_DEMO=true en .env.local
export const MODO_DEMO = process.env.NEXT_PUBLIC_MODO_DEMO === "true";

// Rutas reales del backend (ver matchplay-insomnia-FINAL.json)
export const RUTAS = {
  login: "/auth/login",
  registro: "/auth/registro",
  jugadores: "/perfiles/feed",
  like: "/perfiles/",        // + id + "/like"
  pass: "/perfiles/",        // + id + "/pass"
  jugador: "/perfiles/",     // + id
  solicitudes: "/eventos?tipo=personal",
  eventos: "/eventos",
  eventosComunidad: "/eventos?tipo=comunidad",
  evento: "/eventos/",       // + id (+ "/join", "/publicar")
};

// Función para hablar con el backend sin repetir código en cada página
export async function apiFetch(ruta: string, metodo: string = "GET", cuerpo?: unknown) {
  const token = localStorage.getItem("token");

  const respuesta = await fetch(API_URL + ruta, {
    method: metodo,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: "Bearer " + token } : {}),
    },
    body: cuerpo ? JSON.stringify(cuerpo) : undefined,
  });

  const datos = await respuesta.json().catch(() => null);

  if (!respuesta.ok) {
    // Sesión vencida o sin iniciar: volvemos al login (menos en el propio login/registro)
    if (respuesta.status === 401 && !ruta.startsWith("/auth/")) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    // El backend responde { error: { codigo, mensaje } } y, en validaciones, mensaje puede ser lista
    const mensaje = datos?.error?.mensaje ?? datos?.message;
    throw new Error(Array.isArray(mensaje) ? mensaje.join(", ") : mensaje || "Error " + respuesta.status);
  }

  return datos;
}

// Guarda la sesión que devuelven /auth/login y /auth/registro
export function guardarSesion(datos: { token: string; usuario: { id: string; nombreUsuario: string } }) {
  localStorage.setItem("token", datos.token);
  localStorage.setItem("usuarioId", datos.usuario.id);
  localStorage.setItem("nombre", datos.usuario.nombreUsuario);
}
