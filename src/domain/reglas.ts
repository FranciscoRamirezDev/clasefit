import { cuposDisponibles, estaReservada } from './clases';
import { claveDia, inicioClase } from './fechas';
import { MENSAJES } from './mensajes';
import type { Clase, Reserva, ResultadoValidacion } from './types';

const OK: ResultadoValidacion = { ok: true };
const MAX_RESERVAS_POR_DIA = 2;
const MIN_ANTICIPACION_CANCELACION_MS = 120 * 60 * 1000;

function falla(mensaje: string): ResultadoValidacion {
  return { ok: false, mensaje };
}

// RN-01: no se puede reservar una clase sin cupos.
export function validarCupos(clase: Clase, reservas: Reserva[]): ResultadoValidacion {
  return cuposDisponibles(clase, reservas) > 0 ? OK : falla(MENSAJES.sinCupos);
}

// RN-02: no se puede reservar la misma clase dos veces.
export function validarNoDuplicada(clase: Clase, reservas: Reserva[]): ResultadoValidacion {
  return estaReservada(clase.id, reservas) ? falla(MENSAJES.reservaDuplicada) : OK;
}

// RN-03: máximo 2 reservas por día de clase (en Bogotá). Cuenta también las
// reservas de clases de ese día que ya empezaron.
export function validarLimiteDiario(
  clase: Clase,
  clases: Clase[],
  reservas: Reserva[],
  now: Date,
): ResultadoValidacion {
  const dia = claveDia(inicioClase(clase, now));
  const reservasDelDia = reservas.filter((r) => {
    const reservada = clases.find((c) => c.id === r.claseId);
    return reservada !== undefined && claveDia(inicioClase(reservada, now)) === dia;
  }).length;
  return reservasDelDia < MAX_RESERVAS_POR_DIA ? OK : falla(MENSAJES.limiteDiario);
}

// RN-04: solo se puede cancelar si faltan 120 minutos o más para el inicio.
export function validarCancelacion(clase: Clase, now: Date): ResultadoValidacion {
  const restante = inicioClase(clase, now).getTime() - now.getTime();
  return restante >= MIN_ANTICIPACION_CANCELACION_MS ? OK : falla(MENSAJES.cancelacionTardia);
}

// Evalúa RN-02, RN-01 y RN-03 en ese orden y devuelve solo el primer fallo.
export function validarReserva(
  claseId: string,
  clases: Clase[],
  reservas: Reserva[],
  now: Date,
): ResultadoValidacion {
  const clase = clases.find((c) => c.id === claseId);
  if (!clase) {
    throw new Error(`Clase desconocida: ${claseId}`);
  }
  const validaciones = [
    () => validarNoDuplicada(clase, reservas),
    () => validarCupos(clase, reservas),
    () => validarLimiteDiario(clase, clases, reservas, now),
  ];
  for (const validar of validaciones) {
    const resultado = validar();
    if (!resultado.ok) {
      return resultado;
    }
  }
  return OK;
}
