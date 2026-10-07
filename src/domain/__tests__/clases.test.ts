import { cuposDisponibles, misReservas, proximasClases } from '../clases';
import { bogota, crearClase } from './testHelpers';

const hoy06 = crearClase({ id: 'A', diaOffset: 0, hora: '06:00' });
const hoy18 = crearClase({ id: 'B', diaOffset: 0, hora: '18:00' });
const manana07 = crearClase({ id: 'C', diaOffset: 1, hora: '07:00' });
const pasado08 = crearClase({ id: 'D', diaOffset: 2, hora: '08:00' });
const clases = [pasado08, hoy18, manana07, hoy06];

describe('HU-01 cupos y próximas clases', () => {
  test('Formato de cupos disponibles sin reserva del socio', () => {
    const clase = crearClase({ cupoTotal: 15, ocupados: 9 });
    expect(cuposDisponibles(clase, [])).toBe(6);
  });

  test('Cupos disponibles con reserva del socio', () => {
    const clase = crearClase({ cupoTotal: 15, ocupados: 9 });
    expect(cuposDisponibles(clase, [{ claseId: clase.id }])).toBe(5);
  });

  test('Lista ordenada de los tres días', () => {
    const now = bogota('2026-10-07T05:00');
    expect(proximasClases(clases, [], now).map((c) => c.id)).toEqual(['A', 'B', 'C', 'D']);
  });

  test('Clase que ya empezó no aparece', () => {
    const now = bogota('2026-10-07T10:00');
    expect(proximasClases(clases, [], now).map((c) => c.id)).toEqual(['B', 'C', 'D']);
  });

  test('Clase en el instante exacto de inicio', () => {
    const now = bogota('2026-10-07T18:00');
    expect(proximasClases(clases, [], now).map((c) => c.id)).not.toContain('B');
  });
});

describe('HU-03 mis reservas', () => {
  test('Reservas ordenadas por proximidad', () => {
    const now = bogota('2026-10-07T05:00');
    const reservas = [{ claseId: 'D' }, { claseId: 'A' }, { claseId: 'C' }];
    expect(misReservas(clases, reservas, now).map((c) => c.id)).toEqual(['A', 'C', 'D']);
  });

  test('Sin reservas', () => {
    expect(misReservas(clases, [], bogota('2026-10-07T05:00'))).toEqual([]);
  });

  test('Reserva de una clase que ya empezó no aparece', () => {
    const now = bogota('2026-10-07T06:00');
    const reservas = [{ claseId: 'A' }, { claseId: 'B' }];
    expect(misReservas(clases, reservas, now).map((c) => c.id)).toEqual(['B']);
  });
});
