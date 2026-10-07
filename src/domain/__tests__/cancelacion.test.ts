import { confirmarCancelacion, solicitarCancelacion } from '../cancelacion';
import { MENSAJES } from '../mensajes';
import { bogota, crearClase } from './testHelpers';

const RN04 = { ok: false, mensaje: MENSAJES.cancelacionTardia };

describe('HU-03 flujo de cancelación', () => {
  const clase18 = crearClase({ id: 'C-02', diaOffset: 0, hora: '18:00' });
  const otra = crearClase({ id: 'C-05', diaOffset: 1, hora: '06:00' });
  const clases = [clase18, otra];

  test('RN-04 se valida antes de pedir confirmación', () => {
    // Faltan 119 minutos: se muestra el mensaje y no se pide confirmación.
    expect(solicitarCancelacion(clase18, bogota('2026-10-07T16:01'))).toEqual(RN04);
  });

  test('RN-04 se revalida al confirmar', () => {
    const reservas = [{ claseId: 'C-02' }, { claseId: 'C-05' }];

    // Al pulsar cancelar faltan 120 minutos: se pide confirmación.
    expect(solicitarCancelacion(clase18, bogota('2026-10-07T16:00'))).toEqual({
      ok: true,
      accion: 'pedirConfirmacion',
    });

    // Al confirmar faltan 119 minutos: se rechaza y las reservas no cambian.
    expect(confirmarCancelacion('C-02', clases, reservas, bogota('2026-10-07T16:01'))).toEqual(RN04);
    expect(reservas).toEqual([{ claseId: 'C-02' }, { claseId: 'C-05' }]);
  });
});
