import type { Clase } from './types';

// America/Bogota es UTC-5 todo el año (Colombia no tiene horario de verano).
export const OFFSET_BOGOTA_MS = -5 * 60 * 60 * 1000;

const DIAS_SEMANA = ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'];
const MESES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];

// Fecha desplazada a Bogotá: sus getters UTC devuelven la hora de pared en Bogotá.
function enBogota(instante: Date): Date {
  return new Date(instante.getTime() + OFFSET_BOGOTA_MS);
}

function dosDigitos(n: number): string {
  return n < 10 ? `0${n}` : String(n);
}

export function fechaActualBogota(now: Date): { anio: number; mes: number; dia: number } {
  const b = enBogota(now);
  return { anio: b.getUTCFullYear(), mes: b.getUTCMonth(), dia: b.getUTCDate() };
}

export function inicioClase(clase: Clase, now: Date): Date {
  const { anio, mes, dia } = fechaActualBogota(now);
  const [hh, mm] = clase.hora.split(':').map(Number);
  return new Date(Date.UTC(anio, mes, dia + clase.diaOffset, hh, mm) - OFFSET_BOGOTA_MS);
}

export function claveDia(instante: Date): string {
  const b = enBogota(instante);
  return `${b.getUTCFullYear()}-${dosDigitos(b.getUTCMonth() + 1)}-${dosDigitos(b.getUTCDate())}`;
}

export function yaEmpezo(clase: Clase, now: Date): boolean {
  return now.getTime() >= inicioClase(clase, now).getTime();
}

export function formatearDia(instante: Date): string {
  const b = enBogota(instante);
  return `${DIAS_SEMANA[b.getUTCDay()]} ${b.getUTCDate()} ${MESES[b.getUTCMonth()]}`;
}

export function formatearHora(instante: Date): string {
  const b = enBogota(instante);
  return `${dosDigitos(b.getUTCHours())}:${dosDigitos(b.getUTCMinutes())}`;
}
