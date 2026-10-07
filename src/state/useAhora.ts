import { useEffect, useState } from 'react';

const INTERVALO_MS = 30 * 1000;

// Devuelve la hora actual y la refresca periódicamente para que las clases
// que empiezan con la app abierta desaparezcan de las listas.
export function useAhora(): Date {
  const [ahora, setAhora] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setAhora(new Date()), INTERVALO_MS);
    return () => clearInterval(id);
  }, []);
  return ahora;
}
