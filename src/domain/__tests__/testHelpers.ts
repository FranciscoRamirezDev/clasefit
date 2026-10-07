import type { Clase } from '../types';

export function crearClase(parcial: Partial<Clase> = {}): Clase {
  return {
    id: 'C-X',
    nombre: 'Funcional',
    instructor: 'Camila Ospina',
    diaOffset: 0,
    hora: '18:00',
    duracionMin: 60,
    cupoTotal: 15,
    ocupados: 9,
    ...parcial,
  };
}

// Instante en hora de Bogotá (UTC-5) expresado sin depender de la zona de la máquina.
export function bogota(fechaHora: string): Date {
  return new Date(`${fechaHora}:00-05:00`);
}
