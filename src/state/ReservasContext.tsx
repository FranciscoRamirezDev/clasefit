import { createContext, useCallback, useContext, useMemo, useReducer, useRef, type ReactNode } from 'react';

import datos from '../data/clases.json';
import { validarCancelacion, validarReserva } from '../domain/reglas';
import type { Clase, Reserva, ResultadoValidacion } from '../domain/types';
import { estadoInicial, reservasReducer } from './reservasReducer';

export const CLASES: Clase[] = datos.clases;

type ReservasContextValue = {
  clases: Clase[];
  reservas: Reserva[];
  reservar: (claseId: string) => ResultadoValidacion;
  cancelar: (claseId: string) => ResultadoValidacion;
};

const ReservasContext = createContext<ReservasContextValue | null>(null);

export function ReservasProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reservasReducer, estadoInicial);
  // Reservas más recientes, actualizadas también entre despachos sin re-render
  // (ej. dos toques rápidos), para que la validación nunca use un estado viejo.
  const reservasRef = useRef(state.reservas);
  reservasRef.current = state.reservas;

  const reservar = useCallback((claseId: string) => {
    const resultado = validarReserva(claseId, CLASES, reservasRef.current, new Date());
    if (resultado.ok) {
      const accion = { type: 'RESERVAR', claseId } as const;
      reservasRef.current = reservasReducer({ reservas: reservasRef.current }, accion).reservas;
      dispatch(accion);
    }
    return resultado;
  }, []);

  const cancelar = useCallback((claseId: string) => {
    const clase = CLASES.find((c) => c.id === claseId);
    if (!clase) {
      throw new Error(`Clase desconocida: ${claseId}`);
    }
    const resultado = validarCancelacion(clase, new Date());
    if (resultado.ok) {
      const accion = { type: 'CANCELAR', claseId } as const;
      reservasRef.current = reservasReducer({ reservas: reservasRef.current }, accion).reservas;
      dispatch(accion);
    }
    return resultado;
  }, []);

  const value = useMemo(
    () => ({ clases: CLASES, reservas: state.reservas, reservar, cancelar }),
    [state.reservas, reservar, cancelar],
  );

  return <ReservasContext.Provider value={value}>{children}</ReservasContext.Provider>;
}

export function useReservas(): ReservasContextValue {
  const ctx = useContext(ReservasContext);
  if (!ctx) {
    throw new Error('useReservas debe usarse dentro de ReservasProvider');
  }
  return ctx;
}
