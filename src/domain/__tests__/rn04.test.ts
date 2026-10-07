import { MENSAJES } from '../mensajes';
import { validarCancelacion } from '../reglas';
import { bogota, crearClase } from './testHelpers';

describe('RN-04 Cancelar solo hasta 2 horas antes', () => {
  const clase18 = crearClase({ diaOffset: 0, hora: '18:00' });

  test('Exactamente 2 horas antes', () => {
    expect(validarCancelacion(clase18, bogota('2026-10-07T16:00'))).toEqual({ ok: true });
  });

  test('1 hora 59 minutos antes', () => {
    expect(validarCancelacion(clase18, bogota('2026-10-07T16:01'))).toEqual({
      ok: false,
      mensaje: MENSAJES.cancelacionTardia,
    });
  });

  test('Con amplio margen', () => {
    const manana06 = crearClase({ diaOffset: 1, hora: '06:00' });
    expect(validarCancelacion(manana06, bogota('2026-10-07T20:00'))).toEqual({ ok: true });
  });
});
