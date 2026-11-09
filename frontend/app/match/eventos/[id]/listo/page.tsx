import { Suspense } from "react";
import CupoConfirmado from "./CupoConfirmado";

// El id de la URL solo se conoce al abrir la página, por eso va dentro de Suspense
export default function Page() {
  return (
    <Suspense>
      <CupoConfirmado />
    </Suspense>
  );
}
