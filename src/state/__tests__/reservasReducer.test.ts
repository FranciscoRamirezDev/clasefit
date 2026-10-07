import { estadoInicial, reservasReducer } from '../reservasReducer';

describe('reservasReducer', () => {
  test('reservar agrega la reserva', () => {
    const estado = reservasReducer(estadoInicial, { type: 'RESERVAR', claseId: 'C-02' });
    expect(estado.reservas).toEqual([{ claseId: 'C-02' }]);
  });

  test('cancelar quita la reserva', () => {
    const estado = reservasReducer(
      { reservas: [{ claseId: 'C-02' }, { claseId: 'C-05' }] },
      { type: 'CANCELAR', claseId: 'C-02' },
    );
    expect(estado.reservas).toEqual([{ claseId: 'C-05' }]);
  });

  test('cancelar una reserva inexistente no cambia el estado', () => {
    const inicial = { reservas: [{ claseId: 'C-05' }] };
    expect(reservasReducer(inicial, { type: 'CANCELAR', claseId: 'C-02' })).toBe(inicial);
  });
});
