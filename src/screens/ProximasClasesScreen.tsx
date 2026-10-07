import { Alert, FlatList, StyleSheet } from 'react-native';

import { ClaseCard } from '../components/ClaseCard';
import { proximasClases } from '../domain/clases';
import { MENSAJES } from '../domain/mensajes';
import { useReservas } from '../state/ReservasContext';
import { useAhora } from '../state/useAhora';

export function ProximasClasesScreen() {
  const { clases, reservas, reservar } = useReservas();
  const ahora = useAhora();

  const onReservar = (claseId: string) => {
    const resultado = reservar(claseId);
    Alert.alert(resultado.ok ? MENSAJES.reservaExitosa : resultado.mensaje);
  };

  return (
    <FlatList
      contentContainerStyle={styles.lista}
      data={proximasClases(clases, reservas, ahora)}
      keyExtractor={(c) => c.id}
      renderItem={({ item }) => (
        <ClaseCard
          clase={item}
          reservas={reservas}
          ahora={ahora}
          accion="Reservar"
          onAccion={() => onReservar(item.id)}
          deshabilitarSiLlena
        />
      )}
    />
  );
}

const styles = StyleSheet.create({
  lista: { padding: 16 },
});
