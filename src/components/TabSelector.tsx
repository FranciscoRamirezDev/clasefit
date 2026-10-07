import { Pressable, StyleSheet, Text, View } from 'react-native';

type Props<T extends string> = {
  pestanas: { id: T; titulo: string }[];
  activa: T;
  onCambiar: (id: T) => void;
};

export function TabSelector<T extends string>({ pestanas, activa, onCambiar }: Props<T>) {
  return (
    <View style={styles.contenedor} accessibilityRole="tablist">
      {pestanas.map((p) => {
        const seleccionada = p.id === activa;
        return (
          <Pressable
            key={p.id}
            accessibilityRole="tab"
            accessibilityState={{ selected: seleccionada }}
            onPress={() => onCambiar(p.id)}
            style={[styles.pestana, seleccionada && styles.pestanaActiva]}
          >
            <Text style={[styles.texto, seleccionada && styles.textoActivo]}>{p.titulo}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flexDirection: 'row',
    backgroundColor: '#e5e7eb',
    borderRadius: 10,
    padding: 4,
    marginHorizontal: 16,
  },
  pestana: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 8 },
  pestanaActiva: { backgroundColor: '#fff' },
  texto: { fontSize: 15, color: '#4b5563' },
  textoActivo: { color: '#111827', fontWeight: '600' },
});
