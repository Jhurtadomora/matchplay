// Aplica el tema guardado: "oscuro", "claro" o "automatico" (sigue al sistema)
export function aplicarTema(tema: string) {
  let final = tema;
  if (tema === "automatico") {
    const sistemaOscuro = window.matchMedia("(prefers-color-scheme: dark)").matches;
    final = sistemaOscuro ? "oscuro" : "claro";
  }
  // En globals.css, html[data-tema="claro"] cambia los colores de la app
  document.documentElement.dataset.tema = final;
}
