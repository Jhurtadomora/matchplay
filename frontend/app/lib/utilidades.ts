// Clase de la insignia de cupos según qué tan lleno está el evento
export function claseCupos(inscritos: number, cupo: number) {
  const porcentaje = inscritos / cupo;
  if (porcentaje >= 0.9) return "cupos cupos-lleno";
  if (porcentaje >= 0.8) return "cupos cupos-medio";
  return "cupos";
}

// "2026-08-09" -> "Sáb 9 ago"
export function formatearFecha(fecha: string) {
  const dias = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
  const meses = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
  const d = new Date(fecha + "T00:00");
  return dias[d.getDay()] + " " + d.getDate() + " " + meses[d.getMonth()];
}

// "19:00" -> "7:00 PM"
export function formatearHora(hora: string) {
  let [h, m] = hora.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  h = h % 12;
  if (h === 0) h = 12;
  return h + ":" + String(m).padStart(2, "0") + " " + ampm;
}

// "2026-08-09T19:00:00.000Z" -> "Sáb 9 ago" (hora local del navegador)
export function fechaDeIso(iso: string) {
  const dias = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
  const meses = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
  const d = new Date(iso);
  return dias[d.getDay()] + " " + d.getDate() + " " + meses[d.getMonth()];
}

// "2026-08-09T19:00:00.000Z" -> "7:00 PM" (hora local del navegador)
export function horaDeIso(iso: string) {
  const d = new Date(iso);
  return formatearHora(String(d.getHours()).padStart(2, "0") + ":" + String(d.getMinutes()).padStart(2, "0"));
}

// "Básquet 3×3" -> "basquet 3×3" (minúsculas y sin tildes, para comparar textos)
export function normalizar(texto: string) {
  return texto.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
}

// ¿Son el mismo deporte? Compara las 3 primeras letras: "Fútbol" = "Fútbol 5", "Básquet" = "Baloncesto"
export function mismoDeporte(a: string, b: string) {
  let x = normalizar(a).slice(0, 3);
  let y = normalizar(b).slice(0, 3);
  if (x === "bal") x = "bas";
  if (y === "bal") y = "bas";
  return x === y;
}

// "2026-08-09T21:00:00.000Z" -> "Domingo, 4:00 pm" (como en la propuesta del chat)
export function diaYHora(iso: string) {
  const dias = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
  const d = new Date(iso);
  return dias[d.getDay()] + ", " + horaDeIso(iso).toLowerCase();
}
