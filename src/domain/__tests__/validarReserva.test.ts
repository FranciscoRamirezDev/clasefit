import { cuposDisponibles } from '../clases';
import { MENSAJES } from '../mensajes';
import { validarReserva } from '../reglas';
import { bogota, crearClase } from './testHelpers';

const now = bogota('2026-10-07T05:00');

describe('HU-02 Reservar una clase', () => {
  test('Reserva exitosa', () => {
    const clase = crearClase({ id: 'C-02', cupoTotal: 15, ocupados: 9 });
    expect(validarReserva('C-02', [clase], [], now)).toEqual({ ok: true });
    expect(cuposDisponibles(clase, [{ claseId: 'C-02' }])).toBe(cuposDisponibles(clase, []) - 1);
  });

  test('RN-02 se valida antes que RN-01', () => {
    const llena = crearClase({ id: 'L', cupoTotal: 12, ocupados: 11 });
    // Con la reserva del socio, la clase queda con 0 cupos disponibles.
    const reservas = [{ claseId: 'L' }];
    expect(cuposDisponibles(llena, reservas)).toBe(0);
    expect(validarReserva('L', [llena], reservas, now)).toEqual({
      ok: false,
      mensaje: MENSAJES.reservaDuplicada,
    });
  });

  test('RN-01 se valida antes que RN-03', () => {
    const clases = [
      crearClase({ id: 'A', diaOffset: 1, hora: '06:00' }),
      crearClase({ id: 'B', diaOffset: 1, hora: '07:00' }),
      crearClase({ id: 'LLENA', diaOffset: 1, hora: '19:00', cupoTotal: 30, ocupados: 30 }),
    ];
    const reservas = [{ claseId: 'A' }, { claseId: 'B' }];
    expect(validarReserva('LLENA', clases, reservas, now)).toEqual({
      ok: false,
      mensaje: MENSAJES.sinCupos,
    });
  });

  test('Una regla falla y no se reserva', () => {
    const clase = crearClase({ id: 'LLENA', cupoTotal: 12, ocupados: 12 });
    const reservas: { claseId: string }[] = [];
    const resultado = validarReserva('LLENA', [clase], reservas, now);
    expect(resultado.ok).toBe(false);
    expect(reservas).toHaveLength(0);
    expect(cuposDisponibles(clase, reservas)).toBe(0);
  });
});
