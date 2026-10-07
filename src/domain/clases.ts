import { inicioClase, yaEmpezo } from './fechas';
import type { Clase, Reserva } from './types';

export function estaReservada(claseId: string, reservas: Reserva[]): boolean {
  return reservas.some((r) => r.claseId === claseId);
}

export function cuposDisponibles(clase: Clase, reservas: Reserva[]): number {
  return clase.cupoTotal - clase.ocupados - (estaReservada(clase.id, reservas) ? 1 : 0);
}

function noEmpezadasOrdenadas(clases: Clase[], now: Date): Clase[] {
  return clases
    .filter((c) => !yaEmpezo(c, now))
    .sort((a, b) => inicioClase(a, now).getTime() - inicioClase(b, now).getTime());
}

export function proximasClases(clases: Clase[], reservas: Reserva[], now: Date): Clase[] {
  return noEmpezadasOrdenadas(clases, now);
}

export function misReservas(clases: Clase[], reservas: Reserva[], now: Date): Clase[] {
  return noEmpezadasOrdenadas(
    clases.filter((c) => estaReservada(c.id, reservas)),
    now,
  );
}
