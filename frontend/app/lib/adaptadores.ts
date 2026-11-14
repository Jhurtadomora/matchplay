// Convierte lo que responde el backend a la forma que usan las pantallas.
import { fechaDeIso, horaDeIso } from "./utilidades";

// El backend no guarda fotos todavía: se pinta un color según el deporte (los mismos del Figma)
// avatar = círculo del jugador en Chat · cancha = parte de arriba de la propuesta de partido
const COLORES = [
  { clave: "fút", foto: "#1e3a2e", tarjeta: "#3a2c26", inicio: "#3e5b3a", info: "#16241a", avatar: "#6b3a34", cancha: "#3a2420" },
  { clave: "bás", foto: "#3a4a52", tarjeta: "#26333a", inicio: "#3a4a52", info: "#1a2226", avatar: "#45586b", cancha: "#20242e" },
  { clave: "bal", foto: "#3a4a52", tarjeta: "#26333a", inicio: "#3a4a52", info: "#1a2226", avatar: "#45586b", cancha: "#20242e" },
  { clave: "ten", foto: "#7a4525", tarjeta: "#2c3a2c", inicio: "#7a4525", info: "#2a1a10", avatar: "#3e5c66", cancha: "#233238" },
  { clave: "pád", foto: "#17587a", tarjeta: "#263a3a", inicio: "#17587a", info: "#0e2633", avatar: "#2f5a6e", cancha: "#1c2c35" },
  { clave: "vol", foto: "#3a2c52", tarjeta: "#3a2c3a", inicio: "#3a2c52", info: "#1c1626", avatar: "#55456e", cancha: "#2a2436" },
  { clave: "vól", foto: "#3a2c52", tarjeta: "#3a2c3a", inicio: "#3a2c52", info: "#1c1626", avatar: "#55456e", cancha: "#2a2436" },
  { clave: "nat", foto: "#1f4a5e", tarjeta: "#263a3a", inicio: "#1f4a5e", info: "#0f2430", avatar: "#2f5a6e", cancha: "#1c2c35" },
  { clave: "cic", foto: "#6b7580", tarjeta: "#3a3a26", inicio: "#6b7580", info: "#262a2e", avatar: "#5a5f66", cancha: "#2a2c30" },
];
const POR_DEFECTO = { foto: "#2a2a2e", tarjeta: "#2a2a2e", inicio: "#3a3a3e", info: "#1e1e20", avatar: "#3a3a3e", cancha: "#26262a" };

export function colores(deporte?: string) {
  const d = (deporte || "").toLowerCase();
  return COLORES.find((c) => d.startsWith(c.clave)) || POR_DEFECTO;
}

// Ícono de cada deporte (recortados del Figma, pantalla Explorar)
export function iconoDeporte(deporte: string) {
  const d = deporte.toLowerCase();
  if (d.startsWith("fútbol 11")) return "/img/deportes/futbol11.png";
  if (d.startsWith("fút")) return "/img/deportes/futbol5.png";
  if (d.startsWith("bás") || d.startsWith("bal")) return "/img/deportes/baloncesto.png";
  if (d.startsWith("pád")) return "/img/deportes/padel.png";
  if (d.startsWith("ten")) return "/img/deportes/tenis.png";
  if (d.startsWith("vol") || d.startsWith("vól")) return "/img/deportes/voleibol.png";
  if (d.startsWith("nat")) return "/img/deportes/natacion.png";
  if (d.startsWith("cic")) return "/img/deportes/ciclismo.png";
  return "/img/deportes/futbol5.png";
}

// Perfil público (/perfiles/feed, /perfiles/:id) o creador de un evento
export function perfilAUi(p: any, evento?: any) {
  const c = colores(p.deporte);
  return {
    id: p.id,
    nombre: p.nombre,
    edad: p.edad,
    deporte: p.deporte || "Sin deporte",
    nivel: String(p.nivel || "").toLowerCase(),
    lugar: evento?.lugar ?? "Por acordar",
    horario: evento ? fechaDeIso(evento.fechaHora) + " · " + horaDeIso(evento.fechaHora) : "Por acordar",
    descripcion: evento?.descripcion || "Este jugador aún no ha escrito una descripción.",
    colorFoto: c.foto, colorTarjeta: c.tarjeta, colorInicio: c.inicio, colorInfo: c.info,
  };
}

// Evento del backend -> tarjeta de evento
export function eventoAUi(e: any) {
  return {
    id: e.id,
    titulo: e.titulo,
    deporte: e.deporte,
    fecha: fechaDeIso(e.fechaHora),
    hora: horaDeIso(e.fechaHora),
    lugar: e.lugar,
    inscritos: e.cuposOcupados ?? 0,
    cupo: e.cupoMaximo,
    nivel: e.nivelRequerido,
    descripcion: e.descripcion,
    creador: e.creador,
  };
}

// Resumen de chat (GET /chats) -> fila de la lista de chats
export function chatAUi(c: any) {
  const p = c.perfil || {};
  return {
    id: c.id,
    perfilId: p.id,
    nombre: p.nombre || "Jugador",
    edad: p.edad,
    deporte: p.deporte || "Sin deporte",
    nivel: String(p.nivel || "").toLowerCase(),
    ultimoMensaje: c.ultimoMensaje || "Aún no hay mensajes",
    noLeidos: c.noLeidos || 0,
    colorAvatar: colores(p.deporte).avatar,
  };
}
