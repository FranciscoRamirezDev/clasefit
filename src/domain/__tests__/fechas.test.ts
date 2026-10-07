import { fechaActualBogota, formatearDia, formatearHora, inicioClase, yaEmpezo } from '../fechas';
import { crearClase } from './testHelpers';

describe('HU-01 fechas', () => {
  test('Fecha de la clase calculada en Bogotá', () => {
    const now = new Date('2026-10-07T15:00:00Z'); // 10:00 en Bogotá
    const clase = crearClase({ diaOffset: 1, hora: '06:00' });
    expect(inicioClase(clase, now).toISOString()).toBe('2026-10-08T11:00:00.000Z');
  });

  test('Zona horaria del dispositivo distinta a Bogotá', () => {
    const now = new Date('2026-10-08T04:30:00Z'); // 2026-10-07 23:30 en Bogotá
    expect(fechaActualBogota(now)).toEqual({ anio: 2026, mes: 9, dia: 7 });
    const clase = crearClase({ diaOffset: 1, hora: '06:00' });
    expect(inicioClase(clase, now).toISOString()).toBe('2026-10-08T11:00:00.000Z');
  });

  test('Cambio de mes', () => {
    const now = new Date('2026-10-31T15:00:00Z');
    const clase = crearClase({ diaOffset: 2, hora: '08:00' });
    expect(inicioClase(clase, now).toISOString()).toBe('2026-11-02T13:00:00.000Z');
  });

  test('Día mostrado', () => {
    const now = new Date('2026-10-07T15:00:00Z');
    const inicio = inicioClase(crearClase({ diaOffset: 0, hora: '18:00' }), now);
    expect(formatearDia(inicio)).toBe('mié 7 oct');
    expect(formatearHora(inicio)).toBe('18:00');
  });

  describe('yaEmpezo', () => {
    const clase = crearClase({ diaOffset: 0, hora: '18:00' });
    const inicio = new Date('2026-10-07T23:00:00Z'); // 18:00 en Bogotá

    test('1 ms antes del inicio no ha empezado', () => {
      expect(yaEmpezo(clase, new Date(inicio.getTime() - 1))).toBe(false);
    });

    test('exactamente en el inicio ya empezó', () => {
      expect(yaEmpezo(clase, inicio)).toBe(true);
    });
  });
});
