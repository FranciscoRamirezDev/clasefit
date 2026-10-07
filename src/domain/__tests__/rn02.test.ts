import { MENSAJES } from '../mensajes';
import { validarReserva } from '../reglas';
import { bogota, crearClase } from './testHelpers';

describe('RN-02 No reservar la misma clase dos veces', () => {
  test('Reserva duplicada', () => {
    const clase = crearClase({ id: 'C-02' });
    const reservas = [{ claseId: 'C-02' }];
    expect(validarReserva('C-02', [clase], reservas, bogota('2026-10-07T08:00'))).toEqual({
      ok: false,
      mensaje: MENSAJES.reservaDuplicada,
    });
    expect(reservas.filter((r) => r.claseId === 'C-02')).toHaveLength(1);
  });
});
