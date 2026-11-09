// Convierte lo que responde el backend a la forma que usan las pantallas.
import { fechaDeIso, horaDeIso } from "./utilidades";

// El backend no guarda fotos todavía: se pinta un color según el deporte (los mismos del Figma)
const COLORES: { clave: string; foto: string; tarjeta: string; inicio: string; info: string }[] = [
  { clave: "fút", foto: "#1e3a2e", tarjeta: "#3a2c26", inicio: "#3e5b3a", info: "#16241a" },
  { clave: "bás", foto: "#3a4a52", tarjeta: "#26333a", inicio: "#3a4a52", info: "#1a2226" },
  { clave: "ten", foto: "#7a4525", tarjeta: "#2c3a2c", inicio: "#7a4525", info: "#2a1a10" },
  { clave: "pád", foto: "#17587a", tarjeta: "#263a3a", inicio: "#17587a", info: "#0e2633" },
  { clave: "vol", foto: "#3a2c52", tarjeta: "#3a2c3a", inicio: "#3a2c52", info: "#1c1626" },
  { clave: "vól", foto: "#3a2c52", tarjeta: "#3a2c3a", inicio: "#3a2c52", info: "#1c1626" },
  { clave: "cic", foto: "#6b7580", tarjeta: "#3a3a26", inicio: "#6b7580", info: "#262a2e" },
];
const POR_DEFECTO = { foto: "#2a2a2e", tarjeta: "#2a2a2e", inicio: "#3a3a3e", info: "#1e1e20" };

function colores(deporte?: string) {
  const d = (deporte || "").toLowerCase();
  return COLORES.find((c) => d.startsWith(c.clave)) || POR_DEFECTO;
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
