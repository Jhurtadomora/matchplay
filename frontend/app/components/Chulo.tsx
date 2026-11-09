// El chulo (check) de las pantallas de éxito

export default function Chulo({ color, tamano }: { color: string; tamano: number }) {
  return (
    <svg width={tamano} height={tamano} viewBox="0 0 24 24" fill="none">
      <polyline points="4,12.5 9.5,18 20,6" stroke={color} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
