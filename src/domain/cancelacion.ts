import { validarCancelacion } from './reglas';
import type { Clase, Reserva } from './types';

export type SolicitudCancelacion = { ok: true; accion: 'pedirConfirmacion' } | { ok: false; mensaje: string };

export type ConfirmacionCancelacion = { ok: true; reservas: Reserva[] } | { ok: false; mensaje: string };

// Al pulsar cancelar: RN-04 se valida antes de pedir confirmación.
export function solicitarCancelacion(clase: Clase, now: Date): SolicitudCancelacion {
  const resultado = validarCancelacion(clase, now);
  return resultado.ok ? { ok: true, accion: 'pedirConfirmacion' } : resultado;
}

// Al confirmar: RN-04 se revalida con un `now` nuevo. Si falla, las reservas no cambian.
export function confirmarCancelacion(
  claseId: string,
  clases: Clase[],
  reservas: Reserva[],
  now: Date,
): ConfirmacionCancelacion {
  const clase = clases.find((c) => c.id === claseId);
  if (!clase) {
    throw new Error(`Clase desconocida: ${claseId}`);
  }
  const resultado = validarCancelacion(clase, now);
  if (!resultado.ok) {
    return resultado;
  }
  return { ok: true, reservas: reservas.filter((r) => r.claseId !== claseId) };
}
