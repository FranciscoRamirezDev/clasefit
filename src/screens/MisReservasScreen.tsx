import { Alert, FlatList, StyleSheet, Text, View } from 'react-native';

import { ClaseCard } from '../components/ClaseCard';
import { solicitarCancelacion } from '../domain/cancelacion';
import { misReservas } from '../domain/clases';
import { MENSAJES } from '../domain/mensajes';
import type { Clase } from '../domain/types';
import { useReservas } from '../state/ReservasContext';
import { useAhora } from '../state/useAhora';

export function MisReservasScreen() {
  const { clases, reservas, cancelar } = useReservas();
  const ahora = useAhora();
  const lista = misReservas(clases, reservas, ahora);

  const onCancelar = (clase: Clase) => {
    // RN-04 lo decide el dominio: solicitarCancelacion al pulsar y
    // confirmarCancelacion (vía cancelar) al confirmar.
    const solicitud = solicitarCancelacion(clase, new Date());
    if (!solicitud.ok) {
      Alert.alert(solicitud.mensaje);
      return;
    }
    Alert.alert('Cancelar reserva', `¿Quieres cancelar tu reserva de ${clase.nombre}?`, [
      { text: 'No', style: 'cancel' },
      {
        text: 'Sí, cancelar',
        style: 'destructive',
        onPress: () => {
          const resultado = cancelar(clase.id);
          if (!resultado.ok) {
            Alert.alert(resultado.mensaje);
          }
        },
      },
    ]);
  };

  if (lista.length === 0) {
    return (
      <View style={styles.vacio}>
        <Text style={styles.textoVacio}>{MENSAJES.sinReservas}</Text>
      </View>
    );
  }

  return (
    <FlatList
      contentContainerStyle={styles.lista}
      data={lista}
      keyExtractor={(c) => c.id}
      renderItem={({ item }) => (
        <ClaseCard
          clase={item}
          reservas={reservas}
          ahora={ahora}
          accion="Cancelar"
          onAccion={() => onCancelar(item)}
        />
      )}
    />
  );
}

const styles = StyleSheet.create({
  lista: { padding: 16 },
  vacio: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  textoVacio: { fontSize: 16, color: '#6b7280' },
});
