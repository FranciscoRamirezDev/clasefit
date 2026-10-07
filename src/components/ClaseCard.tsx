import { Pressable, StyleSheet, Text, View } from 'react-native';

import { cuposDisponibles } from '../domain/clases';
import { formatearDia, formatearHora, inicioClase } from '../domain/fechas';
import type { Clase, Reserva } from '../domain/types';

type Props = {
  clase: Clase;
  reservas: Reserva[];
  ahora: Date;
  accion: string;
  onAccion: () => void;
  // Solo en "Próximas clases": una clase llena muestra "Llena" y deshabilita el botón.
  deshabilitarSiLlena?: boolean;
};

export function ClaseCard({ clase, reservas, ahora, accion, onAccion, deshabilitarSiLlena }: Props) {
  const inicio = inicioClase(clase, ahora);
  const disponibles = cuposDisponibles(clase, reservas);
  const llena = disponibles <= 0;
  const deshabilitado = Boolean(deshabilitarSiLlena && llena);

  return (
    <View style={styles.card}>
      <View style={styles.encabezado}>
        <Text style={styles.nombre}>{clase.nombre}</Text>
        <Text style={[styles.cupos, llena && styles.llena]}>
          {llena ? 'Llena' : `${disponibles} de ${clase.cupoTotal} cupos`}
        </Text>
      </View>
      <Text style={styles.detalle}>
        {formatearDia(inicio)} · {formatearHora(inicio)}
      </Text>
      <Text style={styles.detalle}>{clase.instructor}</Text>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ disabled: deshabilitado }}
        disabled={deshabilitado}
        onPress={onAccion}
        style={({ pressed }) => [
          styles.boton,
          deshabilitado && styles.botonDeshabilitado,
          pressed && styles.botonPresionado,
        ]}
      >
        <Text style={[styles.textoBoton, deshabilitado && styles.textoBotonDeshabilitado]}>
          {accion}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  encabezado: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  nombre: { fontSize: 18, fontWeight: '600', color: '#111827' },
  cupos: { fontSize: 14, color: '#047857' },
  llena: { color: '#b91c1c', fontWeight: '600' },
  detalle: { fontSize: 14, color: '#4b5563', marginTop: 4 },
  boton: {
    marginTop: 12,
    backgroundColor: '#2563eb',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  botonDeshabilitado: { backgroundColor: '#e5e7eb' },
  botonPresionado: { opacity: 0.8 },
  textoBoton: { color: '#fff', fontWeight: '600', fontSize: 15 },
  textoBotonDeshabilitado: { color: '#9ca3af' },
});
