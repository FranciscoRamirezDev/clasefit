import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { TabSelector } from './src/components/TabSelector';
import { MisReservasScreen } from './src/screens/MisReservasScreen';
import { ProximasClasesScreen } from './src/screens/ProximasClasesScreen';
import { ReservasProvider } from './src/state/ReservasContext';

type Pestana = 'proximas' | 'reservas';

const PESTANAS: { id: Pestana; titulo: string }[] = [
  { id: 'proximas', titulo: 'Próximas clases' },
  { id: 'reservas', titulo: 'Mis reservas' },
];

export default function App() {
  const [pestana, setPestana] = useState<Pestana>('proximas');

  return (
    <ReservasProvider>
      <View style={styles.container}>
        <Text style={styles.titulo}>ClaseFit</Text>
        <TabSelector pestanas={PESTANAS} activa={pestana} onCambiar={setPestana} />
        <View style={styles.contenido}>
          {pestana === 'proximas' ? <ProximasClasesScreen /> : <MisReservasScreen />}
        </View>
        <StatusBar style="dark" />
      </View>
    </ReservasProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    paddingTop: 56,
  },
  titulo: { fontSize: 24, fontWeight: '700', color: '#111827', marginHorizontal: 16, marginBottom: 12 },
  contenido: { flex: 1 },
});
