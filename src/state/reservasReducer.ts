import type { Reserva } from '../domain/types';

export type ReservasState = { reservas: Reserva[] };

export type ReservasAction =
  | { type: 'RESERVAR'; claseId: string }
  | { type: 'CANCELAR'; claseId: string };

export const estadoInicial: ReservasState = { reservas: [] };

// Reducer puro: no valida reglas ni consulta el reloj; eso lo hace el dominio antes de despachar.
export function reservasReducer(state: ReservasState, action: ReservasAction): ReservasState {
  switch (action.type) {
    case 'RESERVAR':
      return { reservas: [...state.reservas, { claseId: action.claseId }] };
    case 'CANCELAR': {
      const reservas = state.reservas.filter((r) => r.claseId !== action.claseId);
      return reservas.length === state.reservas.length ? state : { reservas };
    }
  }
}
