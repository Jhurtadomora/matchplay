// Panel oscuro de la izquierda que se repite en login y registro

export default function PanelMarca() {
  return (
    <section className="marca">
      <img className="marca-logo" src="/img/logo.png" alt="MatchPlay" />
      <h1 className="marca-titulo">MATCHPLAY</h1>
      <p className="marca-texto">Encuentra tu próximo partido, cuando quieras, con quien quieras.</p>
      <img className="marca-decoracion" src="/img/decoracion.png" alt="" />
      <p className="marca-copy">© 2026 MatchPlay</p>
    </section>
  );
}
