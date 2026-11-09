import { redirect } from "next/navigation";

// La página principal manda directo al login
export default function Home() {
  redirect("/login");
}
