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
