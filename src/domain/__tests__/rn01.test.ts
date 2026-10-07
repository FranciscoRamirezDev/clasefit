import { cuposDisponibles } from '../clases';
import { MENSAJES } from '../mensajes';
import { validarCupos, validarReserva } from '../reglas';
import { bogota, crearClase } from './testHelpers';

const now = bogota('2026-10-07T08:00');

describe('RN-01 No reservar clases sin cupos', () => {
  test('Clase llena', () => {
    const clase = crearClase({ cupoTotal: 12, ocupados: 12 });
    expect(validarCupos(clase, [])).toEqual({ ok: false, mensaje: MENSAJES.sinCupos });
  });

  test('Último cupo disponible', () => {
    const clase = crearClase({ cupoTotal: 15, ocupados: 14 });
    expect(validarCupos(clase, [])).toEqual({ ok: true });
    expect(cuposDisponibles(clase, [{ claseId: clase.id }])).toBe(0);
  });

  test('Regla aplicada sin depender de la UI', () => {
    const clase = crearClase({ id: 'LLENA', cupoTotal: 12, ocupados: 12 });
    expect(validarReserva('LLENA', [clase], [], now)).toEqual({
      ok: false,
      mensaje: MENSAJES.sinCupos,
    });
  });
});
