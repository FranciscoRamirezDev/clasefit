import { MENSAJES } from '../mensajes';
import { validarReserva } from '../reglas';
import { bogota, crearClase } from './testHelpers';

const LIMITE = { ok: false, mensaje: MENSAJES.limiteDiario };

describe('RN-03 Máximo 2 reservas por día de clase', () => {
  const now = bogota('2026-10-07T05:00');

  test('Tercera reserva el mismo día de clase', () => {
    const clases = [
      crearClase({ id: 'M1', diaOffset: 1, hora: '06:00' }),
      crearClase({ id: 'M2', diaOffset: 1, hora: '07:00' }),
      crearClase({ id: 'M3', diaOffset: 1, hora: '18:00' }),
    ];
    const reservas = [{ claseId: 'M1' }, { claseId: 'M2' }];
    expect(validarReserva('M3', clases, reservas, now)).toEqual(LIMITE);
  });

  test('Reservas hechas hoy para días distintos', () => {
    const clases = [
      crearClase({ id: 'M1', diaOffset: 1, hora: '06:00' }),
      crearClase({ id: 'M2', diaOffset: 1, hora: '07:00' }),
      crearClase({ id: 'H1', diaOffset: 0, hora: '18:00' }),
    ];
    const reservas = [{ claseId: 'M1' }, { claseId: 'M2' }];
    expect(validarReserva('H1', clases, reservas, now)).toEqual({ ok: true });
  });

  test('Segunda reserva del día permitida', () => {
    const clases = [
      crearClase({ id: 'P1', diaOffset: 2, hora: '08:00' }),
      crearClase({ id: 'P2', diaOffset: 2, hora: '09:00' }),
    ];
    expect(validarReserva('P2', clases, [{ claseId: 'P1' }], now)).toEqual({ ok: true });
  });

  test('Reservas de clases que ya empezaron cuentan para el límite', () => {
    const clases = [
      crearClase({ id: 'H06', diaOffset: 0, hora: '06:00' }),
      crearClase({ id: 'H18', diaOffset: 0, hora: '18:00' }),
      crearClase({ id: 'H20', diaOffset: 0, hora: '20:00' }),
    ];
    const reservas = [{ claseId: 'H06' }, { claseId: 'H18' }];
    expect(validarReserva('H20', clases, reservas, bogota('2026-10-07T10:00'))).toEqual(LIMITE);
  });
});
