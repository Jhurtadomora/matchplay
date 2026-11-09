
export function aEntidad<T>(doc: unknown): T {
  const { _id, __v, par, ...resto } = doc as Record<string, unknown>;
  return { id: _id, ...resto } as T;
}

export function aEntidades<T>(docs: unknown[]): T[] {
  return docs.map((doc) => aEntidad<T>(doc));
}


export function claveDePar(usuarioIdA: string, usuarioIdB: string): string {
  return [usuarioIdA, usuarioIdB].sort().join('|');
}

export function esErrorDeDuplicado(error: unknown): boolean {
  return (error as { code?: number })?.code === 11000;
}
